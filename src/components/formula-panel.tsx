import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COEFF, formatSigned } from "@/lib/grundner";
import { formatDe } from "@/lib/format";
import { useCloud, useTerms } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale";

function Coeff({ name, value, unit }: { name: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-sm bg-surface-2 px-2.5 py-2">
      <span className="font-mono text-micro uppercase tracking-wider text-muted">{name}</span>
      <span className="font-mono text-sm tabular-nums text-fg">
        {value}
        {unit ? <span className="ml-1 text-xs text-muted">{unit}</span> : null}
      </span>
    </div>
  );
}

export function FormulaPanel() {
  const { t } = useLocale();
  const [open, setOpen] = useState(true);
  const terms = useTerms();
  const { rh, t: tempK, dzRh, qc, qi } = useCloud();

  return (
    <div className="rounded-xl bg-surface shadow-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-2xs font-medium uppercase tracking-caps text-muted">
          Gleichung 10
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted transition-transform duration-200 ease-out-smooth",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out-smooth",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5 px-4 pb-4">
            <p className="font-serif text-lg leading-snug text-fg">
              f = I<sub>1</sub>(RH, T) + I<sub>2</sub>(∂<sub>z</sub>RH) + I<sub>3</sub>(q
              <sub>c</sub>, q<sub>i</sub>)
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs leading-relaxed text-muted">
              <p>
                I<sub>1</sub> = {formatSigned(terms.i1)}
                <span className="block text-2xs text-subtle">
                  a<sub>1</sub> + a<sub>2</sub>(RH − RH̄) + a<sub>3</sub>(T − T̄) + (a
                  <sub>4</sub>/2)(RH − RH̄)² + (a<sub>5</sub>/2)(T − T̄)²(RH − RH̄)
                </span>
              </p>
              <p>
                I<sub>2</sub> = {formatSigned(terms.i2)}
                <span className="block text-2xs text-subtle">
                  (a<sub>6</sub>³ / 2) (∂<sub>z</sub>RH + 3 a<sub>7</sub>/2) (∂
                  <sub>z</sub>RH)² · a<sub>6</sub> in km
                </span>
              </p>
              <p>
                I<sub>3</sub> = {formatSigned(terms.i3)}
                <span className="block text-2xs text-subtle">
                  −1 / (q<sub>c</sub>/a<sub>8</sub> + q<sub>i</sub>/a<sub>9</sub> + ε)
                </span>
              </p>
              <p className="text-subtle">
                RH = {formatDe(rh * 100, 1)} % · T = {formatDe(tempK, 1)} K · ∂zRH ={" "}
                {formatDe(dzRh, 2)} km⁻¹
                <br />
                q<sub>c</sub> = {formatDe(qc, 2)} · q<sub>i</sub> = {formatDe(qi, 2)} mg/kg
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              <Coeff name="a1" value={String(COEFF.a1)} />
              <Coeff name="a2" value={String(COEFF.a2)} />
              <Coeff name="a3" value={String(COEFF.a3)} unit="K⁻¹" />
              <Coeff name="a4" value={String(COEFF.a4)} />
              <Coeff name="a5" value="1.3176e-3" unit="K⁻²" />
              <Coeff name="a6" value="584.80" unit="m" />
              <Coeff name="a7" value={String(COEFF.a7)} unit="km⁻¹" />
              <Coeff name="a8" value={String(COEFF.a8)} unit="mg/kg" />
              <Coeff name="a9" value={String(COEFF.a9)} unit="mg/kg" />
              <Coeff name="ε" value={String(COEFF.eps)} />
            </div>
            <p className="text-2xs leading-relaxed text-subtle">{t.coeffsNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
