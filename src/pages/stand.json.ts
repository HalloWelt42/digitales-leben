// Stand des Baus für die Fassungsprüfung der Seite (components/Neuladen.astro)
import type { APIRoute } from "astro";
import { FASSUNG } from "../lib/fassung";
import { STAND } from "../lib/stand";

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ stand: STAND, fassung: FASSUNG }), { headers: { "Content-Type": "application/json" } });
