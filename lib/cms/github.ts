/**
 * Klien GitHub Contents + Git Data API.
 *
 * Dipakai saat CMS berjalan di platform tanpa filesystem tulis (Vercel).
 * Semua perubahan konten menjadi satu commit di repository, sehingga riwayat
 * katalog tetap bisa diaudit dan deployment berikutnya memakai data terbaru.
 */

const DEFAULT_API_ROOT = "https://api.github.com";

export type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  apiRoot: string;
};

export class GithubError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GithubError";
    this.status = status;
  }
}

export function readGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const slug = process.env.GITHUB_REPO?.trim();

  if (!token || !slug) {
    return null;
  }

  const [owner, repo] = slug.split("/");
  if (!owner || !repo) {
    console.warn("[cms] GITHUB_REPO harus berformat owner/repo.");
    return null;
  }

  return {
    token,
    owner,
    repo,
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
    apiRoot:
      process.env.GITHUB_API_URL?.trim().replace(/\/+$/, "") || DEFAULT_API_ROOT,
  };
}

type GithubRequest = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  accept?: string;
  revalidate?: number;
  tags?: string[];
  cache?: RequestCache;
};

function encodePath(value: string): string {
  return value
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function request(
  config: GithubConfig,
  endpoint: string,
  options: GithubRequest = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    accept: options.accept ?? "application/vnd.github+json",
    authorization: `Bearer ${config.token}`,
    "x-github-api-version": "2022-11-28",
    "user-agent": "karya-alam-cms",
  };

  if (options.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  if (options.cache) {
    init.cache = options.cache;
  } else if (options.revalidate !== undefined || options.tags) {
    init.next = {
      revalidate: options.revalidate,
      tags: options.tags,
    };
  }

  const response = await fetch(
    `${config.apiRoot}/repos/${config.owner}/${config.repo}${endpoint}`,
    init,
  );

  if (!response.ok) {
    let detail = "";
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {
      // Pesan error GitHub tidak wajib ada.
    }

    throw new GithubError(
      response.status,
      `GitHub ${response.status}: ${detail || response.statusText}`,
    );
  }

  return response;
}

async function requestJson<T>(
  config: GithubConfig,
  endpoint: string,
  options: GithubRequest = {},
): Promise<T> {
  const response = await request(config, endpoint, options);
  return (await response.json()) as T;
}

function contentEndpoint(config: GithubConfig, file: string): string {
  return `/contents/${encodePath(file)}?ref=${encodeURIComponent(config.branch)}`;
}

export type GithubEntry = {
  name: string;
  type: "file" | "dir";
};

export async function githubReadFile(
  config: GithubConfig,
  file: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<Uint8Array | null> {
  try {
    const response = await request(config, contentEndpoint(config, file), {
      accept: "application/vnd.github.raw",
      revalidate: options.revalidate ?? 60,
      tags: options.tags,
    });

    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    if (error instanceof GithubError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function githubExists(
  config: GithubConfig,
  file: string,
): Promise<boolean> {
  try {
    await request(config, contentEndpoint(config, file), { revalidate: 30 });
    return true;
  } catch (error) {
    if (error instanceof GithubError && error.status === 404) {
      return false;
    }
    throw error;
  }
}

export async function githubListDir(
  config: GithubConfig,
  dir: string,
): Promise<GithubEntry[]> {
  try {
    const data = await requestJson<unknown>(
      config,
      contentEndpoint(config, dir),
      { revalidate: 30 },
    );

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter(
        (entry): entry is { name: string; type: string } =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof (entry as { name?: unknown }).name === "string",
      )
      .map((entry) => ({
        name: entry.name,
        type: entry.type === "dir" ? "dir" : "file",
      }));
  } catch (error) {
    if (error instanceof GithubError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

type GitRef = { object?: { sha?: string } };
type GitCommit = { tree?: { sha?: string } };
type GitObject = { sha?: string };

function refEndpoint(config: GithubConfig): string {
  return `/git/ref/heads/${encodePath(config.branch)}`;
}

function refsEndpoint(config: GithubConfig): string {
  return `/git/refs/heads/${encodePath(config.branch)}`;
}

function toBase64(data: string | Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

/**
 * Menulis beberapa berkas dalam satu commit memakai Git Data API.
 * Bila ada commit lain yang masuk lebih dulu, percobaan diulang dengan
 * HEAD terbaru supaya perubahan tidak saling menimpa.
 */
export async function githubCommit(
  config: GithubConfig,
  files: { path: string; data: string | Uint8Array }[],
  message: string,
): Promise<void> {
  if (files.length === 0) {
    return;
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const ref = await requestJson<GitRef>(config, refEndpoint(config), {
      cache: "no-store",
    });
    const headSha = ref.object?.sha;

    if (!headSha) {
      throw new Error("Cabang GitHub tidak ditemukan. Periksa GITHUB_BRANCH.");
    }

    const head = await requestJson<GitCommit>(
      config,
      `/git/commits/${headSha}`,
      { cache: "no-store" },
    );
    const baseTree = head.tree?.sha;

    if (!baseTree) {
      throw new Error("Commit GitHub tidak memiliki tree.");
    }

    const blobs = await Promise.all(
      files.map(async (file) => {
        const blob = await requestJson<GitObject>(config, "/git/blobs", {
          method: "POST",
          body: {
            content: toBase64(file.data),
            encoding: "base64",
          },
          cache: "no-store",
        });

        if (!blob.sha) {
          throw new Error(`Gagal membuat blob untuk ${file.path}.`);
        }

        return blob.sha;
      }),
    );

    const tree = await requestJson<GitObject>(config, "/git/trees", {
      method: "POST",
      body: {
        base_tree: baseTree,
        tree: files.map((file, index) => ({
          path: file.path,
          mode: "100644",
          type: "blob",
          sha: blobs[index],
        })),
      },
      cache: "no-store",
    });

    if (!tree.sha) {
      throw new Error("Gagal membuat tree GitHub.");
    }

    const commit = await requestJson<GitObject>(config, "/git/commits", {
      method: "POST",
      body: {
        message,
        tree: tree.sha,
        parents: [headSha],
      },
      cache: "no-store",
    });

    if (!commit.sha) {
      throw new Error("Gagal membuat commit GitHub.");
    }

    try {
      await request(config, refsEndpoint(config), {
        method: "PATCH",
        body: { sha: commit.sha, force: false },
        cache: "no-store",
      });
      return;
    } catch (error) {
      const conflict =
        error instanceof GithubError &&
        (error.status === 409 || error.status === 422);

      if (conflict && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
        continue;
      }

      throw error;
    }
  }
}
