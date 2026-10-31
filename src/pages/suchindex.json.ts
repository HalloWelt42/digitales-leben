// Suchindex als statische Datei: je Artikel Titel, Frage (falls gesetzt, sonst leer), Zusammenfassung, Schlagworte
// (mit Artikelart) und Klartext. Die Suche
// (skripte/suche.ts) lädt ihn im Browser und braucht keinen Dienst.
import type { APIRoute } from "astro";
import { SCHLAGWORT_ARTEN } from "../lib/aufbau";
import { alleArtikel, artikelPfad, istEntwurf, klartext, schlagwortWerte } from "../lib/artikel";
import { datumText } from "../lib/datum";
import type { SuchEintrag } from "../skripte/suchindex";

export const GET: APIRoute = async () => {
  const eintraege: SuchEintrag[] = (await alleArtikel()).map((a) => ({
    titel: a.data.titel,
    pfad: artikelPfad(a),
    datum: datumText(a.data.datum),
    frage: a.data.frage ?? "",
    zusammenfassung: a.data.zusammenfassung,
    schlagworte: SCHLAGWORT_ARTEN.flatMap((art) => schlagwortWerte(a, art.schluessel)),
    text: klartext(a.body ?? ""),
    entwurf: istEntwurf(a),
  }));
  return new Response(JSON.stringify(eintraege), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
