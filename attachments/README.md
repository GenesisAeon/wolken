# ERA5-Reproduktion der Grundner-Gleichung

Kleiner, ehrlich begrenzter Testfall zum Wolken-Modul (siehe
`../Wolken-Modul.md`, Abschnitt 7). **Kein Beitrag zu Δ_Σ** — dafür fehlt
strukturell die feine LES-Skala, die ERA5 nicht liefern kann, unabhängig
von jedem Datenzugang. Ziel hier ist ausschließlich: die bereits
verifizierte Grundner-Gleichung (Abschnitt 3 des Wolken-Moduls) an echten
Beobachtungsdaten selbst nachrechnen und mit ERA5s eigener Wolkenbedeckung
vergleichen.

## Was du dafür brauchst (nur du kannst das einrichten)

1. Kostenloser Account bei https://cds.climate.copernicus.eu/ (Climate Data
   Store, offizielles ECMWF/Copernicus-Portal, kein Institut nötig).
2. Nach Login: Profilseite → "Your API key" kopieren.
3. Datei `~/.cdsapirc` anlegen (unter Windows: `C:\Users\Privat\.cdsapirc`)
   mit Inhalt:
   ```
   url: https://cds.climate.copernicus.eu/api
   key: <UID>:<API-KEY>
   ```
4. Beim ersten Datensatz-Abruf ggf. einmalig die Nutzungsbedingungen des
   konkreten ERA5-Datensatzes auf der CDS-Webseite akzeptieren (Copernicus
   verlangt das pro Datensatz, nicht nur pro Account).

Sobald das steht, sag mir Bescheid — dann laufen die zwei Skripte hier
direkt durch.

## Skripte

- `01_fetch_era5.py` — lädt ein bewusst kleines Sample (1 Tag, 4 Zeitpunkte,
  Region Nordsee/Mitteleuropa, 6 Druckniveaus 700–925 hPa). Klein gehalten,
  damit der Download in Minuten statt Stunden fertig ist und die
  CDS-Warteschlange nicht überlastet wird.
- `02_evaluate_grundner_eq.py` — wertet die verifizierten Koeffizienten
  {a1,...,a9,ε} auf den geladenen ERA5-Profilen aus, vergleicht die
  Vorhersage mit ERA5s eigener `total_cloud_cover` und gibt R² sowie
  mittlere Abweichung aus.

## Erwartungshaltung, ehrlich formuliert

- Die Koeffizienten sind auf DYAMOND-Daten gefittet, nicht auf ERA5. Das
  Paper berichtet für ein eigenes ERA5-Finetuning andere Werte (a4/a5
  kleiner, a8/a9 ~6× größer) — die exakten Zahlen dafür haben wir nicht
  extrahiert, wir testen hier also bewusst die **Transferability der
  DYAMOND-Koeffizienten**, nicht die bestmögliche ERA5-Performance.
- Ein deutlich schlechteres R² als die 0,94 aus dem Paper ist zu erwarten
  und wäre kein Fehler, sondern genau das im Paper selbst beschriebene
  Verhalten (Abschnitt 5.4 dort).
- Die exakten ERA5-Variablennamen/Koordinatennamen im NetCDF-Output können
  sich je nach CDS-Backend-Version leicht unterscheiden (z. B.
  `pressure_level` vs. `level`, `valid_time` vs. `time`). Nach dem ersten
  echten Download bitte kurz `ds.variables` bzw. `ds.coords` gegenprüfen —
  das habe ich ohne eigenen API-Key nicht selbst verifizieren können.

## Status

2026-09-02: Skripte geschrieben und `cdsapi`/`xarray`/`netCDF4` installiert.
Noch nicht ausgeführt — wartet auf deinen API-Key.
