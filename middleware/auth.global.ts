import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/user/auth";
import { useAppStore } from "~/stores/app";
import { useInfoStore } from "~/stores/user/info";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const excludedRoutes = ['/login'];
  if (excludedRoutes.includes(to.path)) return;

  const appStore = useAppStore();
  const infoStore = useInfoStore();
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await authStore.checkAuth();
    }

    if (!authStore.isAuth) {
      return navigateTo('/login');
    }

    if (!infoStore.isFetched && authStore.user?.id) {
      appStore.startLoading();
      await infoStore.fetchUserInfo(authStore.user.id);
    }
  } catch (error) {
    return navigateTo('/login');
  } finally {
    appStore.stopLoading();
  }
});