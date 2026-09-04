import { useEffect, useRef } from "react";
import { useCloud, useTerms } from "@/lib/store";

type Puff = { ox: number; oy: number; s: number; a: number };

type Cloud = {
  x: number;
  yNorm: number;
  vx: number;
  layer: 0 | 1 | 2;
  ice: boolean;
  puffs: Puff[];
  seed: number;
};

type Mote = {
  x: number;
  y: number;
  z: number;
  vx: number;
  seed: number;
  ice: boolean;
};

function makeSprite(size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, "rgba(255,255,255,0.78)");
  grd.addColorStop(0.22, "rgba(236,244,250,0.42)");
  grd.addColorStop(0.58, "rgba(220,230,238,0.14)");
  grd.addColorStop(1, "rgba(220,230,238,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

function makeIceSprite(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  grd.addColorStop(0, "rgba(236,244,255,0.55)");
  grd.addColorStop(0.45, "rgba(210,224,240,0.16)");
  grd.addColorStop(1, "rgba(210,224,240,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, w, h);
  return c;
}

function makeClouds(count: number, w: number): Cloud[] {
  const clouds: Cloud[] = [];
  const cols = 12;
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ice = row === 0;
    const layer: 0 | 1 | 2 = ice ? 0 : row >= rows - 2 ? 2 : 1;
    const puffs: Puff[] = [];
    const n = 7 + (i % 6);
    for (let k = 0; k < n; k++) {
      puffs.push({
        ox: (Math.random() - 0.5) * 1.8,
        oy: (Math.random() - 0.5) * 0.55,
        s: 0.5 + Math.random() * 1.05,
        a: 0.32 + Math.random() * 0.5,
      });
    }
    clouds.push({
      x: ((col + 0.5) / cols) * w + (Math.random() - 0.5) * (w / cols) * 0.6,
      yNorm: (row + 0.5) / rows,
      vx: 6 + (i % 5) * 2.5 + layer * 2,
      layer,
      ice,
      puffs,
      seed: (i * 1.618) % (Math.PI * 2),
    });
  }
  return clouds;
}

function makeMotes(count: number): Mote[] {
  const motes: Mote[] = [];
  for (let i = 0; i < count; i++) {
    motes.push({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75,
      vx: 0.008 + Math.random() * 0.03,
      seed: Math.random() * Math.PI * 2,
      ice: i % 5 === 0,
    });
  }
  return motes;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255,
    ag = (pa >> 8) & 255,
    ab = pa & 255;
  const br = (pb >> 16) & 255,
    bg = (pb >> 8) & 255,
    bb = pb & 255;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bl = Math.round(lerp(ab, bb, t));
  return `rgb(${r},${g},${bl})`;
}

export function CloudCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cc = useTerms().cc;
  const { t, dzRh, qc, qi } = useCloud();
  const live = useRef({ cc, t, dzRh, qc, qi });
  live.current = { cc, t, dzRh, qc, qi };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = makeSprite(160);
    const iceSprite = makeIceSprite(180, 70);
    let clouds: Cloud[] = [];
    const motes = makeMotes(520);
    let raf = 0;
    let last = performance.now();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (clouds.length === 0 && w > 0) clouds = makeClouds(90, w);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const L = live.current;
      const cover = L.cc / 100;
      const iceShare = L.qc + L.qi > 0 ? L.qi / (L.qc + L.qi + 1e-6) : 0;
      const cold = Math.max(0, Math.min(1, (270 - L.t) / 70));
      const inversion = Math.max(0, Math.min(1, (-L.dzRh - 0.4) / 2.4));

      const zenithClear = cold > 0.45 ? "#071018" : "#101820";
      const zenithOver = mixHex("#6a7682", "#8b97a2", iceShare * 0.35);
      const horizonClear = cold > 0.45 ? "#1a2a3c" : "#243040";
      const horizonOver = mixHex("#c5d0da", "#dce3ea", 0.5);

      const zenith = mixHex(zenithClear, zenithOver, Math.pow(cover, 0.65));
      const horizon = mixHex(horizonClear, horizonOver, Math.pow(cover, 0.55));

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, zenith);
      sky.addColorStop(0.52, mixHex(zenith, horizon, 0.5));
      sky.addColorStop(1, horizon);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const sunY = lerp(h * 0.22, h * 0.18, cold);
      const sunX = w * 0.78;
      const sunR = Math.min(w, h) * 0.1;
      const sunA = 0.66 * (1 - cover * 0.94);
      if (sunA > 0.03) {
        const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 4.2);
        sun.addColorStop(0, `rgba(255,246,230,${sunA})`);
        sun.addColorStop(0.16, `rgba(255,232,200,${sunA * 0.4})`);
        sun.addColorStop(1, "rgba(255,232,200,0)");
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,250,240,${Math.min(1, sunA + 0.15)})`;
        ctx.arc(sunX, sunY, sunR * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      const starA = Math.pow(1 - cover, 2.2) * (0.35 + cold * 0.55);
      if (starA > 0.02) {
        ctx.fillStyle = `rgba(232,238,245,${starA})`;
        for (let i = 0; i < 70; i++) {
          const sx = ((i * 137.5) % 1000) / 1000;
          const sy = ((i * 89.3) % 700) / 1000;
          ctx.beginPath();
          ctx.arc(sx * w, sy * h * 0.55, i % 5 === 0 ? 1.2 : 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const visible = Math.round(cover * 88);
      const baseAlpha = 0.16 + cover * 0.74;
      const span = w + 280;
      const preferIce = iceShare > 0.55;

      for (let i = 0; i < clouds.length; i++) {
        if (i >= visible) continue;
        const c = clouds[i]!;
        if (preferIce && !c.ice) continue;
        if (!preferIce && c.ice && iceShare < 0.12) continue;
        if (!reduce) {
          c.x += c.vx * dt * (0.28 + cover * 0.5);
          if (c.x > w + 140) c.x -= span;
        }

        let yNorm: number;
        if (c.ice) {
          yNorm = 0.1 + (Math.sin(c.seed) * 0.5 + 0.5) * 0.22;
        } else if (c.layer === 2) {
          const deck = lerp(0.58, 0.48, inversion);
          yNorm = deck + Math.sin(c.seed * 1.7) * (0.12 - inversion * 0.08);
        } else {
          yNorm = 0.34 + Math.sin(c.seed * 0.9) * 0.14;
        }
        const y = yNorm * h;
        const widthScale = c.ice ? 2.1 : lerp(1.35, 1.9, inversion);
        const heightScale = c.ice ? 0.28 : lerp(0.62, 0.34, inversion);
        const size = Math.max(w, h) * (c.ice ? 0.14 : 0.22) * (0.75 + cover * 0.55);
        const spr = c.ice ? iceSprite : sprite;

        for (const p of c.puffs) {
          const pw = size * p.s * widthScale;
          const ph = size * p.s * heightScale;
          ctx.globalAlpha = Math.min(0.92, baseAlpha * p.a * (c.ice ? 0.7 : 1));
          ctx.drawImage(spr, c.x + p.ox * size - pw / 2, y + p.oy * size - ph / 2, pw, ph);
        }
      }

      const moteCount = Math.floor(Math.pow(cover, 0.72) * motes.length);
      const moteSize = Math.min(w, h) * 0.045;
      for (let i = 0; i < moteCount; i++) {
        const m = motes[i]!;
        if (!reduce) {
          m.x += m.vx * dt * (0.35 + cover);
          if (m.x > 1.08) m.x -= 1.16;
          m.y += Math.sin(now * 0.00035 + m.seed) * 0.0008;
        }
        const px = m.x * w;
        const py = m.y * h;
        const s = moteSize * m.z * (0.55 + cover * 0.9);
        const icy = m.ice && iceShare > 0.25;
        ctx.globalAlpha = Math.min(0.55, (0.12 + cover * 0.4) * m.z);
        ctx.drawImage(
          icy ? iceSprite : sprite,
          px - s * (icy ? 1.6 : 1),
          py - s * (icy ? 0.35 : 1),
          s * (icy ? 3.2 : 2),
          s * (icy ? 0.7 : 2),
        );
      }
      ctx.globalAlpha = 1;

      if (cover > 0.08) {
        const veil = ctx.createLinearGradient(0, 0, 0, h);
        const v = Math.pow(cover, 0.85);
        veil.addColorStop(0, `rgba(186,198,210,${0.04 + v * 0.22})`);
        veil.addColorStop(0.45, `rgba(210,220,230,${0.05 + v * 0.28})`);
        veil.addColorStop(1, `rgba(224,232,238,${0.06 + v * 0.2})`);
        ctx.fillStyle = veil;
        ctx.fillRect(0, 0, w, h);
      }

      const sea = ctx.createLinearGradient(0, h * 0.82, 0, h);
      sea.addColorStop(0, "rgba(8,14,22,0)");
      sea.addColorStop(1, `rgba(8,14,22,${0.18 + cover * 0.12})`);
      ctx.fillStyle = sea;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full"
      aria-hidden="true"
    />
  );
}
