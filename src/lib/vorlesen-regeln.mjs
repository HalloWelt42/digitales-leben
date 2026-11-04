// Was beim Vorlesen gesprochen wird, an genau einer Stelle: der Bau markiert danach die Blöcke eines Artikels
// (vorlesen-markieren.mjs), der Spieler (components/Vorlesen.astro) findet sie über dasselbe Attribut, und das
// Vertonungswerkzeug der Vorschau liest dieselben Blöcke aus der gebauten Seite.

/** Attribut mit der laufenden Nummer eines gesprochenen Blocks (0, 1, 2 ...) */
export const VORLESEN_ATTRIBUT = "data-vorlesen";
/** Elemente, die samt Inhalt stumm bleiben: Tabellen, Code, Bilder, Beiwerk */
export const VORLESEN_STUMM = ["table", "pre", "figure", "img", "picture", "svg", "aside", "nav", "script", "style"];
/** Abschnitte, die stumm bleiben, erkannt am Text ihrer Überschrift (klein geschrieben) */
export const VORLESEN_OHNE = ["bildnachweis", "quellen"];
/** Ordner der Vorlesungen unter public/: <kennung>.mp3 und <kennung>.json je Artikel */
export const VORLESEN_ORDNER = "vorlesen";
