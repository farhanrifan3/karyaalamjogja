import { redirect } from "next/navigation";

export function redirectWithAdminFeedback(path: string, feedback: string): never {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("feedback", feedback);
  redirect(`${pathname}?${params.toString()}`);
}
