// Eigene Farbsätze für Codeblöcke, abgestimmt auf die Farben der Seite (styles/grund.css) und mit ausreichendem
// Kontrast auf der Fläche der Codeblöcke (jede Farbe mindestens 4,5 zu 1). Eingebunden in astro.config.mjs.

const ZUORDNUNG = [
  ["kommentar", ["comment", "punctuation.definition.comment"], "italic"],
  ["schluesselwort", ["keyword", "storage", "storage.type", "keyword.control", "entity.name.tag"]],
  ["zeichenkette", ["string", "string.quoted", "markup.inline.raw"]],
  ["funktion", ["entity.name.function", "support.function", "meta.function-call", "entity.other.attribute-name"]],
  ["konstante", ["constant", "constant.numeric", "constant.language", "support.constant", "variable.other.constant"]],
  ["typ", ["entity.name.type", "support.type", "support.class", "entity.name.class", "meta.property-name", "support.type.property-name"]],
];

function farbsatz(name, typ, farben) {
  return {
    name,
    type: typ,
    colors: { "editor.background": farben.grund, "editor.foreground": farben.text },
    tokenColors: [
      { settings: { foreground: farben.text, background: farben.grund } },
      ...ZUORDNUNG.map(([rolle, scope, stil]) => ({ scope, settings: { foreground: farben[rolle], ...(stil ? { fontStyle: stil } : {}) } })),
    ],
  };
}

export const CODE_HELL = farbsatz("kiw-hell", "light", {
  grund: "#fffefb", text: "#3a342c", kommentar: "#675f53", schluesselwort: "#a8470f", zeichenkette: "#3d6b22",
  funktion: "#1c5d99", konstante: "#8b3f8f", typ: "#0f6e6e",
});

export const CODE_DUNKEL = farbsatz("kiw-dunkel", "dark", {
  grund: "#26231f", text: "#d9d1c4", kommentar: "#ada496", schluesselwort: "#eaa968", zeichenkette: "#a9cf8b",
  funktion: "#93c5ee", konstante: "#d7a6e0", typ: "#7fd1c7",
});
