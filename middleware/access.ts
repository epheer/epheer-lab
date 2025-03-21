import { navigateTo } from '#app';
import { useAuthStore } from '~/stores/user/auth';

export default defineNuxtRouteMiddleware(to => {
  if (import.meta.server) {
    return;
  }

  const authStore = useAuthStore();
  const requiredRole = to.meta.requiredRole as string;

  try {
    if (
      authStore.user.role !== requiredRole &&
      authStore.user.role !== 'root'
    ) {
      return navigateTo('/');
    }
  } catch (error) {
    return navigateTo('/');
  }
});
