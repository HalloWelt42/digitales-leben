// Bau der Seite. Adresse und Unterpfad stehen nur hier; alle Verweise der Seite leiten sich über BASE_URL davon ab.
// SEITE_ADRESSE und SEITE_BASIS aus der Umgebung gehen vor (etwa für einen anderen Ort der Veröffentlichung).
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: process.env.SEITE_ADRESSE ?? "https://hallowelt42.github.io",
  base: process.env.SEITE_BASIS ?? "/ki-wissen",
  trailingSlash: "always",
  integrations: [mdx()],
  markdown: {
    // zwei Farbsätze ohne Vorgabefarbe: welcher gilt, entscheidet der Stil nach dem Thema des Systems
    shikiConfig: { themes: { light: "vitesse-light", dark: "vitesse-dark" }, defaultColor: false },
  },
});
