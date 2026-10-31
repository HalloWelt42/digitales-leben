// Feste Seiten aus src/content/seiten (Text aus Dateien, nicht aus dem Code). Die Autorenseite trägt die Kennung
// "autor"; ihr Kurzprofil steht im Kasten unter jedem Artikel.
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { pfad } from "./pfad";

export type Seite = CollectionEntry<"seiten">;

export const AUTOR = "autor";

export async function alleSeiten(): Promise<Seite[]> {
  return getCollection("seiten");
}

export async function autorSeite(): Promise<Seite | undefined> {
  return getEntry("seiten", AUTOR);
}

export function seitenPfad(seite: Seite): string {
  return pfad(`/${seite.id}/`);
}
