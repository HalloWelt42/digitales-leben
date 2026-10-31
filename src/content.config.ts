// Inhaltssammlung der Artikel. Jeder Artikel ist eine Markdown- oder MDX-Datei in src/content/artikel; der Dateiname
// wird zur Adresse (/artikel/<name>/). Hier liegen nur freigegebene Artikel: jeder Push veröffentlicht sofort.
// Entwürfe leben außerhalb des Repos; die Vorschau legt sie für ihren Bau dazu (lib/artikel.ts, ENTWUERFE).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { NACHTRAG_ARTEN, type NachtragArt, type SchlagwortArt } from "./lib/aufbau";

const liste = z.array(z.string().min(1)).default([]);

const schlagworte = z.object({
  modell: liste,
  faehigkeit: liste,
  geraet: liste,
} satisfies Record<SchlagwortArt, typeof liste>);

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
  schema: z.object({
    titel: z.string().min(1),
    frage: z.string().min(1),
    zusammenfassung: z.string().min(1),
    datum: z.coerce.date(),
    schlagworte: schlagworte.default({ modell: [], faehigkeit: [], geraet: [] }),
    nachtraege: z.array(nachtrag).default([]),
  }),
});

export const collections = { artikel };
