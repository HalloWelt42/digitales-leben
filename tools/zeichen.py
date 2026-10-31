#!/usr/bin/env python3
"""Prüft Textdateien auf typografische Zeichen, die im Projekt nicht vorkommen dürfen.

Verboten sind Gedankenstriche (Halbgeviert, Geviert) und typografische Anführungszeichen; erlaubt sind nur die geraden
Zeichen. Die Dateinamen kommen zeilenweise über die Standardeingabe (so ruft der Commit-Haken es auf) oder als
Argumente. Ende mit 1, wenn es Funde gibt.
"""

from __future__ import annotations

import sys
from pathlib import Path

# als Codepunkte, damit diese Datei selbst sauber bleibt
VERBOTEN = {0x2013: "Halbgeviertstrich", 0x2014: "Geviertstrich", 0x2018: "Anführung einfach", 0x2019: "Anführung einfach",
            0x201A: "Anführung einfach unten", 0x201C: "Anführung doppelt", 0x201D: "Anführung doppelt",
            0x201E: "Anführung doppelt unten", 0x00AB: "Spitzanführung", 0x00BB: "Spitzanführung"}
TEXTENDUNGEN = {".md", ".mdx", ".astro", ".ts", ".mjs", ".js", ".css", ".json", ".yml", ".yaml", ".py", ".sh", ".html", ".svg"}


def pruefe(datei: Path) -> list[str]:
    if datei.suffix not in TEXTENDUNGEN or not datei.is_file() or datei.name == "package-lock.json":
        return []
    funde = []
    for nummer, zeile in enumerate(datei.read_text(encoding="utf-8").splitlines(), start=1):
        for zeichen in zeile:
            if ord(zeichen) in VERBOTEN:
                funde.append(f"{datei}:{nummer}: {VERBOTEN[ord(zeichen)]} (U+{ord(zeichen):04X})")
    return funde


def main() -> int:
    namen = sys.argv[1:] or [z.strip() for z in sys.stdin if z.strip()]
    funde = [f for name in namen for f in pruefe(Path(name))]
    for fund in funde:
        print(fund, file=sys.stderr)
    if funde:
        print("Abbruch: nur gerade Zeichen verwenden (-, \", ')", file=sys.stderr)
    return 1 if funde else 0


if __name__ == "__main__":
    sys.exit(main())
