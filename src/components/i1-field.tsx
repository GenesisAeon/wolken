import { useEffect, useRef, type PointerEvent } from "react";
import { computeI1, COEFF } from "@/lib/grundner";
import { formatDe } from "@/lib/format";
import { RANGES } from "@/lib/presets";
import { useCloud } from "@/lib/store";

const T_MIN = RANGES.t.min;
const T_MAX = RANGES.t.max;

function colorFor(v: number): [number, number, number] {
  const t = 1 / (1 + Math.exp(-2.4 * (v - 0.35)));
  const r = Math.round(22 + t * 214);
  const g = Math.round(32 + t * 208);
  const b = Math.round(42 + t * 204);
  return [r, g, b];
}

function paintField(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w < 2 || h < 2) return;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = Math.max(48, Math.floor(w / 3));
  const rows = Math.max(36, Math.floor(h / 3));
  const img = ctx.createImageData(cols, rows);
  for (let y = 0; y < rows; y++) {
    const t = T_MAX - (y / (rows - 1)) * (T_MAX - T_MIN);
    for (let x = 0; x < cols; x++) {
      const rh = x / (cols - 1);
      const v = computeI1(rh, t);
      const [r, g, b] = colorFor(v);
      const i = (y * cols + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  const tmp = document.createElement("canvas");
  tmp.width = cols;
  tmp.height = rows;
  tmp.getContext("2d")!.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(tmp, 0, 0, w, h);
}

function posFromEvent(el: HTMLCanvasElement, e: { clientX: number; clientY: number }) {
  const rect = el.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
  return {
    rh: x,
    t: T_MAX - y * (T_MAX - T_MIN),
  };
}

export function I1Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const { rh, t, setField } = useCloud();
  const live = useRef({ rh, t });
  live.current = { rh, t };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => paintField(canvas);
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const { rh: crh, t: ct } = live.current;
      const mx = crh * w;
      const my = ((T_MAX - ct) / (T_MAX - T_MIN)) * h;
      const bx = COEFF.rhBar * w;
      const by = ((T_MAX - COEFF.tBar) / (T_MAX - T_MIN)) * h;

      ctx.strokeStyle = "rgba(231,238,245,0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(bx, 0);
      ctx.lineTo(bx, h);
      ctx.moveTo(0, by);
      ctx.lineTo(w, by);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#f4f7fa";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0b1118";
      ctx.stroke();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rh, t]);

  const onPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const el = overlayRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const next = posFromEvent(el, e);
    setField("rh", next.rh);
    setField("t", next.t);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xs font-medium uppercase tracking-caps text-muted">
          I<sub>1</sub>(RH, T)
        </h2>
        <span className="font-mono text-2xs tabular-nums text-muted">
          RH {formatDe(rh * 100, 1)} % · T {formatDe(t, 1)} K
        </span>
      </div>
      <div className="relative overflow-hidden rounded-md bg-surface-2 shadow-panel">
        <canvas ref={canvasRef} className="block h-36 w-full" aria-hidden="true" />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
          onPointerDown={onPointer}
          onPointerMove={onPointer}
          role="slider"
          aria-label="I1-Feld: RH und Temperatur setzen"
        />
      </div>
      <div className="flex justify-between text-micro uppercase tracking-wider text-subtle">
        <span>RH 0</span>
        <span>kalt oben · warm unten</span>
        <span>RH 1</span>
      </div>
    </div>
  );
}
