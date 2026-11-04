# Digitales Leben

Fachmagazin rund um Technik und digitales Leben als statische Seite: Grundlagen, Erfahrungen, Anleitungen, Messungen
und Vergleiche; KI ist eines der Themen. Adresse: https://hallowelt42.github.io/digitales-leben/ (Repo
HalloWelt42/digitales-leben, der lokale Ordner heißt vorerst noch KI-Wissen).

## Artikel

Jeder Artikel ist eine Datei in `src/content/artikel/` (Markdown `.md` oder MDX `.mdx`); der Dateiname wird zur
Adresse `/artikel/<name>/`. Hier liegen nur freigegebene Artikel, denn jeder Push auf `main` veröffentlicht sofort.
Entwürfe entstehen außerhalb des Repos und kommen erst nach der Abnahme hierher.

- Angaben oben: `titel`, `art` (grundlagen, erfahrung, anleitung, messung, vergleich), `zusammenfassung`, `datum`,
  optional `frage`, `bild` mit `bildtext` (Artikelbild neben der Datei, oben im Artikel, in der Liste und als
  Vorschaubild für soziale Netze), Schlagworte (`thema`, `modell`, `faehigkeit`, `geraet`) und `nachtraege`; das Schema steht in
  `src/content.config.ts`, die Arten in `src/lib/aufbau.ts`.
- Messung und Vergleich haben eine feste Gliederung: eine `frage` und die Zwischenüberschriften `## Aufbau der
  Messung` bzw. `## Aufbau des Vergleichs`, `## Ergebnisse` (Tabelle), `## Erkenntnis`. Der Bau prüft sie. Die
  übrigen Arten gliedern frei.
- Nachträge: Korrekturen und Erweiterungen nach der Veröffentlichung kommen mit Datum und Art in `nachtraege`
  (optional mit `abschnitt`, der Kennung einer Zwischenüberschrift). Sie bleiben sichtbar, statt den Text still zu
  ändern.

## Befehle

```bash
npm install                     # einmal
npm run check                   # Typen und Inhalte prüfen
npm run build                   # Bau wie bei der Veröffentlichung
python3 tools/symbole.py        # Symbolsatz nach Änderung an public/symbol.svg
git config core.hooksPath tools/git-hooks   # einmal je Klon: Version und Zeichenprüfung vor jedem Commit
```

## Gestaltung

Hell ist die Vorgabe, ein Schalter in der Kopfleiste wechselt auf dunkel; die Wahl merkt sich der Browser. Farben und
Maße stehen in `src/styles/grund.css`, die Farben der Codeblöcke in `codefarben.mjs`.

## Veröffentlichung

Jeder Push auf `main` baut die Seite und veröffentlicht sie (`.github/workflows/seite.yml`). Adresse und Unterpfad
stehen in `astro.config.mjs`. Die Fassung kommt allein aus `version.json`; der Commit-Haken zählt sie hoch.

Jeder Bau trägt einen Stand (`src/lib/stand.ts`, abrufbar unter `stand.json`). Offene Seiten, auch die als Web-App
abgelegte, vergleichen ihn beim Öffnen, beim Zurückkehren und alle fünf Minuten und laden bei neuem Stand selbst neu
(`src/components/Neuladen.astro`).

## Abonnieren

Neue Artikel stehen im Feed `feed.xml` (RSS, verlinkt im Fuß und im Kopf jeder Seite). In der Artikelliste tragen
Artikel, die der Browser noch nicht kennt, die Marke "Neu" (`src/lib/gesehen.ts`, nur im Browser des Lesers gemerkt).

## Schriften

Source Serif 4 (Überschriften), Barlow (Text) und JetBrains Mono (Code, Etiketten), alle unter der SIL Open Font License,
aus npm-Paketen selbst ausgeliefert, ohne fremde Server.
