# KI-Wissen

Messergebnisse und Erkenntnisse aus der eigenen Arbeit mit KI-Modellen, als statische Seite.

## Schreiben

Jeder Artikel ist eine Datei in `src/content/artikel/` (Markdown `.md` oder MDX `.mdx`); der Dateiname wird zur
Adresse `/artikel/<name>/`. Am einfachsten die Vorlage `vorlage-messbericht.mdx` kopieren. Sie zeigt den Aufbau:

- Angaben oben: `titel`, `frage`, `zusammenfassung`, `datum`, `entwurf`, Schlagworte (`modell`, `faehigkeit`,
  `geraet`) und `nachtraege`.
- Inhalt: Einstieg, `## Aufbau der Messung`, `## Ergebnisse` (Tabelle), `## Erkenntnis`.
- Nachträge: Korrekturen und Erweiterungen nach der Veröffentlichung kommen mit Datum und Art in `nachtraege`
  (optional mit `abschnitt`, der Kennung einer Zwischenüberschrift). Sie bleiben sichtbar, statt den Text still zu
  ändern.

Mit `entwurf: true` erscheint ein Artikel nur beim Schreiben, nie auf der veröffentlichten Seite.

## Befehle

```bash
npm install                     # einmal
npm run dev                     # beim Schreiben, mit Entwürfen
npm run build                   # Bau wie bei der Veröffentlichung, ohne Entwürfe
KIW_ENTWUERFE=1 npm run build   # Bau mit Entwürfen, zum Prüfen
python3 tools/symbole.py        # Symbolsatz nach Änderung an public/symbol.svg
git config core.hooksPath tools/git-hooks   # einmal je Klon: Version und Zeichenprüfung vor jedem Commit
```

## Veröffentlichung

Jeder Push auf `main` baut die Seite und veröffentlicht sie (`.github/workflows/seite.yml`). Adresse und Unterpfad
stehen in `astro.config.mjs`. Die Fassung kommt allein aus `version.json`; der Commit-Haken zählt sie hoch.

## Schriften

Fraunces (Überschriften), Barlow (Text) und JetBrains Mono (Code, Etiketten), alle unter der SIL Open Font License,
aus npm-Paketen selbst ausgeliefert, ohne fremde Server.
