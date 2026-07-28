'use client';

/**
 * Shrink a photo in the browser before it is uploaded.
 *
 * Straight-from-the-phone photos are 4-8 MB, and the gateway in front of Django
 * drops request bodies above roughly 5 MB with a 502 — no JSON, so the panel
 * could only report "something went wrong". Re-encoding here keeps uploads well
 * under that ceiling, makes them quick on a slow connection, and means the site
 * serves sensible files instead of camera originals.
 *
 * A file is returned untouched when shrinking it would be wrong or impossible:
 * an animated GIF would lose its animation, an SVG is not a raster, and anything
 * the browser cannot decode (HEIC, for one) is better sent as-is so the server's
 * own validator can produce a real message.
 */

/** Long edge, in pixels. Comfortably above what any article layout renders. */
const MAX_EDGE = 2400;

/** Below this, re-encoding buys little and can even cost bytes. */
const SKIP_UNDER_BYTES = 900 * 1024;

const QUALITY = 0.82;

/** Formats the backend accepts and the canvas can produce. */
const PREFERRED_TYPE = 'image/webp';
const FALLBACK_TYPE = 'image/jpeg';

function canEncode(type: string): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL(type).startsWith(`data:${type}`);
}

function renamed(name: string, type: string): string {
  const stem = name.replace(/\.[^.]+$/, '') || 'photo';
  return `${stem}.${type === PREFERRED_TYPE ? 'webp' : 'jpg'}`;
}

export async function compressImage(file: File): Promise<File> {
  const untouchable =
    file.type === 'image/gif' || // animation would be flattened
    file.type === 'image/svg+xml' ||
    !file.type.startsWith('image/');

  if (untouchable || file.size <= SKIP_UNDER_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    // `from-image` applies the EXIF rotation, so portrait phone shots do not
    // come out sideways once the orientation tag is dropped by re-encoding.
    bitmap = await createImageBitmap(file, {imageOrientation: 'from-image'});
  } catch {
    return file; // undecodable here — let the server judge it
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);

    const type = canEncode(PREFERRED_TYPE) ? PREFERRED_TYPE : FALLBACK_TYPE;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, QUALITY),
    );

    // Only take the result if it is actually smaller — a small, already-optimal
    // JPEG can grow when re-encoded.
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], renamed(file.name, type), {
      type,
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}
