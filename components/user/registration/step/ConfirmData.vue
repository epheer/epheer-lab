<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  login: string;
  password: string;
  role: string;
  stageName: string;
  surname: string;
  firstname: string;
  patronymic: string;
  email: string;
  contact: string;
  isRegistered: boolean;
}>();

const sended = ref<boolean>(false);

const emit = defineEmits<{
  (e: "register"): void;
  (e: "prev-step"): void;
  (e: "clear-form"): void;
}>();
</script>

<template>
  <div class="flex flex-col lg:h-48">
    <div
      class="bg-eph-white rounded-2xl shadow-e p-6 sm:p-4 lg:px-8 flex-auto flex flex-col lg:flex-row justify-center items-center gap-2 font-medium text-center lg:text-left"
    >
      <div
        class="flex items-center justify-center w-full lg:w-2/5 order-last font-light text-ash-700"
      >
        <span v-if="!isRegistered">{{ $t("registration.checkData") }}</span>
        <span v-if="isRegistered">{{ $t("registration.sendData") }}</span>
      </div>
      <div class="hidden lg:inline-flex h-full">
        <Divider layout="vertical" />
      </div>
      <div
        class="flex flex-col lg:flex-row items-center justify-center lg:gap-12 lg:w-3/5 order-first text-center lg:text-left"
      >
        <div class="flex flex-col">
          <span
            ><strong>{{ $t("login.username") }}:</strong> {{ login }}</span
          >
          <span
            ><strong>{{ $t("login.password") }}:</strong> {{ password }}</span
          >
          <span
            ><strong>{{ $t("login.role") }}:</strong> {{ role }}</span
          >
          <span
            ><strong>{{ $t("info.email") }}:</strong> {{ email }}</span
          >
        </div>
        <div class="flex flex-col">
          <span v-if="role === 'artist'">
            <strong>{{ $t("info.stageName") }}:</strong> {{ stageName }}
          </span>
          <span
            ><strong>{{ $t("info.surname") }}:</strong> {{ surname }}</span
          >
          <span
            ><strong>{{ $t("info.firstname") }}:</strong> {{ firstname }}</span
          >
          <span
            ><strong>{{ $t("info.patronymic") }}:</strong>
            {{ patronymic }}</span
          >
          <span
            ><strong>{{ $t("info.contact") }}:</strong> {{ contact }}</span
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="!isRegistered" class="flex justify-between pt-6">
    <UiuxSeverityButton @click="emit('prev-step')" class="shrink-0">{{
      $t("buttons.back")
    }}</UiuxSeverityButton>
    <UiuxGradientButton @click="emit('register')" class="shrink-0">{{
      $t("registration.register")
    }}</UiuxGradientButton>
  </div>
  <div
    v-if="isRegistered"
    class="flex flex-col sm:flex-row gap-4 pt-6 sm:justify-between sm:items-center"
  >
    <div class="flex gap-4">
      <ToggleSwitch v-model="sended" />
      <span>{{ $t("registration.confirmSend") }}</span>
    </div>
    <UiuxGradientButton :disabled="!sended" @click="emit('clear-form')">{{
      $t("buttons.complete")
    }}</UiuxGradientButton>
  </div>
</template>
