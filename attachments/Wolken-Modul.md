# Das Wolken-Modul: eine vollständige Skalen-Instanz von 𝔉_A

*Ausarbeitung des im `deep-research-report(1).md` empfohlenen Pilotfalls
("Wähle ein Referenzsystem: Wolke") für die dort vorgeschlagene
Struktur einer skalenabhängigen Modellfamilie*
\(\mathfrak F_A=\{\mathcal M_{A,\ell}\}_\ell\) *mit*
\(\mathcal M_{A,\ell}=(X_\ell,E_\ell,S_\ell,L_\ell,M_\ell,B_\ell,K_\ell,\Xi_\ell)\).

Durchgehende Kennzeichnung: **[ETABLIERT]** = aus zitierter
Fachliteratur direkt übernommen, **[VORSCHLAG]** = hier neu
zusammengesetzt/formuliert, nicht selbst Fachliteratur, **[OFFEN]** =
erkennbare Lücke, für die mir keine publizierte Lösung bekannt ist.

**Status (2026-09-02):** Feine Skala (Pressel et al.) und grobe Skala
(Grundner et al., inkl. aller Koeffizienten und Vorzeichen) sind
vollständig aus den Original-PDFs verifiziert — siehe
`Grundner-Koeffizienten.txt` für die Rohbelege. Die beiden real
offenen Anschlussfragen (Abschnitt 4: \(\Delta_\Sigma\)-Berechnung an
echten LES-Daten; Abschnitt 5: eigenständige Auflösungs-Fixpunkt-
Analyse auf DYAMOND-Rohdaten) erfordern tatsächliche numerische Arbeit
an externen Datensätzen, die hier nicht vorliegen — dieses Dokument
formuliert sie als konkrete, angreifbare nächste Schritte, löst sie
aber nicht selbst.

---

## 0. Referenzsystem

Eine horizontal doppelt-periodische Grenzschicht-Domäne der Ausdehnung
\(L\times L\times H\) über einer definierten Unterlage (Ozean- oder
Landoberfläche), in der sich Konvektionswolken (z. B. flache
Cumulus- oder Stratocumulus-Bewölkung) unter Sonneneinstrahlung und
Strahlungskühlung entwickeln — exakt die Klasse System, für die
Pressel, Kaul, Schneider, Tan & Mishra (2015) ihre anelastische
Large-Eddy-Simulation (LES) mit geschlossener Wasser- und
Entropiebilanz entwickelt haben. **[ETABLIERT]**

- Pressel, K.G., Kaul, C.M., Schneider, T., Tan, Z., Mishra, S.
  (2015). "Large-eddy simulation in an anelastic framework with
  closed water and entropy balances." *Journal of Advances in
  Modeling Earth Systems*, 7, 1425–1456. DOI: 10.1002/2015MS000496.

---

## 1. Feine Skala \(\ell_{\mathrm{LES}}\): Zustandsraum, Generatoren, Dynamik

### 1.1 Zustandsraum \(X_{\ell_{\mathrm{LES}}}\)

Pressel et al. verwenden als prognostische Variablen **Gesamtwasser
\(q_t\)** und **spezifische Entropie \(s\)** — beide sind unter
adiabatischen, reversiblen Prozessen erhalten, *einschließlich*
reversibler Phasenwechsel des Wassers (Kondensation ⇌ Verdunstung im
Gleichgewicht). Das ist der zentrale numerische Vorteil dieser Wahl:
anders als bei Temperatur/Feuchte-Formulierungen muss die
Phasengleichgewichts-Partitionierung nicht bei jedem Zeitschritt neu
gelöst werden. **[ETABLIERT]**

$$
X_{\ell_{\mathrm{LES}}} = \bigl(\rho,\; \rho\mathbf u,\; q_t,\; s\bigr)
$$

