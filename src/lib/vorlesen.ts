// Vorlesung eines Artikels: eine MP3 und eine Beschreibung (public/vorlesen/<kennung>.json), die das
// Vertonungswerkzeug der Vorschau schreibt. Jeder Abschnitt nennt den gesprochenen Block (Nummer aus
// vorlesen-markieren.mjs, -1 für den Titel), seine Zeit in der Datei und einen Prüfwert seines Texts. Der Spieler zeigt
// sich nur, wenn alle Prüfwerte zum Text der Seite passen; ein geänderter Artikel verliert so seine alte Vorlesung,
// bis sie neu gesprochen ist. Diese Datei läuft im Bau und im Browser; das Laden der Beschreibung steht im Spieler.

export interface Abschnitt {
  /** Nummer des Blocks im Artikel, -1 für den Titel */
  n: number;
  /** Beginn und Ende in Sekunden */
  start: number;
  ende: number;
  /** Prüfwert des Texts (pruefwert) */
  pruef: string;
}

export interface Vorlesung {
  datei: string;
  bytes: number;
  dauer: number;
  stimme: string;
  abschnitte: Abschnitt[];
}

/** Text eines Blocks so, wie er geprüft wird: Leerraum zusammengefasst. */
export function pruefText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** FNV-1a über die Codepunkte, 32 Bit, hexadezimal; das Vertonungswerkzeug rechnet genauso. */
export function pruefwert(text: string): string {
  let h = 0x811c9dc5;
  for (const zeichen of pruefText(text)) {
    h ^= zeichen.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
