// Angaben für Startbildschirm und Web-App; die Wege tragen den Unterpfad der Veröffentlichung
import type { APIRoute } from "astro";
import { SEITE } from "../lib/seite";
import { pfad } from "../lib/pfad";

export const GET: APIRoute = () => {
  const symbol = (datei: string, groesse: number, zweck: "any" | "maskable") => ({
    src: pfad(`/${datei}`),
    sizes: `${groesse}x${groesse}`,
    type: "image/png",
    purpose: zweck,
  });
  const manifest = {
    name: SEITE.name,
    short_name: SEITE.kurzname,
    description: SEITE.beschreibung,
    lang: SEITE.sprache,
    start_url: pfad("/"),
    scope: pfad("/"),
    display: "standalone",
    background_color: SEITE.farbe.dunkel,
    theme_color: SEITE.farbe.dunkel,
    icons: [
      symbol("icon-192.png", 192, "any"),
      symbol("icon-512.png", 512, "any"),
      symbol("icon-maskable-192.png", 192, "maskable"),
      symbol("icon-maskable-512.png", 512, "maskable"),
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { "Content-Type": "application/manifest+json" } });
};
