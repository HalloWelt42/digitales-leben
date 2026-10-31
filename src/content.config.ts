// Inhaltssammlung der Artikel. Jeder Artikel ist eine Markdown- oder MDX-Datei in src/content/artikel; der Dateiname
// wird zur Adresse (/artikel/<name>/). Hier liegen nur freigegebene Artikel: jeder Push veröffentlicht sofort.
// Entwürfe leben außerhalb des Repos; die Vorschau legt sie für ihren Bau dazu (lib/artikel.ts, ENTWUERFE).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ARTIKEL_ARTEN, NACHTRAG_ARTEN, artikelArt, type ArtikelArt, type FreiesSchlagwort, type NachtragArt } from "./lib/aufbau";

const liste = z.array(z.string().min(1)).default([]);

const schlagworte = z.object({
  thema: liste,
  modell: liste,
  faehigkeit: liste,
  geraet: liste,
} satisfies Record<FreiesSchlagwort, typeof liste>);

const artikelArten = ARTIKEL_ARTEN.map((a) => a.schluessel) as [ArtikelArt, ...ArtikelArt[]];

const nachtragArten = NACHTRAG_ARTEN.map((a) => a.schluessel) as [NachtragArt, ...NachtragArt[]];

// Korrektur oder Erweiterung nach der Veröffentlichung: bleibt sichtbar, statt den Text still zu ändern.
// abschnitt verweist optional auf die Kennung einer Zwischenüberschrift (etwa "ergebnisse").
const nachtrag = z.object({
  datum: z.coerce.date(),
  art: z.enum(nachtragArten),
  text: z.string().min(1),
  abschnitt: z.string().optional(),
});

const artikel = defineCollection({
  loader: glob({ base: "./src/content/artikel", pattern: "*.{md,mdx}" }),
  schema: z
    .object({
      titel: z.string().min(1),
      art: z.enum(artikelArten),
      // die Frage, die der Artikel beantwortet; Pflicht bei Arten mit fester Gliederung, sonst optional
      frage: z.string().min(1).optional(),
      zusammenfassung: z.string().min(1),
      datum: z.coerce.date(),
      schlagworte: schlagworte.default({ thema: [], modell: [], faehigkeit: [], geraet: [] }),
      nachtraege: z.array(nachtrag).default([]),
    })
    .superRefine((d, ctx) => {
      if (artikelArt(d.art).gliederung && !d.frage) {
        ctx.addIssue({ code: "custom", path: ["frage"], message: `Ein Artikel der Art ${artikelArt(d.art).name} braucht eine Frage` });
      }
    }),
});

export const collections = { artikel };
