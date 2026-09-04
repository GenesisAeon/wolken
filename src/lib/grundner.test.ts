import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COEFF,
  CONDENSATE_FREE_MG_KG,
  PC3,
  applyPc3Rh,
  computeI1,
  computeI2,
  computeI3,
  evaluateGrundner,
} from "./grundner.ts";

describe("Grundner equation (Wolken-Modul §3, 1:1)", () => {
  it("keeps the verified DYAMOND coefficients", () => {
    assert.equal(COEFF.a1, 0.4435);
    assert.equal(COEFF.a2, 1.1593);
    assert.equal(COEFF.a3, -0.0145);
    assert.equal(COEFF.a4, 4.06);
    assert.equal(COEFF.a5, 1.3176e-3);
    assert.equal(COEFF.a6, 584.8036);
    assert.equal(COEFF.a7, 2);
    assert.equal(COEFF.a8, 1.1573);
    assert.equal(COEFF.a9, 0.3073);
    assert.equal(COEFF.eps, 1.06);
    assert.equal(COEFF.rhBar, 0.6025);
    assert.equal(COEFF.tBar, 257.06);
  });

  it("I1 at training-set mean equals a1", () => {
    assert.equal(computeI1(COEFF.rhBar, COEFF.tBar), COEFF.a1);
  });

  it("I2 vanishes at ∂zRH = 0 and peaks locally at −2 km⁻¹", () => {
    assert.equal(computeI2(0), 0);
    const peak = computeI2(-2);
    const a6km = COEFF.a6 / 1000;
    const expected = ((a6km ** 3) / 2) * (-2 + 1.5 * COEFF.a7) * 4;
    assert.ok(Math.abs(peak - expected) < 1e-12);
    assert.ok(peak > computeI2(-1.5));
    assert.ok(peak > computeI2(-2.5));
  });

  it("I3 is always negative and → 0 as condensate grows", () => {
    const small = computeI3(0.5, 0);
    const large = computeI3(40, 20);
    assert.ok(small < 0);
    assert.ok(large < 0);
    assert.ok(large > small);
    const empty = computeI3(0, 0);
    assert.equal(empty, -1 / COEFF.eps);
  });

  it("PC2: condensate-free cells force C = 0", () => {
    const terms = evaluateGrundner({
      rh: 0.95,
      t: 280,
      dzRh: -2,
      qc: 0,
      qi: 0,
    });
    assert.equal(terms.cc, 0);
    assert.equal(terms.pc2Applied, true);
    assert.ok(terms.f !== 0);
  });

  it("diagnoses the Stratocumulus reference column", () => {
    const terms = evaluateGrundner(
      { rh: 0.85, t: 283, dzRh: -2, qc: 15, qi: 0 },
      { enforcePc3: true },
    );
    assert.equal(terms.pc2Applied, false);
    assert.ok(terms.cc > 90 && terms.cc < 93, `cc=${terms.cc}`);
    assert.ok(Math.abs(terms.cc - 91.717) < 0.02);
  });

  it("clips f into [0, 100] % (PC1)", () => {
    const high = evaluateGrundner({
      rh: 1,
      t: 220,
      dzRh: -2,
      qc: 40,
      qi: 20,
    });
    assert.ok(high.cc <= 100);
    const low = evaluateGrundner({
      rh: 0.35,
      t: 305,
      dzRh: 1.5,
      qc: 0.01,
      qi: 0,
    });
    assert.ok(low.cc >= 0);
  });

  it("PC3 RH floor matches Eq. 11 coefficients", () => {
    const c1 = COEFF.rhBar - COEFF.a2 / COEFF.a4;
    const c2 = COEFF.a5 / (2 * COEFF.a4);
    assert.ok(Math.abs(PC3.c1 - c1) < 1e-12);
    assert.ok(Math.abs(PC3.c2 - c2) < 1e-12);
    assert.ok(Math.abs(c1 - 0.317) < 0.001);
    assert.ok(Math.abs(c2 - 1.623e-4) < 1e-6);

    const used = applyPc3Rh(0.1, COEFF.tBar);
    assert.ok(Math.abs(used - c1) < 1e-12);
    const alreadyMoist = applyPc3Rh(0.8, COEFF.tBar);
    assert.equal(alreadyMoist, 0.8);
  });

  it("does not treat 1e-6 mg/kg as condensate", () => {
    const terms = evaluateGrundner({
      rh: 0.9,
      t: 270,
      dzRh: 0,
      qc: CONDENSATE_FREE_MG_KG,
      qi: 0,
    });
    assert.equal(terms.cc, 0);
  });
});
