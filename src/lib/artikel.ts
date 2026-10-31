// Zugriff auf die Artikel: welche gezeigt werden, in welcher Reihenfolge, und was sich aus ihnen ableitet
// (Adresse, letzte Änderung, Lesezeit, Klartext für die Suche, Schlagworte).
import { getCollection, type CollectionEntry } from "astro:content";
import { SCHLAGWORT_ARTEN, kennung, type SchlagwortArt } from "./aufbau";
import { pfad } from "./pfad";

export type Artikel = CollectionEntry<"artikel">;

// Entwürfe liegen nie im Repo. Die Vorschau zur Abnahme baut mit den Entwürfen dazu und nennt ihre Kennungen in
// KIW_ENTWUERFE (durch Komma getrennt); nur sie tragen dann das Etikett "Entwurf". Im Bau für die Veröffentlichung ist
// die Liste leer.
const ENTWUERFE = new Set((process.env.KIW_ENTWUERFE ?? "").split(",").map((k) => k.trim()).filter(Boolean));

export function istEntwurf(artikel: Artikel): boolean {
  return ENTWUERFE.has(artikel.id);
}

const WOERTER_JE_MINUTE = 200;

export async function alleArtikel(): Promise<Artikel[]> {
  const artikel = await getCollection("artikel");
  return artikel.sort((a, b) => b.data.datum.getTime() - a.data.datum.getTime());
}

export function artikelPfad(artikel: Artikel): string {
  return pfad(`/artikel/${artikel.id}/`);
}

// Nachträge in zeitlicher Folge, der älteste zuerst
export function nachtraege(artikel: Artikel) {
  return [...artikel.data.nachtraege].sort((a, b) => a.datum.getTime() - b.datum.getTime());
}

export function letzteAenderung(artikel: Artikel): Date {
  return nachtraege(artikel).reduce((spaetestes, n) => (n.datum > spaetestes ? n.datum : spaetestes), artikel.data.datum);
}

// Lesbarer Text ohne Markdown-, MDX- und Code-Auszeichnung, für Lesezeit und Suche
export function klartext(markdown: string): string {
  return markdown
    .replace(/^\s*(import|export)\s.*$/gm, " ")
    .replace(/```[^\n]*\n/g, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, " ")
    .replace(/[#>*_`|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function lesezeit(artikel: Artikel): number {
  const woerter = klartext(artikel.body ?? "").split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(woerter / WOERTER_JE_MINUTE));
}

export interface Schlagwort {
  art: SchlagwortArt;
  wert: string;
  kennung: string;
  artikel: Artikel[];
}

export function schlagwortPfad(art: SchlagwortArt, wert: string): string {
  return pfad(`/schlagworte/${art}/${kennung(wert)}/`);
}

// Alle Schlagworte je Art, die häufigsten zuerst. Zwei Schreibweisen mit derselben Kennung sind ein Fehler im Inhalt
// und brechen den Bau ab, statt still zwei Seiten zu einer zu machen.
export function sammleSchlagworte(artikel: Artikel[]): Map<SchlagwortArt, Schlagwort[]> {
  const ergebnis = new Map<SchlagwortArt, Schlagwort[]>();
  for (const { schluessel: art } of SCHLAGWORT_ARTEN) {
    const nachKennung = new Map<string, Schlagwort>();
    for (const a of artikel) {
      for (const wert of a.data.schlagworte[art]) {
        const k = kennung(wert);
        const vorhanden = nachKennung.get(k);
        if (vorhanden && vorhanden.wert !== wert) {
          throw new Error(`Schlagwort ${art}: "${wert}" (${a.id}) und "${vorhanden.wert}" ergeben dieselbe Kennung "${k}"`);
        }
        const eintrag = vorhanden ?? { art, wert, kennung: k, artikel: [] };
        eintrag.artikel.push(a);
        nachKennung.set(k, eintrag);
      }
    }
    ergebnis.set(art, [...nachKennung.values()].sort((x, y) => y.artikel.length - x.artikel.length || x.wert.localeCompare(y.wert, "de")));
  }
  return ergebnis;
}
