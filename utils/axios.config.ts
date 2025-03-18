import axios from "axios";
import { type AuthResponse } from "~/types/user/AuthResponse";

const api = axios.create({
  baseURL: "https://api.epheer.ru/v1/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

function shouldHandleAuthError(error: any): boolean {
  return (
    error.response?.status === 401 &&
    error.config &&
    !error.config._isRetry
  );
}

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (shouldHandleAuthError(error)) {
      originalRequest._isRetry = true;

      try {
        const response = await axios.get<AuthResponse>(
          `https://api.epheer.ru/v1/auth/refresh`, { withCredentials: true },
        );

        localStorage.setItem('token', response.data.accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log('Аутентификация не пройдена');
      }
    }

    throw error;
  }
);

export { api };