# KI-Wissen

Messergebnisse und Erkenntnisse aus der eigenen Arbeit mit KI-Modellen, als statische Seite.

## Artikel

Jeder Artikel ist eine Datei in `src/content/artikel/` (Markdown `.md` oder MDX `.mdx`); der Dateiname wird zur
Adresse `/artikel/<name>/`. Hier liegen nur freigegebene Artikel, denn jeder Push auf `main` veröffentlicht sofort.
Entwürfe entstehen außerhalb des Repos und kommen erst nach der Abnahme hierher.

- Angaben oben: `titel`, `frage`, `zusammenfassung`, `datum`, Schlagworte (`modell`, `faehigkeit`, `geraet`) und
  `nachtraege`; das Schema steht in `src/content.config.ts`.
- Inhalt: Einstieg, `## Aufbau der Messung`, `## Ergebnisse` (Tabelle), `## Erkenntnis`.
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

## Schriften

Fraunces (Überschriften), Barlow (Text) und JetBrains Mono (Code, Etiketten), alle unter der SIL Open Font License,
aus npm-Paketen selbst ausgeliefert, ohne fremde Server.
