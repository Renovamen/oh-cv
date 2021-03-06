import { defineStore } from "pinia";
import type { UIData } from "~/types";

export const useUIStore = defineStore("ui", () => {
  const ui = reactive<UIData>({
    previewScale: 1,
    previewBottom: 0,
    openToolbar: true
  });

  const setUI = <T extends keyof UIData>(key: T, value: UIData[T]) => {
    ui[key] = value;
  };

  return {
    ui,
    setUI
  };
});
