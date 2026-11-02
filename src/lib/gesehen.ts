// Welche Artikel dieser Browser schon kennt, für die Marke "neu" in der Artikelliste (components/ArtikelListe.astro).
// Nur im Browser des Lesers gemerkt, nichts geht an einen Server. Beim allerersten Besuch gilt alles Gezeigte als
// bekannt, damit nicht jede Seite voller "neu" steht. Ein Artikel verliert die Marke, sobald er geöffnet wurde.
export const GESEHEN_SCHLUESSEL = "kiw-gesehen";

export function gesehene(): Set<string> | null {
  try {
    const wert = localStorage.getItem(GESEHEN_SCHLUESSEL);
    return wert === null ? null : new Set(JSON.parse(wert) as string[]);
  } catch {
    return null;
  }
}

export function merken(kennungen: Iterable<string>): void {
  const alle = gesehene() ?? new Set<string>();
  for (const k of kennungen) alle.add(k);
  try {
    localStorage.setItem(GESEHEN_SCHLUESSEL, JSON.stringify([...alle]));
  } catch {
    // ohne Speicher gibt es keine Marke "neu"
  }
}
