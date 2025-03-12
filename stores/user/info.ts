import { defineStore } from "pinia";
import InfoService from "~/services/user/InfoService";
import { type IInfo } from "~/types/user/IInfo";

interface IInfoStore {
  userInfo: IInfo;
  isFetched: boolean;
}

export const useInfoStore = defineStore("info", {
  state: (): IInfoStore => ({
    userInfo: {} as IInfo,
    isFetched: false,
  }),
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
