// Feed (RSS 2.0) aller Artikel, neueste zuerst: zum Abonnieren in jedem Feedleser. Ein Nachtrag setzt das Datum des
// Eintrags nicht neu; er steht im Artikel selbst.
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { alleArtikel, artikelPfad } from "../lib/artikel";
import { SEITE } from "../lib/seite";
import { pfad } from "../lib/pfad";

export async function GET(context: APIContext) {
  const artikel = await alleArtikel();
  return rss({
    title: SEITE.name,
    description: SEITE.beschreibung,
    site: new URL(pfad("/"), context.site),
    items: artikel.map((a) => ({
      title: a.data.titel,
      description: a.data.zusammenfassung,
      pubDate: a.data.datum,
      link: artikelPfad(a),
      author: SEITE.autor,
      categories: a.data.schlagworte.thema,
    })),
    customData: `<language>${SEITE.sprache}</language>`,
  });
}
