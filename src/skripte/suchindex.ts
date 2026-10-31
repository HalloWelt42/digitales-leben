// Aufbau des Suchindex und die Suche selbst, ohne Bezug zur Seite: gemeinsam für den Bau (pages/suchindex.json.ts)
// und den Browser (skripte/suche.ts).

export interface SuchEintrag {
  titel: string;
  pfad: string;
  datum: string;
  frage: string;            // leer, wenn der Artikel keine Frage stellt
  zusammenfassung: string;
  schlagworte: string[];
  text: string;
  entwurf: boolean;
}

export interface Treffer {
  eintrag: SuchEintrag;
  punkte: number;
  auszug: string;
}

// Gewicht eines Fundes je Feld: Titel und Schlagworte zählen mehr als der Fließtext
const GEWICHTE = { titel: 6, schlagworte: 4, frage: 3, zusammenfassung: 2, text: 1 } as const;
const AUSZUG_RAND = 90;

// Vergleichsform, Zeichen für Zeichen gleich lang wie das Original (damit Fundstellen im Original markiert werden
// können): klein, Akzente und Umlaute auf den Grundbuchstaben.
export function vergleichsform(text: string): string {
  let ergebnis = "";
  for (const zeichen of text.toLowerCase()) {
    const grund = zeichen.normalize("NFD")[0] ?? zeichen;
    ergebnis += grund.length === zeichen.length ? grund : zeichen;
  }
  return ergebnis;
}

export function begriffe(anfrage: string): string[] {
  return vergleichsform(anfrage).split(/\s+/).filter((b) => b.length > 0);
}

function auszug(text: string, begriff: string): string {
  const stelle = vergleichsform(text).indexOf(begriff);
  if (stelle < 0) return text.slice(0, AUSZUG_RAND * 2) + (text.length > AUSZUG_RAND * 2 ? " ..." : "");
  const anfang = Math.max(0, stelle - AUSZUG_RAND);
  const ende = Math.min(text.length, stelle + begriff.length + AUSZUG_RAND);
  return `${anfang > 0 ? "... " : ""}${text.slice(anfang, ende).trim()}${ende < text.length ? " ..." : ""}`;
}

// Jeder Begriff muss irgendwo vorkommen; die Punkte ergeben sich aus den Feldern, in denen er steht
export function suche(eintraege: SuchEintrag[], anfrage: string): Treffer[] {
  const gesucht = begriffe(anfrage);
  if (gesucht.length === 0) return [];
  const treffer: Treffer[] = [];
  for (const eintrag of eintraege) {
    const felder = {
      titel: vergleichsform(eintrag.titel),
      schlagworte: vergleichsform(eintrag.schlagworte.join(" ")),
      frage: vergleichsform(eintrag.frage),
      zusammenfassung: vergleichsform(eintrag.zusammenfassung),
      text: vergleichsform(eintrag.text),
    };
    let punkte = 0;
    let alleGefunden = true;
    for (const begriff of gesucht) {
      const gewicht = (Object.keys(GEWICHTE) as (keyof typeof GEWICHTE)[])
        .filter((feld) => felder[feld].includes(begriff))
        .reduce((summe, feld) => summe + GEWICHTE[feld], 0);
      if (gewicht === 0) alleGefunden = false;
      punkte += gewicht;
    }
    if (!alleGefunden) continue;
    const imText = gesucht.find((b) => felder.text.includes(b));
    treffer.push({ eintrag, punkte, auszug: imText ? auszug(eintrag.text, imText) : eintrag.zusammenfassung });
  }
  return treffer.sort((a, b) => b.punkte - a.punkte);
}
