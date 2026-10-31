// Verweise innerhalb der Seite: jeder Weg bekommt den Unterpfad der Veröffentlichung (astro.config.mjs, base) vorn.

const BASIS = import.meta.env.BASE_URL.replace(/\/$/, "");

export function pfad(weg: string): string {
  return `${BASIS}${weg.startsWith("/") ? weg : `/${weg}`}`;
}

// Ist der Weg die aktuelle Seite oder liegt sie darunter? Die Startseite gilt nur für sich selbst.
export function istAktiv(weg: string, aktuell: string): boolean {
  const ziel = pfad(weg);
  return ziel === pfad("/") ? aktuell === ziel : aktuell.startsWith(ziel);
}
