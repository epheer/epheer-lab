import { defineStore } from "pinia";
import InfoService from "~/services/user/InfoService";
import { type IInfo } from "~/types/user/IInfo";

export const useInfoStore = defineStore("info", {
  state: () => ({
    userInfo: {} as IInfo,
    isFetched: false,
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsFetched: (state) => state.isFetched,
  },
  actions: {
    async fetchUserInfo(id: string) {
      try {
        const response = await InfoService.getUserInfoById(id);
        this.userInfo = response;
        this.isFetched = true;
      } catch (e: any) {
        throw new Error(e.response?.data?.message);
      }
    },
  },
});
