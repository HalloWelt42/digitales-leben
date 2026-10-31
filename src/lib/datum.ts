// Datumsangaben einheitlich: sichtbar deutsch (27.10.2026), maschinenlesbar als ISO-Tag.

const FORMAT = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

export function datumText(datum: Date): string {
  return FORMAT.format(datum);
}

export function datumIso(datum: Date): string {
  return datum.toISOString().slice(0, 10);
}
