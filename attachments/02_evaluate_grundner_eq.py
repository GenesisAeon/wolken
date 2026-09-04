"""
Wertet die verifizierte Grundner-et-al.-Gleichung (Wolken-Modul.md,
Abschnitt 3; Koeffizienten aus Grundner-Koeffizienten.txt, wörtlich aus dem
Original-PDF extrahiert) auf echten ERA5-Profilen aus und vergleicht die
Vorhersage mit ERA5s eigener total_cloud_cover-Angabe.

WICHTIG zur Einordnung (siehe Wolken-Modul.md Abschnitt 7):
- Die Koeffizienten sind auf coarse-grained DYAMOND-Daten gefittet, NICHT
  auf ERA5. Das Paper berichtet für ein separates ERA5-Finetuning andere
  Werte (a4/a5 kleiner, a8/a9 ~6x größer) - die verwenden wir hier bewusst
  NICHT, weil wir die exakten ERA5-gefitteten Zahlen nicht extrahiert haben.
  Wir testen also explizit die TRANSFERABILITY der DYAMOND-Koeffizienten
  auf ERA5-Daten, so wie es das Paper selbst in Abschnitt 5.4 tut - keine
  neue Wissenschaft, sondern eine eigene Nachrechnung/Verifikation.
- Das ist KEIN Beitrag zur Delta_Sigma-Frage (Entropieproduktion). Dafür
  fehlt strukturell die feine LES-Skala, die ERA5 nicht liefert.
"""

import numpy as np
import xarray as xr

# --- Verifizierte Koeffizienten (Grundner-Koeffizienten.txt) ---
a1, a2, a3, a4, a5 = 0.4435, 1.1593, -0.0145, 4.06, 1.3176e-3
a6, a7 = 584.8036, 2.0  # a6 in m, a7 in km^-1 (siehe Umrechnung unten)
a8, a9 = 1.1573, 0.3073  # mg/kg
EPS = 1.06
RH_BAR = 0.6025
T_BAR = 257.06  # K

G0 = 9.80665  # m/s^2, zur Umrechnung Geopotential -> Höhe


def grundner_cc(rh, T, dz_rh_per_km, qc_mg_kg, qi_mg_kg):
    """CC-Vorhersage nach Gleichung 10, inkl. korrigiertem Vorzeichen von I3."""
    I1 = (
        a1
        + a2 * (rh - RH_BAR)
        + a3 * (T - T_BAR)
        + (a4 / 2) * (rh - RH_BAR) ** 2
        + (a5 / 2) * (T - T_BAR) ** 2 * (rh - RH_BAR)
    )
    # a6 in m, a7 in km^-1 -> a6/1000 in km, damit a6^3-Term dimensionslos
    # konsistent mit dz_rh in km^-1 bleibt (siehe Originalgleichung, Abschnitt 3
    # des Wolken-Moduls). a6_km = a6/1000.
    a6_km = a6 / 1000.0
    I2 = (a6_km**3 / 2) * (dz_rh_per_km + 1.5 * a7) * dz_rh_per_km**2
    I3 = -1.0 / (qc_mg_kg / a8 + qi_mg_kg / a9 + EPS)

    f = I1 + I2 + I3
    cc = np.clip(f, 0.0, 1.0) * 100.0
    # PC2: kondensatfreie Zellen -> 0% (Gleichung 6)
    cc = np.where((qc_mg_kg + qi_mg_kg) <= 1e-6, 0.0, cc)
    return cc, I1, I2, I3


def main():
    ds_p = xr.open_dataset("era5_pressure_levels.nc")
    ds_s = xr.open_dataset("era5_single_level.nc")

    rh = ds_p["r"] / 100.0  # % -> Anteil
    T = ds_p["t"]  # K
    qc = ds_p["clwc"] * 1e6  # kg/kg -> mg/kg
    qi = ds_p["ciwc"] * 1e6  # kg/kg -> mg/kg
    z = ds_p["z"] / G0  # Geopotential -> Höhe in m

    # dz(RH) in km^-1: zentrale Differenz über Druckniveaus, sortiert nach Höhe
    z_km = z / 1000.0
    dz_rh = rh.differentiate("pressure_level") / z_km.differentiate("pressure_level")

    cc_pred, I1, I2, I3 = grundner_cc(rh, T, dz_rh, qc, qi)

    cc_era5 = ds_s["tcc"] * 100.0  # Anteil -> %

    # Vertikal: die grobskalige CC ist laut Paper das vertikale Maximum
    # (max-overlap-Näherung, siehe Wolken-Modul.md / Grundner Abschnitt 2.1)
    cc_pred_colmax = cc_pred.max(dim="pressure_level")

    diff = cc_pred_colmax - cc_era5
    r2 = 1 - float((diff**2).sum()) / float(((cc_era5 - cc_era5.mean()) ** 2).sum())

    print("Vergleich Grundner-Vorhersage (DYAMOND-Koeffizienten, ungetunt) vs. ERA5 total_cloud_cover:")
    print(f"  mittlere Vorhersage: {float(cc_pred_colmax.mean()):.1f} %")
    print(f"  mittlere ERA5-Angabe: {float(cc_era5.mean()):.1f} %")
    print(f"  mittlere Differenz: {float(diff.mean()):.1f} Prozentpunkte")
    print(f"  R^2 (räumlich/zeitlich, dieses Sample): {r2:.3f}")
    print()
    print("Erwartung laut Wolken-Modul.md: deutlich schlechter als das Paper-eigene")
    print("R^2=0.94, weil (a) DYAMOND-Koeffizienten ungetunt auf ERA5 angewendet")
    print("werden (das Paper berichtet für echtes ERA5-Finetuning andere Werte),")
    print("und (b) dieses Sample klein/regional ist, kein globales Klimatologie-Mittel.")


if __name__ == "__main__":
    main()
