import { Comic } from "@/components/Comic";

/**
 * PHASE 1 — The Comic Engine.
 * Mounts the data-driven, scroll-pinned comic. Chapter 0 (cold open) is fully
 * illustrated; chapters 1–7 scaffold the engine with styled placeholders and
 * real dossiers, ready for the ink library (Phase 2) and full story (Phase 3).
 */
export default function Home() {
  return (
    <main className="overflow-x-hidden bg-ink">
      <Comic />
    </main>
  );
}
