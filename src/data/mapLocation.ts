/**
 * Where the pin sits on the contact page map.
 *
 * Held as coordinates rather than geocoded from the address: Google resolved
 * "1 Amir Temur Avenue, Tashkent" to a point roughly a kilometre north of the
 * building, so the pin is fixed to the exact spot instead.
 *
 * Unlike the address, email and phone, this is NOT part of "Site settings" in
 * the Django admin — the backend has no coordinate fields — so this file is the
 * one place to change the pin. Editors cannot move it from the panel.
 */
export const mapLocation = {
  latitude: 41.312215,
  longitude: 69.240616,
  zoom: 16,
} as const;

/** Embeddable map: `output=embed` drops Google's full page chrome. */
export function mapEmbedSrc(): string {
  const {latitude, longitude, zoom} = mapLocation;
  const point = `${latitude},${longitude}`;
  return `https://maps.google.com/maps?q=${point}&ll=${point}&z=${zoom}&output=embed`;
}
