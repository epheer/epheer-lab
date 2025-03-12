import { defineStore } from "pinia";

interface IAppStore {
  isLoading: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): IAppStore => ({
    isLoading: false,
  }),
  actions: {
    startLoading() {
      this.isLoading = true;
    },
    stopLoading() {
      this.isLoading = false;
    },
  },
});
