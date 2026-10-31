// Bausteine des Artikelaufbaus, die Schema, Seiten und Suche gemeinsam nutzen: Artikelarten, Schlagworte und
// Nachträge. Neue Arten kommen nur hier hinzu.

// Artikelarten. Messung und Vergleich haben eine feste Gliederung: eine Frage in den Angaben und diese Zwischen-
// überschriften in dieser Reihenfolge (geprüft beim Bau). Die übrigen Arten gliedern frei, die Frage ist dort optional.
export const ARTIKEL_ARTEN = [
  { schluessel: "grundlagen", name: "Grundlagen", gliederung: null },
  { schluessel: "erfahrung", name: "Erfahrung", gliederung: null },
  { schluessel: "anleitung", name: "Anleitung", gliederung: null },
  { schluessel: "messung", name: "Messung", gliederung: ["Aufbau der Messung", "Ergebnisse", "Erkenntnis"] },
  { schluessel: "vergleich", name: "Vergleich", gliederung: ["Aufbau des Vergleichs", "Ergebnisse", "Erkenntnis"] },
] as const;

export type ArtikelArt = (typeof ARTIKEL_ARTEN)[number]["schluessel"];

export function artikelArt(schluessel: ArtikelArt) {
  return ARTIKEL_ARTEN.find((a) => a.schluessel === schluessel)!;
}

// Freie Schlagworte: Listen in den Angaben eines Artikels unter "schlagworte"
export const FREIE_SCHLAGWORTE = [
  { schluessel: "thema", name: "Thema", mehrzahl: "Themen" },
  { schluessel: "modell", name: "Modell", mehrzahl: "Modelle" },
  { schluessel: "faehigkeit", name: "Fähigkeit", mehrzahl: "Fähigkeiten" },
  { schluessel: "geraet", name: "Gerät", mehrzahl: "Geräte" },
] as const;

export type FreiesSchlagwort = (typeof FREIE_SCHLAGWORTE)[number]["schluessel"];

// Alle Arten von Schlagworten mit Übersicht: die Artikelart (aus der Angabe "art") und die freien
export const SCHLAGWORT_ARTEN = [{ schluessel: "art", name: "Artikelart", mehrzahl: "Artikelarten" }, ...FREIE_SCHLAGWORTE] as const;

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
