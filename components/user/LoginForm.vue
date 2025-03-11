<script setup lang="ts">
import { useAuthStore } from "~/stores/user/auth";
import { useToast } from "primevue/usetoast";
import { loginPattern, passwordComplexity } from "~/constants/regex";

const username = defineModel<string>("username", { default: "" });
const password = defineModel<string>("password", { default: "" });

const toast = useToast();
const { t } = useI18n();

const authStore = useAuthStore();

const validateLoginData = (): boolean => {
  if (!loginPattern.test(username.value)) {
    showError(t("errors.invalidData"));
    return false;
  }

  if (!passwordComplexity.test(password.value)) {
    showError(t("errors.invalidData"));
    return false;
  }

  return true;
};

const showError = (message: string): void => {
  toast.add({
    severity: "error",
    summary: t("errors.login"),
    detail: message,
    life: 3000,
    group: "br",
  });
};

const handleSubmit = async (): Promise<void> => {
  try {
    if (!validateLoginData()) {
      return;
    }
    await authStore.login(username.value, password.value);
  } catch (e: any) {
    showError(e.message || t("errors.default"));
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-2 mt-3">
      <FloatLabel variant="on">
        <InputText
          v-model="username"
          type="text"
          minlength="3"
          maxlength="30"
          fluid
          autofocus
          required
        />
        <label for="on_label">{{ $t("login.username") }}</label>
      </FloatLabel>
      <FloatLabel variant="on" class="w-full">
        <Password
          v-model="password"
          type="password"
          minlength="8"
          maxlength="96"
          :feedback="false"
          toggleMask
          fluid
          required
        />
        <label for="on_label">{{ $t("login.password") }}</label>
      </FloatLabel>
    </div>
    <UiuxGradientButton type="submit">
      {{ $t("login.entrance") }}
    </UiuxGradientButton>
  </form>
</template>
