# Wolken

Interaktive Sandbox der **Grundner-Gleichung** (JAMES 2024): Wolkenbedeckung live aus relativer Feuchte, Temperatur, vertikalem Feuchtegradienten, Wolkenwasser und Wolkeneis.

\[
f(\mathrm{RH}, T, \partial_z\mathrm{RH}, q_c, q_i) = I_1(\mathrm{RH}, T) + I_2(\partial_z\mathrm{RH}) + I_3(q_c, q_i)
\]

Koeffizienten \(\{a_1,\dots,a_9,\varepsilon\}\) 1:1 aus Grundner, Beucler, Gentine, Eyring (2024), *Data-Driven Equation Discovery of a Cloud Cover Parameterization*, [JAMES 16, e2023MS003763](https://doi.org/10.1029/2023MS003763) — DYAMOND-Fit, nicht ERA5-finetuned.

Die Stratocumulus-Referenzspalte liefert **91,7 %** Bedeckung.

## Lokal starten

```bash
npm install
npm run dev
```

Danach im Browser: die Vorschau auf Port 8080. Slider, Regime-Presets (Stratocumulus, Cumulus, Cirrus, Nimbostratus, Klar) und das \(I_1(\mathrm{RH},T)\)-Feld steuern die Diagnose in Echtzeit. Partikel-/Nebel-Himmel wird mit steigender Bedeckung dichter. Kondensatfrei (\(q_c+q_i=0\)) erzwingt \(C=0\) (PC2).

```bash
npm test          # inkl. 1:1-Tests der Gleichung
npm run typecheck
npm run build
```

## Herkunft

- Gleichung und Koeffizienten: [attachments/Wolken-Modul.md](attachments/Wolken-Modul.md)
- ERA5-Nachrechnung (nicht \(\Delta_\Sigma\)): [attachments/](attachments/)
- Originalpaper: [doi:10.1029/2023MS003763](https://doi.org/10.1029/2023MS003763)
