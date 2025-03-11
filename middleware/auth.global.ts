import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/user/auth";
import { useAppStore } from "~/stores/app";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return;
  }

  const excludedRoutes = ["/login"];
  if (excludedRoutes.includes(to.path)) {
    return;
  }

  const appStore = useAppStore();
  appStore.toggleLoading();

  const authStore = useAuthStore();
  if (localStorage.getItem("token")) {
    await authStore.checkAuth();
  }
  if (!authStore.getIsAuth) {
    appStore.toggleLoading();
    return navigateTo("/login");
  }
  appStore.toggleLoading();
});
