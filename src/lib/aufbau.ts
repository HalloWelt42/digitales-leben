// Bausteine des Artikelaufbaus, die Schema, Seiten und Suche gemeinsam nutzen: die Arten der Schlagworte und der
// Nachträge. Neue Arten kommen nur hier hinzu.

export const SCHLAGWORT_ARTEN = [
  { schluessel: "modell", name: "Modell", mehrzahl: "Modelle" },
  { schluessel: "faehigkeit", name: "Fähigkeit", mehrzahl: "Fähigkeiten" },
  { schluessel: "geraet", name: "Gerät", mehrzahl: "Geräte" },
] as const;

export type SchlagwortArt = (typeof SCHLAGWORT_ARTEN)[number]["schluessel"];

export const NACHTRAG_ARTEN = [
  { schluessel: "korrektur", name: "Korrektur" },
  { schluessel: "erweiterung", name: "Erweiterung" },
] as const;

export type NachtragArt = (typeof NACHTRAG_ARTEN)[number]["schluessel"];

export function schlagwortArt(schluessel: SchlagwortArt) {
  return SCHLAGWORT_ARTEN.find((a) => a.schluessel === schluessel)!;
}

export function nachtragArt(schluessel: NachtragArt) {
  return NACHTRAG_ARTEN.find((a) => a.schluessel === schluessel)!;
}

// Kennung für Adressen: klein, Umlaute ausgeschrieben, alles andere als Bindestrich
export function kennung(wert: string): string {
  return wert
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
