// Angaben zur Seite an einem Ort: Name, Beschreibung, Hauptnavigation, Farben für Browser und Startbildschirm.
// Die Farben entsprechen dem Grund der beiden Themen in styles/grund.css (--grund); welches gilt, regelt lib/thema.ts.

export const SEITE = {
  name: "Digitales Leben",
  kurzname: "Digitales Leben",
  // Wortmarke in der Kopfleiste: kräftiger und leiser Teil in Festbreitenschrift
  marke: { stark: "digitales", leise: "-leben" },
  leitsatz: "aus der echten Praxis",
  // Marke und Autor in einem; der Auftritt ist anonym, nie ein echter Name
  autor: "HalloWelt42",
  beschreibung:
    "Fachartikel rund um Technik und digitales Leben: Software, Netz und Server, KI und Werkzeuge, Erfahrungen aus der Praxis, Messungen und Vergleiche.",
  sprache: "de",
  farbe: { dunkel: "#1d1b18", hell: "#faf8f4" },
} as const;

export interface NavigationsEintrag {
  name: string;
  weg: string;
}

export const NAVIGATION: NavigationsEintrag[] = [
  { name: "Artikel", weg: "/" },
  { name: "Schlagworte", weg: "/schlagworte/" },
  { name: "Suche", weg: "/suche/" },
];
