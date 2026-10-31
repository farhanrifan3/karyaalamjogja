import { getStorage } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

type UploadRouteProps = {
  params: Promise<{ file: string[] }>;
};

/**
 * Foto yang diunggah lewat CMS dibuat setelah build, jadi tidak masuk manifes
 * berkas statis Next. Route ini membacanya dari penyimpanan konten: disk lokal
 * saat pengembangan, atau GitHub saat berjalan di Vercel.
 */
export async function GET(_request: Request, { params }: UploadRouteProps) {
  const { file } = await params;
  const name = file.join("/");

  if (!/^[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif)$/i.test(name)) {
    return new Response("Foto tidak ditemukan.", { status: 404 });
  }

  let data: Uint8Array | null = null;

  try {
    data = await getStorage().readBinary(`public/uploads/${name}`);
  } catch (error) {
    console.error(`[cms] gagal membaca foto ${name}:`, error);
  }

  if (!data) {
    return new Response("Foto tidak ditemukan.", { status: 404 });
  }

  const extension = name.split(".").pop()?.toLowerCase() ?? "";

  return new Response(new Uint8Array(data), {
    headers: {
      "content-type": CONTENT_TYPES[extension] ?? "application/octet-stream",
      "content-length": String(data.byteLength),
      "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