mit anelastischer Referenzdichte \(\rho=\rho(z)\), Impuls
\(\rho\mathbf u\), Gesamtwasser-Mischungsverhältnis \(q_t\) und
spezifischer Entropie \(s\). Pressel et al. merken selbst an, dass bei
Darstellung von **Nichtgleichgewichts**-Wasserphasen (z. B. explizite
Wolkeneis- oder Regentropfen-Mikrophysik statt sofortiger
Sättigungsanpassung) zusätzliche einzelne Phasenbilanzen nötig werden
können — der Zustandsraum ist also bereits **innerhalb** des Systems
Wolke regimespezifisch, nicht fix. **[ETABLIERT]**

### 1.2 Generatoren \(E_{\ell_{\mathrm{LES}}}, S_{\ell_{\mathrm{LES}}}\)

$$
S_{\ell_{\mathrm{LES}}}[X] = \int_\Omega \rho\, s \; dV
\qquad\qquad
E_{\ell_{\mathrm{LES}}}[X] = \int_\Omega \Bigl(\tfrac12\rho|\mathbf u|^2 + \rho\, e(s,q_t,\Pi)\Bigr) dV
$$

wobei \(e\) die moist-static/innere Energie als Funktion von Entropie,
Gesamtwasser und Druck \(\Pi\) ist (anelastische
Zustandsgleichung). **[ETABLIERT: Struktur folgt Pressel et al.]**

### 1.3 Reversibler Operator \(L_{\ell_{\mathrm{LES}}}\)

Enthält: advektiven Transport von \(\rho,\rho\mathbf u,q_t,s\);
Druckgradiententerm (anelastische Druckprojektion); Auftrieb (aus
\(s,q_t\) über die anelastische Zustandsgleichung); reversible
Phasenwechsel (Kondensation/Verdunstung im lokalen Gleichgewicht, die
per Konstruktion \(s\) und \(q_t\) nicht ändern, weil beide Größen
genau so definiert sind, dass sie das aushalten). **[ETABLIERT:
Mechanismus; Zusammenfassung als \(L\)-Operator im GENERIC-Sinn ist
VORSCHLAG]**

### 1.4 Dissipativer Operator \(M_{\ell_{\mathrm{LES}}}\)

Drei real unterschiedene irreversible Quellen, die in einer
LES-Schließung getrennt geführt werden müssen:

1. **Subskalige turbulente Dissipation** — Reibung/Diffusion durch
   nicht aufgelöste Wirbel unterhalb der Gitterweite; Pressel et al.
   (2017) untersuchen explizit, wie Numerik und Subgrid-Schema
   (z. B. Smagorinsky- oder TKE-basierte Schließung) die
   Stratocumulus-LES beeinflussen. **[ETABLIERT]**
   - Pressel, K.G., Mishra, S., Schneider, T., Kaul, C.M., Tan, Z.
     (2017). "Numerics and subgrid-scale modeling in large eddy
     simulations of stratocumulus clouds." *JAMES*, 9. DOI:
     10.1002/2016MS000778.
2. **Irreversible Mikrophysik** — Umwandlung von Wolkenwasser in
   Niederschlag (Autokonversion) und dessen Sedimentation/Verdunstung
   außerhalb des lokalen Gleichgewichts sind **nicht** Teil der
   reversiblen \(s,q_t\)-Erhaltung; sie erscheinen als explizite
   Quell-/Senkenterme. **[ETABLIERT als Notwendigkeit, konkretes
   Schema ist Modellwahl]**
3. **Strahlungs-Entropiequelle** — kurzwellige Absorption und
   langwellige Kühlung (insbesondere die charakteristische
   Wolkenoberkanten-Abstrahlung, die Stratocumulus-Turbulenz
   überhaupt erst antreibt) ist ein realer, externer
   Entropiequellterm, kein internes Dissipationsprodukt. **[ETABLIERT
   als Mechanismus]**

### 1.5 Randterme \(B_{\ell_{\mathrm{LES}}}\) — warum "offenes" GENERIC nötig ist

