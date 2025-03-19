import { api } from '~/utils/axios.config';
import { type AxiosResponse } from 'axios';
import { type AuthResponse } from '~/types/user/AuthResponse';

export default class AuthService {
  static async login(
    login: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await api.post<AuthResponse>('/auth/login', { login, password });
  }

  static async logout(): Promise<AxiosResponse> {
    return await api.post('/auth/logout');
  }

  static async block(userId: string): Promise<AxiosResponse> {
    return await api.post(`/auth/${userId}/deactivate`);
  }

  static async unblock(userId: string): Promise<AxiosResponse> {
    return await api.post(`/auth/${userId}/unblock`);
  }

  static async resetPassword(
    userId: string,
    newPassword: string
  ): Promise<AxiosResponse> {
    return await api.put(`/auth/${userId}/password`, {
      password: newPassword,
    });
  }

  static async changeEmail(
    userId: string,
    email: string
  ): Promise<AxiosResponse> {
    return await api.put(`/auth/${userId}/email`, {
      email,
    });
  }
}
