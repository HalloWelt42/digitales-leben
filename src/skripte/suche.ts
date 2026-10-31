// Suche im Browser: lädt den statischen Suchindex, sucht beim Tippen und zeigt die Treffer mit markierten Fundstellen.
// Der Suchbegriff steht in der Adresse (?q=...), damit eine Suche verlinkt und mit Zurück wiederholt werden kann.
import { begriffe, suche, vergleichsform, type SuchEintrag } from "./suchindex";

const VERZOEGERUNG_MS = 120;

// Text mit markierten Begriffen als Knoten, ohne HTML aus dem Index zu deuten
function markiert(text: string, gesucht: string[]): DocumentFragment {
  const teile = document.createDocumentFragment();
  const form = vergleichsform(text);
  let stelle = 0;
  while (stelle < text.length) {
    let naechste = -1;
    let laenge = 0;
    for (const b of gesucht) {
      const i = form.indexOf(b, stelle);
      if (i >= 0 && (naechste < 0 || i < naechste)) [naechste, laenge] = [i, b.length];
    }
    if (naechste < 0) break;
    teile.append(text.slice(stelle, naechste));
    const mark = document.createElement("mark");
    mark.textContent = text.slice(naechste, naechste + laenge);
    teile.append(mark);
    stelle = naechste + laenge;
  }
  teile.append(text.slice(stelle));
  return teile;
}

function element<K extends keyof HTMLElementTagNameMap>(name: K, klasse?: string, ...kinder: (Node | string)[]) {
  const e = document.createElement(name);
  if (klasse) e.className = klasse;
  e.append(...kinder);
  return e;
}

async function starte(formular: HTMLFormElement) {
  const eingabe = formular.querySelector<HTMLInputElement>("input[type=search]")!;
  const liste = document.querySelector<HTMLOListElement>("[data-treffer]")!;
  const meldung = document.querySelector<HTMLElement>("[data-meldung]")!;
  const hinweis = meldung.textContent ?? "";

  let index: SuchEintrag[] = [];
  try {
    const antwort = await fetch(formular.dataset.index!);
    if (!antwort.ok) throw new Error(String(antwort.status));
    index = await antwort.json();
  } catch {
    meldung.textContent = "Der Suchindex lässt sich gerade nicht laden. Bitte die Seite neu laden.";
    return;
  }

  const zeige = () => {
    const anfrage = eingabe.value.trim();
    const adresse = new URL(location.href);
    if (anfrage) adresse.searchParams.set("q", anfrage);
    else adresse.searchParams.delete("q");
    history.replaceState(null, "", adresse);

    liste.replaceChildren();
    if (!anfrage) {
      meldung.textContent = hinweis;
      return;
    }
    const gesucht = begriffe(anfrage);
    const treffer = suche(index, anfrage);
    meldung.textContent = treffer.length === 0 ? `Keine Treffer für "${anfrage}".` : `${treffer.length} Treffer`;
    for (const t of treffer) {
      const verweis = element("a", undefined, markiert(t.eintrag.titel, gesucht));
      verweis.href = t.eintrag.pfad;
      const angaben = element("p", "angabe", t.eintrag.datum, ...(t.eintrag.entwurf ? [" · Entwurf"] : []),
        ...(t.eintrag.schlagworte.length ? [` · ${t.eintrag.schlagworte.join(", ")}`] : []));
      liste.append(element("li", undefined, element("h2", undefined, verweis), element("p", "auszug", markiert(t.auszug, gesucht)), angaben));
    }
  };

  let zeitgeber: ReturnType<typeof setTimeout> | undefined;
  eingabe.addEventListener("input", () => {
    clearTimeout(zeitgeber);
    zeitgeber = setTimeout(zeige, VERZOEGERUNG_MS);
  });
  formular.addEventListener("submit", (ereignis) => {
    ereignis.preventDefault();
    zeige();
  });

  eingabe.value = new URL(location.href).searchParams.get("q") ?? "";
  zeige();
}

const formular = document.querySelector<HTMLFormElement>("form[data-suche]");
if (formular) void starte(formular);
