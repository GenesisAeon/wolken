import { create } from "zustand";
import { evaluateGrundner, type GrundnerInputs, type GrundnerTerms } from "./grundner";
import { DEFAULT_PRESET_ID, PRESETS } from "./presets";

export type CloudState = GrundnerInputs & {
  enforcePc3: boolean;
  presetId: string | null;
  setField: <K extends keyof GrundnerInputs>(key: K, value: GrundnerInputs[K]) => void;
  setEnforcePc3: (value: boolean) => void;
  applyPreset: (id: string) => void;
  randomize: () => void;
};

const initial = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID)!.values;

export const useCloud = create<CloudState>((set) => ({
  ...initial,
  enforcePc3: true,
  presetId: DEFAULT_PRESET_ID,
  setField: (key, value) =>
    set((s) => ({
      ...s,
      [key]: value,
      presetId: null,
    })),
  setEnforcePc3: (value) => set({ enforcePc3: value }),
  applyPreset: (id) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    set({ ...preset.values, presetId: id });
  },
  randomize: () =>
    set({
      rh: 0.25 + Math.random() * 0.7,
      t: 215 + Math.random() * 85,
      dzRh: -3.2 + Math.random() * 4.4,
      qc: Math.random() < 0.15 ? 0 : Math.random() * 28,
      qi: Math.random() < 0.45 ? 0 : Math.random() * 8,
      presetId: null,
    }),
}));

export function useTerms(): GrundnerTerms {
  const rh = useCloud((s) => s.rh);
  const t = useCloud((s) => s.t);
  const dzRh = useCloud((s) => s.dzRh);
  const qc = useCloud((s) => s.qc);
  const qi = useCloud((s) => s.qi);
  const enforcePc3 = useCloud((s) => s.enforcePc3);
  return evaluateGrundner({ rh, t, dzRh, qc, qi }, { enforcePc3 });
}
