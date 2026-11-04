// Markiert im Inhalt einer Seite die Blöcke, die beim Vorlesen gesprochen werden: Überschriften, Absätze und
// Listenpunkte bekommen das Attribut aus vorlesen-regeln.mjs mit ihrer laufenden Nummer. Tabellen, Code, Bilder und
// die Abschnitte aus VORLESEN_OHNE bleiben stumm, Absätze ohne Text (etwa nur ein Bild) ebenso. Ein Listenpunkt mit
// eigenen Absätzen oder einer Unterliste wird nicht selbst markiert, sondern seine Teile.
// Erweiterung für den Markdown-Prozessor des Baus (astro.config.mjs, markdown.processor); sie läuft einmal je Seite
// vor allen anderen Schritten über den ganzen Baum, weil die Nummern der Reihenfolge im Text folgen.
import { VORLESEN_ATTRIBUT, VORLESEN_OHNE, VORLESEN_STUMM } from "./vorlesen-regeln.mjs";

const UEBERSCHRIFT = /^h([1-6])$/;
const BLOCK = new Set(["p", "ul", "ol", "blockquote", "div", ...VORLESEN_STUMM]);

function text(knoten) {
  if (knoten.type === "text") return knoten.value;
  return (knoten.children ?? []).map(text).join("");
}

function markieren(baum, markiere) {
  let nummer = 0;
  // Ebene der Überschrift, mit der ein stummer Abschnitt beginnt; 0, solange gesprochen wird
  let stummAb = 0;

  const gehen = (knoten) => {
    for (const kind of knoten.children ?? []) {
      if (kind.type !== "element") continue;
      const ebene = Number(UEBERSCHRIFT.exec(kind.tagName)?.[1] ?? 0);
      if (ebene) {
        const titel = text(kind).trim();
        if (stummAb && ebene <= stummAb) stummAb = 0;
        if (!stummAb && VORLESEN_OHNE.includes(titel.toLowerCase())) stummAb = ebene;
        if (!stummAb && titel) markiere(kind, nummer++);
        continue;
      }
      if (stummAb || VORLESEN_STUMM.includes(kind.tagName)) continue;
      if (kind.tagName === "p") {
        if (text(kind).trim()) markiere(kind, nummer++);
      } else if (kind.tagName === "li" && !kind.children.some((k) => k.type === "element" && BLOCK.has(k.tagName))) {
        if (text(kind).trim()) markiere(kind, nummer++);
      } else {
        gehen(kind);
      }
    }
  };

  gehen(baum);
}

export default function vorlesenMarkieren() {
  return {
    name: "vorlesen",
    before(baum, ctx) {
      markieren(baum, (element, nummer) => ctx.setProperty(element, VORLESEN_ATTRIBUT, String(nummer)));
    },
  };
}
