import { formatSigned } from "@/lib/grundner";
import { useTerms } from "@/lib/store";
import { cn } from "@/lib/utils";

const TERMS = [
  { key: "i1" as const, label: "I₁", name: "RH, T", color: "bg-i1" },
  { key: "i2" as const, label: "I₂", name: "∂zRH", color: "bg-i2" },
  { key: "i3" as const, label: "I₃", name: "qc, qi", color: "bg-i3" },
];

function Bar({ value, className }: { value: number; className: string }) {
  const mag = Math.min(1, Math.abs(value) / 1.2);
  const widthPct = (mag * 50).toFixed(2);
  const isNeg = value < 0;
  return (
    <div className="relative h-1.5 w-full rounded-full bg-surface-2">
      <span
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-muted/50"
        style={{ left: "50%" }}
      />
      <span
        className={cn(
          "absolute top-0 h-full rounded-full transition-[width,left] duration-200 ease-out-smooth",
          className,
        )}
        style={
          isNeg
            ? { width: `${widthPct}%`, left: `calc(50% - ${widthPct}%)` }
            : { width: `${widthPct}%`, left: "50%" }
        }
      />
    </div>
  );
}

export function TermMeter() {
  const terms = useTerms();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xs font-medium uppercase tracking-caps text-muted">
          Terme
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted">
          f = {formatSigned(terms.f)}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {TERMS.map((term) => {
          const value = terms[term.key];
          return (
            <li key={term.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-sm text-fg">
                  {term.label}
                  <span className="ml-2 text-xs text-muted">{term.name}</span>
                </span>
                <span className="font-mono text-sm tabular-nums text-fg">
                  {formatSigned(value)}
                </span>
              </div>
              <Bar value={value} className={term.color} />
            </li>
          );
        })}
      </ul>
      {(terms.pc1Clipped || terms.pc2Applied || terms.pc3Applied) && (
        <ul className="flex flex-col gap-1 text-xs text-muted">
          {terms.pc2Applied && <li>PC2 · keine Kondensate → C = 0 %</li>}
          {terms.pc1Clipped && !terms.pc2Applied && (
            <li>
              PC1 · f = {formatSigned(terms.f)} auf [{terms.cc === 0 ? "0" : "100"}] %
              begrenzt
            </li>
          )}
          {terms.pc3Applied && <li>PC3 · RH-Untergrenze aktiv (Gl. 11)</li>}
        </ul>
      )}
    </div>
  );
}
