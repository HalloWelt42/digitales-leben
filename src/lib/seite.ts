// Angaben zur Seite an einem Ort: Name, Beschreibung, Hauptnavigation, Farben für Browser und Startbildschirm.
// Die Farben entsprechen dem Grund der beiden Themen in styles/grund.css (--grund).

export const SEITE = {
  name: "KI-Wissen",
  kurzname: "KI-Wissen",
  beschreibung:
    "Messergebnisse und Erkenntnisse aus der eigenen Arbeit mit KI-Modellen: was sie können, wie schnell sie sind und was sich im Alltag bewährt.",
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
