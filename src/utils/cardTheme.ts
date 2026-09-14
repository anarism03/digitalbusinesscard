import type { CSSProperties } from "react";

interface CardPalette {
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentGlow: string;
}

const PALETTES: CardPalette[] = [
  {
    accent: "#1e63d6",
    accentDeep: "#164ea8",
    accentSoft: "#eaf2ff",
    accentGlow: "rgba(30, 99, 214, 0.22)",
  },
  {
    accent: "#0f8f72",
    accentDeep: "#08705a",
    accentSoft: "#e7f7f2",
    accentGlow: "rgba(15, 143, 114, 0.2)",
  },
  {
    accent: "#b86b13",
    accentDeep: "#8d4f0c",
    accentSoft: "#fff4e5",
    accentGlow: "rgba(184, 107, 19, 0.2)",
  },
  {
    accent: "#c7425d",
    accentDeep: "#9e3047",
    accentSoft: "#fff0f3",
    accentGlow: "rgba(199, 66, 93, 0.2)",
  },
  {
    accent: "#6757c7",
    accentDeep: "#4f41a5",
    accentSoft: "#f1efff",
    accentGlow: "rgba(103, 87, 199, 0.2)",
  },
  {
    accent: "#187fa5",
    accentDeep: "#11617f",
    accentSoft: "#eaf7fb",
    accentGlow: "rgba(24, 127, 165, 0.2)",
  },
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
  const palette = PALETTES[hashSeed(normalizedSeed) % PALETTES.length];

  return {
    "--card-accent": palette.accent,
    "--card-accent-deep": palette.accentDeep,
    "--card-accent-soft": palette.accentSoft,
    "--card-accent-glow": palette.accentGlow,
  };
}
