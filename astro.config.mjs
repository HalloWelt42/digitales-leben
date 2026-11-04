// Bau der Seite. Adresse und Unterpfad stehen nur hier; alle Verweise der Seite leiten sich über BASE_URL davon ab.
// SEITE_ADRESSE und SEITE_BASIS aus der Umgebung gehen vor (etwa für einen anderen Ort der Veröffentlichung).
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import { CODE_DUNKEL, CODE_HELL } from "./codefarben.mjs";
import vorlesenMarkieren from "./src/lib/vorlesen-markieren.mjs";
import linksNeuerTab from "./src/lib/links-neuer-tab.mjs";

export default defineConfig({
  site: process.env.SEITE_ADRESSE ?? "https://hallowelt42.github.io",
  base: process.env.SEITE_BASIS ?? "/digitales-leben",
  trailingSlash: "always",
  integrations: [mdx()],
  markdown: {
    // markiert, was beim Vorlesen gesprochen wird (src/lib/vorlesen-regeln.mjs); gilt auch für MDX
    processor: satteri({ hastPlugins: [vorlesenMarkieren(), linksNeuerTab()] }),
    // eigene Farbsätze (codefarben.mjs) ohne Vorgabefarbe: welcher gilt, entscheidet der Stil nach dem Thema der Seite
    shikiConfig: { themes: { light: CODE_HELL, dark: CODE_DUNKEL }, defaultColor: false },
  },
});