Die Domäne ist **kein** isoliertes System: Oberflächenflüsse fühlbarer
und latenter Wärme am Untergrund, Strahlungsflussdivergenz am
Domänenoberrand und großskalige Antriebe (Subsidenz, geostrophischer
Wind, "nudging") treten als Randbedingungen auf. Genau dafür wurde
GENERIC von Öttinger auf **offene** Systeme erweitert, mit getrennten
Volumen- und Randbeiträgen. **[ETABLIERT]**

- Öttinger, H.C. (Erweiterung von GENERIC auf offene Systeme, wie im
  `deep-research-report(1).md` referenziert; Volumen-/Randtrennung).

### 1.6 Lokale Entropiebilanz auf der feinen Skala

$$
\boxed{\;\partial_t(\rho s) + \nabla\!\cdot(\rho s\,\mathbf u) \;=\; \sigma_{\ell_{\mathrm{LES}}} \;+\; \dot\sigma_{\mathrm{rad}} \;+\; \dot\sigma_{\mathrm{mp}}\;}
\qquad \sigma_{\ell_{\mathrm{LES}}}\ge 0
$$

mit \(\sigma_{\ell_{\mathrm{LES}}}\) = subskalige (turbulente)
Dissipationsproduktion, \(\dot\sigma_{\mathrm{rad}}\) =
Strahlungs-Entropiequelle, \(\dot\sigma_{\mathrm{mp}}\) =
irreversible Mikrophysik-Produktion. **[VORSCHLAG: diese
Drei-Term-Zerlegung ist meine Strukturierung; jeder Einzelterm ist
physikalisch etabliert, ihre gemeinsame Buchführung in dieser Form
nicht direkt so bei Pressel et al. zu finden]**

---

## 2. Coarse-Graining \(\mathcal C_{\ell_{\mathrm{LES}} \to b\ell}\)

### 2.1 Operator

Räumliche und zeitliche Mittelung über eine GCM-Gitterzellenfläche
(getestete Auflösungen in der realen Literatur: grob 80 km, 40 km,
20 km) und ein Mittelungsfenster \(\tau\):

$$
\mathcal C_{\ell_{\mathrm{LES}}\to b\ell}[X_{\ell_{\mathrm{LES}}}] \;=\; \frac{1}{|A_{b\ell}|\,\tau}\int_{A_{b\ell}}\!\!\int_\tau X_{\ell_{\mathrm{LES}}}\; dt\, dA
$$

Morcrette et al. mitteln explizit **über mehrere Flächenskalen**
zugleich, damit das gelernte Modell die Abhängigkeit der
Wolkenbeschreibung von der betrachteten Flächengröße selbst als
Größe abbildet, statt sie für eine feste Auflösung zu fitten.
**[ETABLIERT]**

### 2.2 Warum \(\mathcal C[F(x)]\neq F(\mathcal C[x])\) hier konkret sichtbar wird

Wolkenbedeckung (cloud fraction) ist auf der LES-Skala keine
eigenständige prognostische Variable — sie ist dort im Grunde \(0\)
oder \(1\) pro Gitterzelle (gesättigt/ungesättigt). Erst durch die
Mittelung \(\mathcal C\) über viele LES-Zellen entsteht eine
**neue, auf der feinen Skala nicht existierende** Größe: der Anteil
gesättigter Teilvolumina. Das ist der Grund, warum die grobe
Schließung nicht einfach "dieselbe Formel mit gröberem Gitter" sein
kann — die relevante Zielgröße existiert erst nach dem
Coarse-Graining. **[VORSCHLAG: diese Lesart als Kategorienfehler-Beleg;
der zugrunde liegende Fakt (CC ist erst nach Mittelung sinnvoll
definiert) ist Standardwissen der Wolkenparametrisierung]**

---

## 3. Grobe Skala \(b\ell\): der reale, publizierte Schließungs-Fund

Grundner, Beucler, Gentine, Iglesias-Suarez, Giorgetta, Eyring (2024)
leiten per **symbolischer Regression** aus coarse-grained
DYAMOND-Sturm-auflösenden-Simulationsdaten eine interpretierbare
Wolkenbedeckungsgleichung her. Ihre beste Gleichung erreicht
\(R^2=0{,}94\) bei nur **11 trainierbaren Parametern** — vergleichbar
mit einem neuronalen Netz, aber algebraisch geschlossen und
interpretierbar. **[ETABLIERT]**

