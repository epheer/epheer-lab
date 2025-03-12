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
  const authStore = useAuthStore();

  appStore.startLoading();

  if (localStorage.getItem("token")) {
    await authStore.checkAuth();
  }

  if (!authStore.isAuth) {
    appStore.stopLoading();
    return navigateTo("/login");
  }

  if (!infoStore.isFetched) {
    const id = authStore.user.id;
    await infoStore.fetchUserInfo(id);
  }

  appStore.stopLoading();
});
