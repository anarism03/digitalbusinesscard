import type { CSSProperties } from "react";

const PALETTES = [
  ["#1e63d6", "#164ea8", "#eaf2ff", "rgba(30, 99, 214, 0.22)"],
  ["#0f8f72", "#08705a", "#e7f7f2", "rgba(15, 143, 114, 0.2)"],
  ["#b86b13", "#8d4f0c", "#fff4e5", "rgba(184, 107, 19, 0.2)"],
  ["#c7425d", "#9e3047", "#fff0f3", "rgba(199, 66, 93, 0.2)"],
  ["#6757c7", "#4f41a5", "#f1efff", "rgba(103, 87, 199, 0.2)"],
  ["#187fa5", "#11617f", "#eaf7fb", "rgba(24, 127, 165, 0.2)"],
];

function hashSeed(seed: string): number {
  return Array.from(seed.trim().toLowerCase()).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    17,
  );
}

type CardThemeStyle = CSSProperties & {
  "--card-accent": string;
  "--card-accent-deep": string;
  "--card-accent-soft": string;
  "--card-accent-glow": string;
};

export function getCardThemeStyle(seed?: string): CardThemeStyle {
  const normalizedSeed = seed?.trim() || "setclapp";
  const [accent, accentDeep, accentSoft, accentGlow] =
    PALETTES[hashSeed(normalizedSeed) % PALETTES.length];

  return {
    "--card-accent": accent,
    "--card-accent-deep": accentDeep,
    "--card-accent-soft": accentSoft,
    "--card-accent-glow": accentGlow,
  };
}