- Grundner, A., Beucler, T., Gentine, P., Iglesias-Suarez, F.,
  Giorgetta, M.A., Eyring, V. (2024). "Data-Driven Equation Discovery
  of a Cloud Cover Parameterization." *JAMES*, 16(3), e2023MS003763.
  DOI: 10.1029/2023MS003763.

Die reale Gleichungsstruktur (drei additive Komponenten):

$$
\mathrm{CC}_{b\ell} \;=\; I_1(\mathrm{RH}, T) \;+\; I_2(\partial_z \mathrm{RH}) \;+\; I_3(q_c, q_i)
$$

mit \(I_1\) quadratisch in relativer Feuchte \(\mathrm{RH}\) und
Temperatur \(T\), \(I_2\) kubisch im vertikalen Gradienten
\(\partial_z\mathrm{RH}\), und \(I_3\) einer inversen Funktion der
Kondensatgehalte (Wolkenwasser \(q_c\), Wolkeneis \(q_i\)).

**Koeffizienten [ETABLIERT, verifiziert 2026-09-02 per `pdftotext`
direkt aus dem Original-PDF, siehe `Grundner-Koeffizienten.txt`]:**

$$
I_1(\mathrm{RH},T) = a_1 + a_2(\mathrm{RH}-\bar{\mathrm{RH}}) + a_3(T-\bar T) + \tfrac{a_4}{2}(\mathrm{RH}-\bar{\mathrm{RH}})^2 + \tfrac{a_5}{2}(T-\bar T)^2(\mathrm{RH}-\bar{\mathrm{RH}})
$$
$$
I_2(\partial_z\mathrm{RH}) = \tfrac{a_6^3}{2}\Bigl(\partial_z\mathrm{RH} + \tfrac{3a_7}{2}\Bigr)(\partial_z\mathrm{RH})^2
\qquad
I_3(q_c,q_i) = -\frac{1}{q_c/a_8 + q_i/a_9 + \varepsilon}
$$

