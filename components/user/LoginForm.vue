<script setup lang="ts">
import { navigateTo } from '#app';
import { useAuthStore } from '~/stores/user/auth';
import { useToast } from 'primevue/usetoast';
import { validateLoginData } from '~/utils/login.validator';
import ShowToast from '~/utils/showToast';

const username = defineModel<string>('username', { default: '' });
const password = defineModel<string>('password', { default: '' });

const toast = useToast();
ShowToast.initialize(toast);
const { t } = useI18n();

const authStore = useAuthStore();

const showError = (message: string): void => {
  ShowToast.error({
    summary: t('errors.login'),
    detail: message,
    group: 'br',
  });
};

const handleSubmit = async (): Promise<void> => {
  try {
    if (!validateLoginData(username.value, password.value)) {
      showError(t('errors.invalidData'));
      return;
    }
    await authStore.login(username.value, password.value);
    navigateTo('/');
  } catch (e: any) {
    showError(e.message || t('errors.default'));
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-2 mt-3">
      <FloatLabel variant="on">
        <InputText
          v-model="username"
          id="username"
          type="text"
          minlength="3"
          maxlength="30"
          fluid
          autofocus
          required
        />
        <label for="username">{{ $t('login.username') }}</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Password
          v-model="password"
          id="password"
          type="password"
          minlength="8"
          maxlength="96"
          :feedback="false"
          toggleMask
          fluid
          required
        />
        <label for="password">{{ $t('login.password') }}</label>
      </FloatLabel>
    </div>
    <UiuxGradientButton type="submit" stretch>
      {{ $t('login.entrance') }}
    </UiuxGradientButton>
  </form>
</template>
sW
