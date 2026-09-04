import type { GrundnerInputs } from "./grundner";

export type Preset = {
  id: string;
  name: string;
  blurb: string;
  values: GrundnerInputs;
};

export const RANGES = {
  rh: { min: 0, max: 1, step: 0.001 },
  t: { min: 200, max: 310, step: 0.1 },
  dzRh: { min: -4, max: 2, step: 0.01 },
  qc: { min: 0, max: 40, step: 0.05 },
  qi: { min: 0, max: 20, step: 0.05 },
} as const;

export const PRESETS: Preset[] = [
  {
    id: "sc",
    name: "Stratocumulus",
    blurb: "Marine Inversionsdecke — I₂ hat ein lokales Maximum bei ∂zRH = −2 km⁻¹",
    values: { rh: 0.85, t: 283, dzRh: -2.0, qc: 15, qi: 0 },
  },
  {
    id: "cu",
    name: "Cumulus",
    blurb: "Warm, feucht, schwach geschichtet",
    values: { rh: 0.9, t: 292, dzRh: 0.3, qc: 18, qi: 0 },
  },
  {
    id: "ci",
    name: "Cirrus",
    blurb: "Kalte obere Troposphäre, nur Eis",
    values: { rh: 0.5, t: 225, dzRh: -0.3, qc: 0, qi: 2 },
  },
  {
    id: "ns",
    name: "Nimbostratus",
    blurb: "Tiefe, kondensatreiche Bewölkung",
    values: { rh: 0.95, t: 270, dzRh: -0.5, qc: 30, qi: 10 },
  },
  {
    id: "mean",
    name: "Mittel",
    blurb: "RH̄ = 0,6025, T̄ = 257,06 K — DYAMOND-Trainingsmittel",
    values: { rh: 0.6025, t: 257.06, dzRh: 0, qc: 5, qi: 1 },
  },
  {
    id: "clear",
    name: "Klar",
    blurb: "Kein Kondensat → PC2 erzwingt C = 0",
    values: { rh: 0.4, t: 288, dzRh: 0.1, qc: 0, qi: 0 },
  },
];

export const DEFAULT_PRESET_ID = "sc";
