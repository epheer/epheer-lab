import { defineStore } from "pinia";
import AuthService from "~/services/user/AuthService";
import { type AuthResponse } from "~/types/user/AuthResponse";
import { type IUser } from "~/types/user/IUser";
import { api } from "~/utils/axios.config";

interface IAuthStore {
  user: IUser;
  isAuth: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): IAuthStore => ({
    user: {} as IUser,
    isAuth: false,
  }),
  actions: {
    async login(login: string, password: string) {
      try {
        const response = await AuthService.login(login, password);
        localStorage.setItem("token", response.data.accessToken);
        this.user = response.data.user;
        this.isAuth = true;
      } catch (e: any) {
        throw new Error(e.response?.data?.message);
      }
    },

    async logout() {
      try {
        const response = await AuthService.logout();
        localStorage.removeItem("token");
        this.user = {} as IUser;
        this.isAuth = false;
      } catch (e: any) {
        throw new Error(e.response?.data?.message);
      }
    },

    async checkAuth() {
      try {
        const response = await api.get<AuthResponse>("/auth/refresh");
        localStorage.setItem("token", response.data.accessToken);
        this.user = response.data.user;
        this.isAuth = true;
      } catch (e: any) {
        throw new Error(e.response?.data?.message);
      }
    },
  },
});
