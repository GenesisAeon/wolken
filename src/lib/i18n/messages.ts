export type Locale = "de" | "en";

export type Messages = {
  language: string;
  documentTitle: string;
  eyebrowPrefix: string;
  eyebrow: string;
  title: string;
  lead: string;
  rhLabel: string;
  tLabel: string;
  dzRhLabel: string;
  qcLabel: string;
  qiLabel: string;
  pc3Title: string;
  pc3Hint: string;
  pc3Aria: string;
  reset: string;
  random: string;
  citation: string;
  ccLabel: string;
  pc2Note: string;
  diagnosticNote: string;
  equation10: string;
  coeffsNote: string;
};

export const messages: Record<Locale, Messages> = {
  de: {
    language: "Sprache",
    documentTitle: "Wolken",
    eyebrowPrefix: "𝔉",
    eyebrow: "Wolken-Modul",
    title: "Wolken",
    lead: "Live-Diagnose der Grundner-Gleichung. Fünf Größen, drei Terme, R² = 0,94.",
    rhLabel: "Relative Feuchte",
    tLabel: "Temperatur",
    dzRhLabel: "Vertikaler RH-Gradient",
    qcLabel: "Wolkenwasser",
    qiLabel: "Wolkeneis",
    pc3Title: "PC3-Untergrenze",
    pc3Hint: "RH-Floor nach Gleichung 11",
    pc3Aria: "PC3-Untergrenze",
    reset: "Reset",
    random: "Zufall",
    citation:
      "Grundner, Beucler, Gentine, Eyring (2024). Data-Driven Equation Discovery of a Cloud Cover Parameterization. JAMES 16, e2023MS003763. Symbolische Regression auf coarse-grained DYAMOND-Daten, 11 Parameter.",
    ccLabel: "Wolkenbedeckung",
    pc2Note: "Kondensatfrei — physikalische Randbedingung PC2",
    diagnosticNote: "Diagnostische Schließung · nicht prognostisch",
    equation10: "Gleichung 10",
    coeffsNote: "Koeffizienten 1:1 aus Grundner et al., JAMES 2024, Gl. 10 — DYAMOND-Fit, nicht ERA5-finetuned. C = 100 · clip(f, 0, 1), und C = 0 falls qc + qi = 0 (PC2).",
  },
  en: {
    language: "Language",
    documentTitle: "Clouds",
    eyebrowPrefix: "𝔉",
    eyebrow: "Cloud module",
    title: "Clouds",
    lead: "Live diagnosis of the Grundner equation. Five quantities, three terms, R² = 0.94.",
    rhLabel: "Relative humidity",
    tLabel: "Temperature",
    dzRhLabel: "Vertical RH gradient",
    qcLabel: "Cloud water",
    qiLabel: "Cloud ice",
    pc3Title: "PC3 lower bound",
    pc3Hint: "RH floor after equation 11",
    pc3Aria: "PC3 lower bound",
    reset: "Reset",
    random: "Random",
    citation:
      "Grundner, Beucler, Gentine, Eyring (2024). Data-Driven Equation Discovery of a Cloud Cover Parameterization. JAMES 16, e2023MS003763. Symbolic regression on coarse-grained DYAMOND data, 11 parameters.",
    ccLabel: "Cloud cover",
    pc2Note: "Condensate-free — physical constraint PC2",
    diagnosticNote: "Diagnostic closure · not prognostic",
    equation10: "Equation 10",
    coeffsNote: "Coefficients 1:1 from Grundner et al., JAMES 2024, Eq. 10 — DYAMOND fit, not ERA5-finetuned. C = 100 · clip(f, 0, 1), and C = 0 if qc + qi = 0 (PC2).",
  },
};
