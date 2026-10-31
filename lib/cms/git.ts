import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

let insideRepo: boolean | undefined;

/**
 * Commit opsional untuk berkas konten. Aktifkan dengan CMS_GIT_COMMIT=1.
 * Hanya berkas yang disebut yang di-commit, jadi perubahan kode yang sedang
 * dikerjakan tidak ikut terbawa.
 */
export async function commitContent(
  paths: string[],
  message: string,
): Promise<void> {
  if (process.env.CMS_GIT_COMMIT !== "1" || paths.length === 0) {
    return;
  }

  const cwd = process.cwd();

  try {
    if (insideRepo === undefined) {
      const { stdout } = await run("git", ["rev-parse", "--is-inside-work-tree"], {
        cwd,
      });
      insideRepo = stdout.trim() === "true";
    }

    if (!insideRepo) {
      return;
    }

    await run("git", ["add", "--", ...paths], { cwd });
    await run("git", ["commit", "--only", "-m", message, "--", ...paths], {
      cwd,
    });
  } catch (error) {
    // Commit yang gagal tidak boleh membatalkan penyimpanan konten.
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[cms] commit konten dilewati: ${reason}`);
  }
}
