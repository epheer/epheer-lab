import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isLoading: false,
  }),
  getters: {
    getIsLoading: (state) => state.isLoading,
  },
  actions: {
    toggleLoading() {
      this.isLoading = !this.isLoading;
    },
  },
});
