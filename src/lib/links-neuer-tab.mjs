// Jeder Verweis im Inhalt eines Artikels öffnet einen neuen Tab (KIW-30): Text, Quellen, Bildnachweis, auch Verweise
// auf eigene Artikel. Ausgenommen sind nur Sprünge innerhalb derselben Seite (#...). rel verhindert, dass die neue
// Seite auf diese zugreift. Erweiterung für den Markdown-Prozessor des Baus (astro.config.mjs, markdown.processor).
function gehen(knoten, setze) {
  for (const kind of knoten.children ?? []) {
    if (kind.type !== "element") continue;
    const ziel = kind.tagName === "a" ? String(kind.properties?.href ?? "") : "";
    if (ziel && !ziel.startsWith("#")) setze(kind);
    gehen(kind, setze);
  }
}

export default function linksNeuerTab() {
  return {
    name: "links-neuer-tab",
    before(baum, ctx) {
      gehen(baum, (a) => {
        ctx.setProperty(a, "target", "_blank");
        ctx.setProperty(a, "rel", "noopener noreferrer");
      });
    },
  };
}
