// Thema der Seite: hell ist die Vorgabe, dunkel ist wählbar. Die Wahl merkt sich der Browser unter SPEICHER_SCHLUESSEL.
// Gesetzt wird es als data-thema am Wurzelelement (styles/grund.css), vor dem ersten Zeichnen (components/ThemaVorab).
import { SEITE } from "./seite";

export const THEMEN = ["hell", "dunkel"] as const;
export type Thema = (typeof THEMEN)[number];

export const VORGABE: Thema = "hell";
export const SPEICHER_SCHLUESSEL = "kiw-thema";

// Farbe der Browserleiste je Thema
export const THEMA_FARBE: Record<Thema, string> = { hell: SEITE.farbe.hell, dunkel: SEITE.farbe.dunkel };
