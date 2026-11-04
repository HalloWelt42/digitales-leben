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
  // bild: Artikelbild neben der Datei (./<name>.jpg), oben im Artikel, in der Artikelliste und als Vorschaubild für
  // soziale Netze (og:image); bildtext beschreibt es (Alt-Text) und ist mit einem Bild Pflicht
  schema: ({ image }) => z
    .object({
      titel: z.string().min(1),
      art: z.enum(artikelArten),
      // die Frage, die der Artikel beantwortet; Pflicht bei Arten mit fester Gliederung, sonst optional
      frage: z.string().min(1).optional(),
      zusammenfassung: z.string().min(1),
      bild: image().optional(),
      bildtext: z.string().min(1).optional(),
      // das Artikelbild ist eine KI-Erzeugung: darunter steht die Kennung KI-Bild (setzt die Redaktion)
      bildki: z.boolean().default(false),
      datum: z.coerce.date(),
      schlagworte: schlagworte.default({ thema: [], modell: [], faehigkeit: [], geraet: [] }),
      nachtraege: z.array(nachtrag).default([]),
    })
    .superRefine((d, ctx) => {
      if (d.bild && !d.bildtext) {
        ctx.addIssue({ code: "custom", path: ["bildtext"], message: "Ein Artikelbild braucht einen bildtext (Alt-Text)" });
      }
      if (artikelArt(d.art).gliederung && !d.frage) {
        ctx.addIssue({ code: "custom", path: ["frage"], message: `Ein Artikel der Art ${artikelArt(d.art).name} braucht eine Frage` });
      }
    }),
});

// Feste Seiten mit Text aus einer Datei (src/content/seiten/<kennung>.md), etwa autor.md: kurzprofil für den Kasten
// unter jedem Artikel, der Text darunter für die eigene Seite. Fehlt die Datei, gibt es Seite und Kasten nicht.
const seiten = defineCollection({
  loader: glob({ base: "./src/content/seiten", pattern: "*.md" }),
  schema: ({ image }) =>
    z.object({
      titel: z.string().min(1),
      kurzprofil: z.string().min(1).optional(),
      beschreibung: z.string().min(1).optional(),
      // Bild nur auf der Seite selbst (oben, Querformat) und als Vorschaubild; nie im Kasten unter den Artikeln
      bild: image().optional(),
      bildtext: z.string().min(1).optional(),
    }),
});

export const collections = { artikel, seiten };
