/**
 * Grundner et al. 2024 cloud-cover equation — copied 1:1 from
 * Wolken-Modul.md §3 and 02_evaluate_grundner_eq.py.
 *
 * Coefficients extracted from the original JAMES PDF (verified 2026-09-02).
 * DYAMOND-fitted, not the ERA5-finetuned set.
 *
 *   f(RH, T, ∂zRH, qc, qi) = I1(RH, T) + I2(∂zRH) + I3(qc, qi)
 *
 * Cloud cover C in % then follows Equation 6:
 *   C = 0                         if qc + qi = 0
 *   C = 100 · clip(f, 0, 1)       otherwise
 */

export const COEFF = {
  a1: 0.4435,
  a2: 1.1593,
  a3: -0.0145, // K⁻¹
  a4: 4.06,
  a5: 1.3176e-3, // K⁻²
  a6: 584.8036, // m
  a7: 2.0, // km⁻¹
  a8: 1.1573, // mg/kg
  a9: 0.3073, // mg/kg
  eps: 1.06,
  rhBar: 0.6025,
  tBar: 257.06, // K
} as const;

/** a6 converted to km so a6³ is dimensionless with ∂zRH in km⁻¹. */
const A6_KM = COEFF.a6 / 1000;
const A6_CUBED_HALF = A6_KM ** 3 / 2;

/** PC3 RH floor coefficients (paper Eq. 11). */
export const PC3 = {
  c1: COEFF.rhBar - COEFF.a2 / COEFF.a4, // ≈ 0.317
  c2: COEFF.a5 / (2 * COEFF.a4), // ≈ 1.623e-4 K⁻²
} as const;

/** Condensate-free threshold used in the evaluation script (mg/kg). */
export const CONDENSATE_FREE_MG_KG = 1e-6;

export type GrundnerInputs = {
  /** Relative humidity as a fraction in [0, 1]. */
  rh: number;
  /** Temperature in K. */
  t: number;
  /** Vertical RH gradient in km⁻¹. */
  dzRh: number;
  /** Cloud liquid water in mg/kg. */
  qc: number;
  /** Cloud ice in mg/kg. */
  qi: number;
};

export type GrundnerTerms = {
  i1: number;
  i2: number;
  i3: number;
  /** Unclipped f = I1 + I2 + I3 (fraction, not percent). */
  f: number;
  /** Diagnosed cloud cover in percent, after Eq. 6. */
  cc: number;
  rhUsed: number;
  pc1Clipped: boolean;
  pc2Applied: boolean;
  pc3Applied: boolean;
};

export function applyPc3Rh(rh: number, t: number): number {
  const floor = PC3.c1 - PC3.c2 * (t - COEFF.tBar) ** 2;
  return Math.max(rh, floor);
}

export function computeI1(rh: number, t: number): number {
  const dRh = rh - COEFF.rhBar;
  const dT = t - COEFF.tBar;
  return (
    COEFF.a1 +
    COEFF.a2 * dRh +
    COEFF.a3 * dT +
    (COEFF.a4 / 2) * dRh * dRh +
    (COEFF.a5 / 2) * dT * dT * dRh
  );
}

/**
 * I2(∂zRH) = (a6³ / 2) (∂zRH + 3 a7 / 2) (∂zRH)²
 * with a6 in km so the term is dimensionless (see 02_evaluate_grundner_eq.py).
 */
export function computeI2(dzRhPerKm: number): number {
  return A6_CUBED_HALF * (dzRhPerKm + 1.5 * COEFF.a7) * dzRhPerKm * dzRhPerKm;
}

/**
 * I3(qc, qi) = −1 / (qc/a8 + qi/a9 + ε)
 * Always negative. qc, qi in mg/kg.
 */
export function computeI3(qcMgKg: number, qiMgKg: number): number {
  return -1 / (qcMgKg / COEFF.a8 + qiMgKg / COEFF.a9 + COEFF.eps);
}

export function evaluateGrundner(
  input: GrundnerInputs,
  opts: { enforcePc3?: boolean } = {},
): GrundnerTerms {
  const rhUsed = opts.enforcePc3 ? applyPc3Rh(input.rh, input.t) : input.rh;
  const pc3Applied = Boolean(opts.enforcePc3) && rhUsed > input.rh + 1e-12;

  const i1 = computeI1(rhUsed, input.t);
  const i2 = computeI2(input.dzRh);
  const i3 = computeI3(input.qc, input.qi);
  const f = i1 + i2 + i3;

  const condensateFree = input.qc + input.qi <= CONDENSATE_FREE_MG_KG;
  if (condensateFree) {
    return {
      i1,
      i2,
      i3,
      f,
      cc: 0,
      rhUsed,
      pc1Clipped: false,
      pc2Applied: true,
      pc3Applied,
    };
  }

  const clipped = Math.min(1, Math.max(0, f));
  return {
    i1,
    i2,
    i3,
    f,
    cc: clipped * 100,
    rhUsed,
    pc1Clipped: f < 0 || f > 1,
    pc2Applied: false,
    pc3Applied,
  };
}

export function formatSigned(n: number, digits = 3): string {
  const body = Math.abs(n).toFixed(digits).replace(".", ",");
  return n < 0 ? `−${body}` : n > 0 ? `+${body}` : body;
}
