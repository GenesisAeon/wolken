import { Dice5, RotateCcw } from "lucide-react";
import { COEFF } from "@/lib/grundner";
import { formatDe } from "@/lib/format";
import { PRESETS, RANGES } from "@/lib/presets";
import { useCloud } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { ParamSlider } from "./param-slider";
import { TermMeter } from "./term-meter";
import { FormulaPanel } from "./formula-panel";
import { I1Field } from "./i1-field";
import { LocaleSwitch } from "@/components/locale-switch";
import { useLocale } from "@/lib/i18n/locale";

export function ControlPanel() {
  const { t } = useLocale();
  const cloud = useCloud();

  return (
    <aside className="flex flex-col gap-5 bg-bg px-5 py-5 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-6 lg:py-6">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-2xs font-medium uppercase tracking-caps text-muted">
            {t.eyebrowPrefix}
            <sub>A</sub> · {t.eyebrow}
          </p>
          <LocaleSwitch />
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-fg">{t.title}</h1>
        <p className="text-sm leading-relaxed text-muted">{t.lead}</p>
      </header>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => cloud.applyPreset(p.id)}
            title={p.blurb}
            className={cn(
              "h-11 shrink-0 rounded-full px-3.5 text-sm whitespace-nowrap transition-[background-color,color] duration-150 ease-out",
              cloud.presetId === p.id
                ? "bg-accent text-accent-fg"
                : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-panel">
        <ParamSlider
          label={t.rhLabel}
          symbol="RH"
          unit="%"
          value={cloud.rh}
          min={RANGES.rh.min}
          max={RANGES.rh.max}
          step={RANGES.rh.step}
          display={`${formatDe(cloud.rh * 100, 1)} %`}
          mark={COEFF.rhBar}
          markLabel="RH̄"
          onChange={(v) => cloud.setField("rh", v)}
        />
        <ParamSlider
          label={t.tLabel}
          symbol="T"
          unit="K"
          value={cloud.t}
          min={RANGES.t.min}
          max={RANGES.t.max}
          step={RANGES.t.step}
          display={`${formatDe(cloud.t, 1)} K`}
          mark={COEFF.tBar}
          markLabel="T̄"
          onChange={(v) => cloud.setField("t", v)}
        />
        <ParamSlider
          label={t.dzRhLabel}
          symbol="∂zRH"
          unit="km⁻¹"
          value={cloud.dzRh}
          min={RANGES.dzRh.min}
          max={RANGES.dzRh.max}
          step={RANGES.dzRh.step}
          display={`${formatDe(cloud.dzRh, 2)} km⁻¹`}
          mark={-2}
          markLabel="Sc-Deck"
          onChange={(v) => cloud.setField("dzRh", v)}
        />
        <ParamSlider
          label={t.qcLabel}
          symbol="qc"
          unit="mg/kg"
          value={cloud.qc}
          min={RANGES.qc.min}
          max={RANGES.qc.max}
          step={RANGES.qc.step}
          display={`${formatDe(cloud.qc, 2)} mg/kg`}
          mark={COEFF.a8}
          markLabel="a8"
          onChange={(v) => cloud.setField("qc", v)}
        />
        <ParamSlider
          label={t.qiLabel}
          symbol="qi"
          unit="mg/kg"
          value={cloud.qi}
          min={RANGES.qi.min}
          max={RANGES.qi.max}
          step={RANGES.qi.step}
          display={`${formatDe(cloud.qi, 2)} mg/kg`}
          mark={COEFF.a9}
          markLabel="a9"
          onChange={(v) => cloud.setField("qi", v)}
        />
      </div>

      <TermMeter />

      <I1Field />

      <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 shadow-panel">
        <div className="flex min-w-0 flex-col">
          <span className="text-sm text-fg">{t.pc3Title}</span>
          <span className="text-xs text-muted">{t.pc3Hint}</span>
        </div>
        <Switch
          checked={cloud.enforcePc3}
          onCheckedChange={cloud.setEnforcePc3}
          aria-label={t.pc3Aria}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={() => cloud.applyPreset("sc")}>
          <RotateCcw className="size-4" />
          {t.reset}
        </Button>
        <Button variant="ghost" className="flex-1" onClick={cloud.randomize}>
          <Dice5 className="size-4" />
          {t.random}
        </Button>
      </div>

      <FormulaPanel />

      <p className="text-2xs leading-relaxed text-subtle">{t.citation}</p>
    </aside>
  );
}