\(I_3\) ist **stets negativ** und senkt die Wolkenbedeckung dort, wo
wenig Wolkeneis oder -wasser vorhanden ist — es garantiert damit die
physikalische Randbedingung "keine Kondensate ⇒ keine Wolken" (PC4/PC5
im Paper). \(\varepsilon\) verhindert Division durch Null im
kondensatfreien Grenzfall. **[ETABLIERT, wörtlich aus Abschnitt 6.1:
"The third function I3(qc, qi) is always negative and decreases cloud
cover where there is little cloud ice or water."]**

$$
\{a_1,\dots,a_9,\varepsilon\} = \{0{,}4435,\; 1{,}1593,\; -0{,}0145\,\mathrm{K}^{-1},\; 4{,}06,\; 1{,}3176\!\times\!10^{-3}\,\mathrm{K}^{-2},\; 584{,}8036\,\mathrm m,\; 2\,\mathrm{km}^{-1},\; 1{,}1573\,\mathrm{mg/kg},\; 0{,}3073\,\mathrm{mg/kg},\; 1{,}06\}
$$

mit Referenzwerten \(\bar{\mathrm{RH}}=0{,}6025\), \(\bar T=257{,}06\,\mathrm K\)
(Trainingsdatensatz-Mittelwerte, nicht gefittet). Die im Paper
genannten "11 trainierbaren Parameter" ergeben sich vermutlich aus
\(a_1,\dots,a_9\) plus \(\bar{\mathrm{RH}},\bar T\) als Teil der
normierten Parametrisierung; \(\varepsilon\) ist wahrscheinlich eine
feste Regularisierungskonstante (Division-durch-Null-Schutz), keine
echte Trainingsgröße — Details der Zählweise in
`Grundner-Koeffizienten.txt`.

**Wichtig für die Einordnung in \(\mathfrak F_A\):** Diese Gleichung
ist eine **diagnostische Schließung** — sie sagt Wolkenbedeckung aus
anderen groben Zustandsgrößen vorher. Sie ist **nicht** bereits das
vollständige \(\mathcal M_{b\ell}=(X_{b\ell},E_{b\ell},S_{b\ell},
L_{b\ell},M_{b\ell},\dots)\), das für eine eigenständige,
entropie-konsistente Dynamik auf der groben Skala nötig wäre. Sie ist
ein reales, publiziertes **Puzzleteil** von \(\mathcal M_{b\ell}\),
kein vollständiger Ersatz. **[VORSCHLAG: diese Einordnung]**

---

## 4. Die Entropie-Closure-Differenz \(\Delta_\Sigma\) — konkret für Wolken

Der `deep-research-report(1).md` schlägt vor:

$$
\Delta_\Sigma(\ell\to b\ell) = \bigl\langle \mathcal C_{\ell\to b\ell}[\sigma_\ell]\bigr\rangle - \sigma_{b\ell}^{\mathrm{model}}
$$

Für das Wolken-Modul konkret: man würde die aus Pressel-artigen
LES-Läufen berechnete, grob gemittelte reale Entropieproduktion
\(\langle\mathcal C[\sigma_{\ell_{\mathrm{LES}}}]\rangle\) (Summe aus
turbulenter, mikrophysikalischer und Strahlungsproduktion, gemittelt
über die GCM-Zelle) mit der Entropieproduktion vergleichen, die ein
grobes Schema **implizit** unterstellt, wenn es aus \(\mathrm{CC}\),
\(\mathrm{RH}\) usw. auf Wärme-/Feuchteflüsse zurückrechnet. **Soweit
mir aus der Literatur bekannt, wurde dieser Vergleich für
Wolkenschließungen bislang nicht durchgeführt** — Grundner et al.
optimieren gegen Wolkenbedeckung selbst, nicht gegen eine
Entropiebilanz. **[OFFEN — das ist die konkrete, testbare
Forschungslücke, die aus diesem Modul folgt.]**

Ein nicht verschwindendes \(\Delta_\Sigma\) wäre der Hinweis, dass die
Grundner-Schließung zwar Wolkenbedeckung korrekt reproduziert, dabei
aber reale dissipative Freiheitsgrade (Gedächtnis, Korrelationen)
unterschlägt — mit genau der Konsequenz, die der Report allgemein
beschreibt: eine Schließung kann Mittelwerte treffen und trotzdem
Transport-/Gedächtniseigenschaften verlieren.

---

## 5. RG-Test: gibt es einen Fixpunkt?

**Korrektur gegenüber der ersten Fassung dieses Abschnitts
(verifiziert 2026-09-02 direkt aus dem Volltext):** Die ursprünglich
hier formulierte Frage ("laufen die 11 Parameter über die
Auflösungsstufen hinweg gegen einen Fixpunkt?") ist mit den im Paper
publizierten Daten **so nicht beantwortbar** — und zwar nicht, weil
die Daten fehlen, sondern weil das Experiment anders angelegt ist als
angenommen:

> "For simplicity, in this section, we omit any coarse-graining in
> the vertical and **do not retune the schemes for the higher
> resolutions**." (Abschnitt 5.3)

Die Koeffizienten \(a_1,\dots,a_9\) aus Abschnitt 3 sind **einmalig
bei 80 km (R2B5) gefittet** und werden dann unverändert bei 40 km
(R2B6) und 20 km (R2B7) ausgewertet — es gibt also gar keine
separaten Parametersätze pro Auflösung, die "fließen" könnten. Getestet
wird stattdessen reine **Transferability der festen Gleichung**, nicht
RG-Fluss der Kopplungen im engeren Sinn. **[ETABLIERT — Korrektur]**

Das tatsächliche, real berichtete Ergebnis ist trotzdem bemerkenswert
und für unsere Fragestellung relevant, nur anders als gedacht: \(R^2\)
verbessert sich **fast linear mit steigender Auflösung** (also bei
20 km besser als bei 80 km), **obwohl** bei 80 km trainiert wurde — von
den Autoren selbst als überraschend bezeichnet:

> "We observe a clear, almost linear, tendency of all schemes to
> improve their R2-score on the coarse-grained data sets as we
> increase the resolution. [...] we find these improvements
> surprising, considering that the schemes were trained at a
> resolution of 80 km." (Abschnitt 5.3)

Als Erklärung bieten die Autoren an: bei 80 km sind die Eingangsgrößen
über so große Gebiete gemittelt, dass sie kaum noch Information über
die tatsächlich zu erwartende Wolkenbedeckung tragen; bei feinerer
Auflösung sind Großskalen-Variablen und Wolkenbedeckung enger
gekoppelt. **[ETABLIERT]**

Eine echte, davon unabhängige zweite Datenlage zur Koeffizienten-
Stabilität existiert aber doch — nicht über Auflösung, sondern über
**Datenquelle** (DYAMOND-Training vs. ERA5-Feintuning):

> "When fit to the ERA5 data, the coefficients of the linear terms
> are found to be stable, while the emphasis on the non-linear terms
> is somewhat decreased; \(a_4\) is 1.53 [times smaller] and \(a_5\)
> is 2.5 times smaller." (Abschnitt 6.1)

Ergänzend, ebenfalls wörtlich aus Abschnitt 6.1: beim ERA5-Finetuning
sind auch \(a_8\) und \(a_9\) (die Kondensat-Skalen in \(I_3\))
"roughly six times larger" — die Gleichung wird auf Beobachtungsdaten
also spürbar unempfindlicher gegenüber Wolkenwasser/-eis. Damit zeigt
sich ein konsistentes Muster: die **linearen** Terme (\(a_1,a_2,a_3\))
sind über den Datensatzwechsel hinweg stabil, die **nichtlinearen**
Terme (\(a_4,a_5,a_8,a_9\)) verschieben sich alle in Richtung
"gedämpfter/unempfindlicher" auf ERA5 — ein plausibles, aber hier nur
beschriebenes, nicht selbst geprüftes Muster.

Das ist strukturell näher an einer echten "Universalitätsklasse"-Frage
im Sinn des Reports: dieselbe Gleichungsform bleibt über einen
Datensatzwechsel hinweg gültig, mit stabilen linearen und leicht
gedämpften nichtlinearen Termen — aber es ist ein Distributionswechsel
(Modell- vs. Beobachtungsdaten), keine Skalentransformation \(\ell\to
b\ell\). Eine echte Auflösungs-Fixpunkt-Analyse (separat gefittete
Parametersätze pro Skala, deren Fluss verfolgt wird) **wurde in diesem
Paper nicht durchgeführt** und bleibt eine offene, eigenständige
Analyseaufgabe. **[OFFEN]**

---

## 6. Gesamtbild: das Wolken-Modul als vollständige \(\mathcal M_{A,\ell}\)-Instanz

| Baustein | Feine Skala \(\ell_{\mathrm{LES}}\) | Grobe Skala \(b\ell\) (GCM-Zelle) |
|---|---|---|
| \(X_\ell\) | \(\rho,\rho\mathbf u,q_t,s\) (Pressel et al. 2015) | RH, \(\partial_z\)RH, T, \(q_c\), \(q_i\), CC |
| \(S_\ell\) | \(\int\rho s\,dV\), thermodynamisch | implizit in CC-Schließung enthalten, nicht separat geführt **[OFFEN]** |
| \(L_\ell\) | Advektion, Druck, Auftrieb, reversible Phasenwechsel | nicht explizit — CC ist Diagnose, keine Dynamik |
| \(M_\ell\) | Subgrid-Turbulenz + Mikrophysik + Strahlung (3 reale, getrennte Terme) | implizit in \(I_1,I_2,I_3\) verborgen **[OFFEN, wie zu entflechten]** |
| \(B_\ell\) | Oberflächenflüsse, Strahlung am Domänenrand, Großskalenantrieb | Großskalen-Umgebung des GCM |
| \(\mathcal C_{\ell\to b\ell}\) | räumlich-zeitliche Mittelung (Morcrette et al.) | — |
| Reales Ergebnis | geschlossene Wasser-/Entropiebilanz (Pressel) | \(R^2=0{,}94\)-Gleichung (Grundner) |
| Fehlendes Bindeglied | — | \(\Delta_\Sigma\) nie berechnet; \(S_{b\ell}\) nie eigenständig definiert |

**Kernaussage dieser Ausarbeitung:** Für die feine Skala existiert
bereits ein vollständiges, entropie-konsistentes Modul (Pressel et
al.). Für die grobe Skala existiert ein reales, gut funktionierendes
**Diagnose**-Stück (Grundner et al.), aber **kein** vollständiges,
eigenständig entropie-konsistentes \(\mathcal M_{b\ell}\) und **keine**
publizierte \(\Delta_\Sigma\)-Bilanz zwischen beiden Skalen. Das ist
exakt die Lücke, die eine neue, eigenständige Beitragsmöglichkeit
markiert — nicht die Bestätigung eines bereits gelösten Problems.

---

## 7. Nächster konkreter Schritt — Status: blockiert ohne Institutszugang

**Update (2026-09-02):** Beide unten skizzierten Fortsetzungen wurden
konkret auf Datenzugang geprüft, nicht nur angenommen:

1. **RG-Fixpunkt-Analyse** (eigene Parametersätze pro
   DYAMOND-Auflösungsstufe fitten): Das GitHub-Repo von Grundner et al.
   enthält **keine** Rohdaten, nur Code. Das mitgelieferte
   `quickstart_real_data.ipynb` lädt direkt von einem harten Pfad auf
   dem DKRZ-Supercomputer Levante (`/home/b/.../DYAMOND/hvcg_data/...`)
   — institutioneller Zugang (deutsches Klimarechenzentrum), kein
   öffentlicher Download, laut Paper "several TB". Das mitgelieferte
   `quickstart_synth_data.ipynb` erzeugt nur **synthetische
   Zufallsdaten** zu Demozwecken (eigene, mit den echten
   Grundner-Koeffizienten nicht verwandte Testgleichung) — nicht
   brauchbar.
2. **\(\Delta_\Sigma\)-Berechnung** an echten LES-Daten (Pressel et
   al.): Der PyCLES-Code ist Open Source, aber laut Paper sind die
   Simulationsoutputs selbst nur "available from the corresponding
   author upon request" — keine automatisierte Beschaffung möglich.

**Fazit:** Beide Anschlussschritte sind **ohne institutionelle
Anbindung (DKRZ-Account bzw. persönliche Anfrage an die Pressel-Gruppe)
faktisch nicht durchführbar** — das ist keine Recherchelücke, sondern
eine reale Zugangsbeschränkung großer Klimamodell-Rohdaten. Dieses
Dokument bleibt an dieser Stelle bewusst stehen, statt eine
Ersatzlösung vorzutäuschen.

**Umgesetzter kleinerer Ersatzweg (2026-09-02, Skripte fertig, wartet auf
API-Key):** in `era5_grundner_reproduktion/` liegt eine vorbereitete
ERA5-Reproduktion der verifizierten Grundner-Gleichung (Copernicus Climate
Data Store, öffentlich, kostenloser Account). **Wichtig:** das ist
ausdrücklich **kein** Beitrag zu \(\Delta_\Sigma\) — ERA5 ist selbst schon
eine grobe Reanalyse (~31 km) ohne feinere Skala darunter, die man
coarse-grainen könnte. Es ist eine eigenständige Verifikation der
Gleichungsstruktur an echten Beobachtungsdaten (Vergleich Vorhersage vs.
ERA5s eigene `total_cloud_cover`), siehe `era5_grundner_reproduktion/README.md`
für Details und den noch fehlenden Schritt (CDS-API-Key).
