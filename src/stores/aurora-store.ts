import { create } from "zustand";

type AuroraStore = {
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export const useAurora = create<AuroraStore>((set) => ({
  visible: false,

  show: () => set({ visible: true }),

  hide: () => set({ visible: false }),

  toggle: () =>
    set((state) => ({
      visible: !state.visible,
    })),
}));