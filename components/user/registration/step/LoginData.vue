<script setup lang="ts">
defineProps<{
  login: string;
  password: string;
}>();

const emit = defineEmits<{ (e: "next-step"): void }>();

const localLogin = defineModel<string>("login", { required: true });
const localPassword = defineModel<string>("password", { required: true });
</script>

<template>
  <div class="flex flex-col lg:h-48">
    <div
      class="bg-ash-50 border-1 border-solid border-ash-200 rounded-2xl shadow-xl p-6 sm:p-4 lg:p-2 flex-auto flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center items-center sm:gap-4 md:gap-0 lg:gap-4 font-medium"
    >
      <div class="sm:max-w-3/5 sm:order-last md:order-1 lg:order-last">
        <p class="font-light text-ash-700">
          <b>{{ $t("login.username") }}</b> {{ $t("registration.loginPattern")
          }}<br />
          <b>{{ $t("login.password") }}</b>
          {{ $t("registration.passwordPattern") }}
        </p>
      </div>
      <div class="hidden lg:inline-flex h-full order-2">
        <Divider layout="vertical" />
      </div>
      <div
        class="flex flex-col gap-2 max-w-sm mx-auto mt-3 sm:order-1 md:order-last lg:order-1"
      >
        <FloatLabel variant="on">
          <InputText
            v-model="localLogin"
            type="text"
            autocomplete="off"
            fluid
            required
          />
          <label for="on_label">{{ $t("login.username") }}</label>
        </FloatLabel>
        <UiuxInputNewPassword
          :password="localPassword"
          @update:password="localPassword = $event"
          >{{ $t("login.password") }}</UiuxInputNewPassword
        >
      </div>
    </div>
  </div>
  <div class="flex pt-6 justify-end items-center gap-4">
    <UiuxGradientButton @click="emit('next-step')" class="shrink-0">{{
      $t("buttons.next")
    }}</UiuxGradientButton>
  </div>
</template>
