"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { script } from "@/content/script";
import { useComicStore } from "@/store/comic";
import { Chapter } from "./Chapter";
import { ComicHUD } from "./ui/ComicHUD";

gsap.registerPlugin(ScrollTrigger);

export function Comic() {
  /* Sync prefers-reduced-motion into the store. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    useComicStore.getState().setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) =>
      useComicStore.getState().setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Keep ScrollTrigger measurements correct after fonts/layout settle. */
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div id="comic-root" className="relative w-screen">
      <ComicHUD />
      {script.chapters.map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} chapterIndex={i} />
      ))}
    </div>
  );
}
