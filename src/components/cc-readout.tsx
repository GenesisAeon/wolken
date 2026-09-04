import { useEffect, useRef, useState } from "react";
import { formatDe } from "@/lib/format";
import { useTerms } from "@/lib/store";

export function CcReadout() {
  const { cc, pc2Applied } = useTerms();
  const [shown, setShown] = useState(cc);
  const current = useRef(cc);

  useEffect(() => {
    if (Math.abs(cc - current.current) > 8) {
      current.current = cc;
      setShown(cc);
      return;
    }
    let raf = 0;
    const tick = () => {
      const d = cc - current.current;
      if (Math.abs(d) < 0.04) {
        current.current = cc;
        setShown(cc);
        return;
      }
      current.current += d * 0.28;
      setShown(current.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cc]);

  const label = formatDe(shown, 1);
  const [whole, frac] = label.split(",");

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden bg-linear-to-t from-bg from-10% to-transparent p-5 pt-16 lg:p-8 lg:pt-24">
      <div className="max-w-full">
        <p className="text-2xs font-medium uppercase tracking-caps text-cloud/70">
          Wolkenbedeckung
        </p>
        <p
          className="mt-1 font-serif leading-none tracking-tight text-cloud"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-display tabular-nums">{whole}</span>
          <span className="text-display-frac tabular-nums text-cloud/80">,{frac}</span>
          <span className="ml-1 font-sans text-display-unit font-medium text-cloud/70">
            %
          </span>
        </p>
        {pc2Applied ? (
          <p className="mt-2 text-sm text-cloud/65">
            Kondensatfrei — physikalische Randbedingung PC2
          </p>
        ) : (
          <p className="mt-2 text-sm text-cloud/65">
            Diagnostische Schließung · nicht prognostisch
          </p>
        )}
      </div>
    </div>
  );
}
