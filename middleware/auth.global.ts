import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/user/auth";
import { useAppStore } from "~/stores/app";
import { useInfoStore } from "~/stores/user/info";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return;
  }

  const excludedRoutes = ["/login"];
  if (excludedRoutes.includes(to.path)) {
    return;
  }

  const appStore = useAppStore();
  const infoStore = useInfoStore();
  appStore.toggleLoading();

  const authStore = useAuthStore();
  if (localStorage.getItem("token")) {
    await authStore.checkAuth();
  }

  if (!authStore.getIsAuth) {
    appStore.toggleLoading();
    return navigateTo("/login");
  }

  if (!infoStore.getIsFetched) {
    const id = authStore.getUser.id;
    await infoStore.fetchUserInfo(id);
  }

  appStore.toggleLoading();
});
