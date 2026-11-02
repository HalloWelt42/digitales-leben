// Stand des Baus: ändert sich mit jedem Bau, auch wenn nur ein Artikel dazukommt (die Fassung zählt nur der Commit-Haken
// hoch). Die Seite trägt ihren Stand und vergleicht ihn mit stand.json auf dem Server (components/Neuladen.astro).
import { FASSUNG } from "./fassung";

export const STAND: string = `${FASSUNG}+${new Date().toISOString()}`;

// Speicherschlüssel im Browser: der Stand, für den schon einmal neu geladen wurde (nur ein Versuch je Stand)
export const NEULADEN_SCHLUESSEL = "kiw-neu-geladen";
