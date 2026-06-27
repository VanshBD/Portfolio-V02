import type { ComponentType } from "react";
import { Skyline } from "./Skyline";
import { RainLayer } from "./RainLayer";
import { Figure } from "./Figure";
import { WindowRain } from "./WindowRain";
import { DeskGlow } from "./DeskGlow";
import { TitleSplash } from "./TitleSplash";
import { NeonSign } from "./NeonSign";
import { Cover } from "./Cover";
import { CaseScene } from "./CaseScene";

/* Maps an art-layer `kind` to its component. Phase-1 (Chapter 0) kinds are
   fully illustrated; everything else falls back to the styled Placeholder. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<string, ComponentType<any>> = {
  cover: Cover,
  skyline: Skyline,
  rain: RainLayer,
  figure: Figure,
  "window-rain": WindowRain,
  "desk-glow": DeskGlow,
  "title-splash": TitleSplash,
  "neon-sign": NeonSign,
};

export function resolveArt(kind: string): ComponentType<Record<string, unknown>> {
  return (REGISTRY[kind] ?? CaseScene) as ComponentType<Record<string, unknown>>;
}
