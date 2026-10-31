import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "ka_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 jam

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 6;

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "karyaalam";
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    `karya-alam-cms-dev:${adminPassword()}`
  );
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function usesDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE * 1000 }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return false;
  }

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(payload);

  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    return false;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: unknown };

    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function checkPassword(input: string): boolean {
  const given = createHash("sha256").update(input).digest();
  const wanted = createHash("sha256").update(adminPassword()).digest();
  return timingSafeEqual(given, wanted);
}

export async function clientKey(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "lokal";
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= RATE_MAX_ATTEMPTS;
}

export function registerFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }

  entry.count += 1;
}

export function clearFailures(key: string): void {
  attempts.delete(key);
}

export function rateLimitMinutes(): number {
  return Math.round(RATE_WINDOW_MS / 60000);
}
