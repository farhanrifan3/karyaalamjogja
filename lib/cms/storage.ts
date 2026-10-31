import { promises as fs } from "node:fs";
import path from "node:path";

import { commitContent } from "@/lib/cms/git";
import {
  GithubError,
  githubCommit,
  githubExists,
  githubListDir,
  githubReadFile,
  readGithubConfig,
  type GithubConfig,
} from "@/lib/cms/github";

/**
 * Tag cache untuk isi katalog. Server action memanggil `updateTag(CONTENT_TAG)`
 * setelah menulis supaya halaman publik langsung memakai data baru.
 */
export const CONTENT_TAG = "cms-content";

export type StorageEntry = {
  name: string;
  type: "file" | "dir";
};

export type StorageFile = {
  path: string;
  data: string | Uint8Array;
};

export type Storage = {
  driver: "fs" | "github";
  readText(file: string): Promise<string | null>;
  readBinary(file: string): Promise<Uint8Array | null>;
  exists(file: string): Promise<boolean>;
  listDir(dir: string): Promise<StorageEntry[]>;
  commit(files: StorageFile[], message: string): Promise<void>;
};

const ROOT = process.cwd();

function resolveLocal(file: string): string {
  // Konten hanya boleh berada di content/ atau public/. Ignore tracing ini
  // mencegah seluruh proyek ikut dibundel ke fungsi serverless.
  const resolved = path.resolve(/* turbopackIgnore: true */ ROOT, file);

  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    throw new Error(`Path konten tidak dikenal: ${file}`);
  }

  return resolved;
}

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

/**
 * Penyimpanan lokal: berkas ditulis ke disk, lalu opsional di-commit lewat
 * `git` bila CMS_GIT_COMMIT=1.
 */
const fileStorage: Storage = {
  driver: "fs",

  async readText(file) {
    try {
      return await fs.readFile(resolveLocal(file), "utf8");
    } catch (error) {
      if (isMissing(error)) {
        return null;
      }
      throw error;
    }
  },

  async readBinary(file) {
    try {
      return new Uint8Array(await fs.readFile(resolveLocal(file)));
    } catch (error) {
      if (isMissing(error)) {
        return null;
      }
      throw error;
    }
  },

  async exists(file) {
    try {
      await fs.access(resolveLocal(file));
      return true;
    } catch {
      return false;
    }
  },

  async listDir(dir) {
    try {
      const entries = await fs.readdir(
        /* turbopackIgnore: true */ resolveLocal(dir),
        {
          withFileTypes: true,
        },
      );

      return entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "dir" : "file",
      }));
    } catch (error) {
      if (isMissing(error)) {
        return [];
      }
      throw error;
    }
  },

  async commit(files, message) {
    for (const file of files) {
      const target = resolveLocal(file.path);
      await fs.mkdir(path.dirname(target), { recursive: true });

      if (typeof file.data === "string") {
        const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
        await fs.writeFile(temporary, file.data, "utf8");
        await fs.rename(temporary, target);
      } else {
        await fs.writeFile(target, file.data);
      }
    }

    await commitContent(
      files.map((file) => file.path),
      message,
    );
  },
};

/**
 * Penyimpanan GitHub. Pembacaan memakai cache Next; bila API gagal (misalnya
 * saat build tanpa jaringan), pembacaan jatuh ke berkas hasil checkout.
 * Penulisan selalu ke repository, tidak pernah ke disk.
 */
function githubStorage(config: GithubConfig): Storage {
  return {
    driver: "github",

    async readText(file) {
      try {
        const data = await githubReadFile(config, file, {
          revalidate: 60,
          tags: [CONTENT_TAG],
        });

        return data ? new TextDecoder().decode(data) : null;
      } catch (error) {
        console.warn(`[cms] baca GitHub gagal (${file}), memakai berkas lokal.`);
        return fileStorage.readText(file);
      }
    },

    async readBinary(file) {
      try {
        return await githubReadFile(config, file, {
          revalidate: 3600,
          tags: [CONTENT_TAG],
        });
      } catch (error) {
        console.warn(`[cms] baca foto GitHub gagal (${file}).`, error);
        return fileStorage.readBinary(file);
      }
    },

    async exists(file) {
      try {
        return await githubExists(config, file);
      } catch (error) {
        if (error instanceof GithubError) {
          console.warn(`[cms] cek GitHub gagal (${file}).`, error);
        }
        return fileStorage.exists(file);
      }
    },

    async listDir(dir) {
      try {
        return await githubListDir(config, dir);
      } catch (error) {
        console.warn(`[cms] daftar GitHub gagal (${dir}).`, error);
        return fileStorage.listDir(dir);
      }
    },

    async commit(files, message) {
      await githubCommit(config, files, message);
    },
  };
}

let cached: Storage | null = null;

/**
 * Pilih penyimpanan:
 * - Saat `next build`, selalu pakai berkas hasil checkout supaya build tidak
 *   bergantung pada jaringan GitHub.
 * - `CMS_STORAGE=fs` memaksa disk lokal.
 * - `CMS_STORAGE=github` memaksa GitHub (wajib ada token + repo).
 * - Tanpa nilai: GitHub bila GITHUB_TOKEN dan GITHUB_REPO tersedia.
 */
export function getStorage(): Storage {
  if (cached) {
    return cached;
  }

  const mode = process.env.CMS_STORAGE?.trim().toLowerCase();
  const config = readGithubConfig();
  const building = process.env.NEXT_PHASE === "phase-production-build";

  if (mode === "github" && !config) {
    throw new Error(
      "CMS_STORAGE=github membutuhkan GITHUB_TOKEN dan GITHUB_REPO.",
    );
  }

  if (mode === "fs" || (building && mode !== "github")) {
    cached = fileStorage;
  } else if (config) {
    cached = githubStorage(config);
  } else {
    cached = fileStorage;
  }

  return cached;
}
