"""
ERA5-Abruf für die Grundner-Gleichungs-Reproduktion (Wolken-Modul, Abschnitt 3).

Zweck: kleiner, realer Testfall — NICHT Delta_Sigma (siehe Wolken-Modul.md,
Abschnitt 7: Delta_Sigma braucht LES-Feinskalendaten, die ERA5 strukturell
nicht liefern kann).

Voraussetzung: kostenloser Account bei https://cds.climate.copernicus.eu/
(Climate Data Store). Nach Login: Profil -> "Your API key" kopieren und in
~/.cdsapirc eintragen, Format:

    url: https://cds.climate.copernicus.eu/api
    key: <UID>:<API-KEY>

Bewusst klein gehalten: ein Tag, ein kleines Gebiet (Nordsee/Mitteleuropa,
wo wir ohnehin viel Wolkenbedeckung erwarten), 6 Druckniveaus in der
unteren/mittleren Troposphäre. Reicht für eine erste Plausibilitätsprüfung,
kein globales/langfristiges Klimatologie-Sample.
"""

import cdsapi

AREA = [60, -10, 45, 15]  # Nord, West, Süd, Ost (Nordsee/Mitteleuropa)
PRESSURE_LEVELS = ["700", "750", "800", "850", "900", "925"]  # hPa, untere/mittlere Troposphäre
DATE = "2025-01-15"
TIMES = ["00:00", "06:00", "12:00", "18:00"]

VARIABLES_PRESSURE = [
    "temperature",
    "relative_humidity",
    "specific_cloud_liquid_water_content",
    "specific_cloud_ice_water_content",
    "geopotential",  # zur Umrechnung Druckniveau -> Höhe z, für dz(RH)
]
VARIABLE_SINGLE = ["total_cloud_cover"]


def fetch():
    client = cdsapi.Client()

    client.retrieve(
        "reanalysis-era5-pressure-levels",
        {
            "product_type": "reanalysis",
            "variable": VARIABLES_PRESSURE,
            "pressure_level": PRESSURE_LEVELS,
            "year": DATE[:4],
            "month": DATE[5:7],
            "day": DATE[8:10],
            "time": TIMES,
            "area": AREA,
            "format": "netcdf",
        },
        "era5_pressure_levels.nc",
    )

    client.retrieve(
        "reanalysis-era5-single-levels",
        {
            "product_type": "reanalysis",
            "variable": VARIABLE_SINGLE,
            "year": DATE[:4],
            "month": DATE[5:7],
            "day": DATE[8:10],
            "time": TIMES,
            "area": AREA,
            "format": "netcdf",
        },
        "era5_single_level.nc",
    )


if __name__ == "__main__":
    fetch()
