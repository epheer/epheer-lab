import { api } from "~/utils/axios.config";
import { type AxiosResponse } from "axios";
import { type AuthResponse } from "~/types/user/AuthResponse";

export default class AuthService {
  static async login(
    login: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await api.post<AuthResponse>("/auth/login", { login, password });
  }

  static async logout(): Promise<AxiosResponse> {
    return api.post("/auth/logout");
  }
}
