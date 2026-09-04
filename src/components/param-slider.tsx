import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  symbol: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  mark?: number;
  markLabel?: string;
  onChange: (value: number) => void;
};

export function ParamSlider({
  label,
  symbol,
  unit,
  value,
  min,
  max,
  step,
  display,
  mark,
  markLabel,
  onChange,
}: Props) {
  const markPct =
    mark === undefined ? null : ((mark - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="text-sm font-medium text-fg">{label}</span>
          <span className="font-mono text-xs text-muted">{symbol}</span>
        </div>
        <span className="font-mono text-sm tabular-nums text-fg">{display}</span>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? min)}
        className="relative flex h-11 w-full touch-none items-center select-none"
        aria-label={`${label} ${unit}`.trim()}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-surface-2">
          <SliderPrimitive.Range className="absolute h-full bg-accent" />
        </SliderPrimitive.Track>
        {markPct !== null ? (
          <span
            className="pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2 bg-muted/70"
            style={{ left: `${markPct}%` }}
            title={markLabel}
          />
        ) : null}
        <SliderPrimitive.Thumb
          className={cn(
            "block size-4 rounded-full bg-cloud shadow-thumb",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
        />
      </SliderPrimitive.Root>
      {markLabel && markPct !== null ? (
        <div className="relative h-3 text-micro uppercase tracking-wider text-subtle">
          <span className="absolute -translate-x-1/2" style={{ left: `${markPct}%` }}>
            {markLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
