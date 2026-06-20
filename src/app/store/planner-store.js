import { create } from "zustand";

const defaultPlan = {
  gajiUtama: 0,
  pendapatanTambahan: 0,
  bonus: 0,
  pendapatanLainnya: 0,
};

export const usePlannerStore = create((set) => ({
  monthlyPlan: defaultPlan,
  planningItems: [],
  isLoading: false,
  isSaving: false,
  error: null,

  setMonthlyPlan: (monthlyPlan) => set({ monthlyPlan }),
  setPlanningItems: (planningItems) => set({ planningItems }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),
  reset: () => set({
    monthlyPlan: defaultPlan,
    planningItems: [],
    isLoading: false,
    isSaving: false,
    error: null,
  }),
}));
