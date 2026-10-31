#!/usr/bin/env python3
"""Leitet aus public/symbol.svg den Symbolsatz für Browser-Tabs, Startbildschirm und Web-App ab.

Einzige Quelle ist symbol.svg: ein Rechteck über die ganze Fläche als Grund, danach das Motiv. Die Hintergrundfarbe
kommt aus dem Grund des Symbols. Erzeugt in public:
  favicon.ico                                   16, 32 und 48 in einer Datei
  favicon-32.png                                für Tabs, mit durchsichtigen Ecken
  icon-192.png, icon-512.png                    deckend auf der Grundfarbe (iOS zeigt sonst kein Symbol)
  icon-maskable-192.png, icon-maskable-512.png  Grund randlos, Motiv in der sicheren Zone
  apple-touch-icon.png                          180, deckend

Die Bilder liegen im Repo und werden nie beim Bau erzeugt. Nach einer Änderung an symbol.svg neu erzeugen:
  python3 tools/symbole.py
Braucht cairosvg und Pillow, nur auf dem Rechner, der die Bilder erzeugt.
"""

from __future__ import annotations

import io
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import cairosvg
from PIL import Image

OEFFENTLICH = Path(__file__).resolve().parent.parent / "public"
QUELLE = OEFFENTLICH / "symbol.svg"
SVG = "http://www.w3.org/2000/svg"
# Anteil des Motivs am maskierbaren Symbol: alles bleibt im Kreis mit 80 % Durchmesser, den kein Gerät beschneidet
SICHERE_ZONE = 0.66


def rastern(svg: bytes, groesse: int) -> Image.Image:
    png = cairosvg.svg2png(bytestring=svg, output_width=groesse, output_height=groesse)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def flach(bild: Image.Image, farbe: str) -> Image.Image:
    return Image.alpha_composite(Image.new("RGBA", bild.size, farbe), bild).convert("RGB")


def grund_von(wurzel: ET.Element) -> ET.Element:
    _, _, breite, hoehe = (float(z) for z in wurzel.get("viewBox", "").split())
    grund = next((k for k in wurzel if k.tag == f"{{{SVG}}}rect" and float(k.get("width", 0)) == breite
                  and float(k.get("height", 0)) == hoehe), None)
    if grund is None:
        sys.exit(f"{QUELLE}: Rechteck über die ganze Fläche (Grund) fehlt")
    return grund


def maskierbar(svg: bytes) -> bytes:
    ET.register_namespace("", SVG)
    wurzel = ET.fromstring(svg)
    _, _, breite, hoehe = (float(z) for z in wurzel.get("viewBox", "").split())
    grund = grund_von(wurzel)
    grund.attrib.pop("rx", None)
    motiv = [k for k in wurzel if k is not grund]
    x, y = breite / 2, hoehe / 2
    gruppe = ET.SubElement(wurzel, f"{{{SVG}}}g", transform=f"translate({x:g} {y:g}) scale({SICHERE_ZONE}) translate({-x:g} {-y:g})")
    for k in motiv:
        wurzel.remove(k)
        gruppe.append(k)
    return ET.tostring(wurzel)


def main() -> None:
    quelle = QUELLE.read_bytes()
    farbe = grund_von(ET.fromstring(quelle)).get("fill", "#000000")
    ico = [rastern(quelle, g) for g in (48, 32, 16)]
    ico[0].save(OEFFENTLICH / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[1:])
    rastern(quelle, 32).save(OEFFENTLICH / "favicon-32.png", optimize=True)
    for groesse in (192, 512):
        flach(rastern(quelle, groesse), farbe).save(OEFFENTLICH / f"icon-{groesse}.png", optimize=True)
        flach(rastern(maskierbar(quelle), groesse), farbe).save(OEFFENTLICH / f"icon-maskable-{groesse}.png", optimize=True)
    flach(rastern(quelle, 180), farbe).save(OEFFENTLICH / "apple-touch-icon.png", optimize=True)
    print(f"Symbolsatz aus {QUELLE.name} erzeugt in {OEFFENTLICH}")


if __name__ == "__main__":
    main()
