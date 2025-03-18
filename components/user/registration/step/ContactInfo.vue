<script setup lang="ts">
defineProps<{
  stageName: string;
  surname: string;
  firstname: string;
  patronymic: string;
  email: string;
  contact: string;
  role: string;
}>();

const emit = defineEmits<{ (e: "next-step"): void; (e: "prev-step"): void }>();

const localStageName = defineModel<string>("stageName", {
  required: true,
});
const localSurname = defineModel<string>("surname", { required: true });
const localFirstname = defineModel<string>("firstname", { required: true });
const localPatronymic = defineModel<string>("patronymic", { required: true });
const localEmail = defineModel<string>("email", { required: true });
const localContact = defineModel<string>("contact", { required: true });
</script>

<template>
  <div class="flex flex-col lg:h-48">
    <div
      class="bg-ash-50 rounded-2xl shadow-e p-6 sm:p-4 lg:p-2 flex-auto flex flex-col justify-center items-center gap-2 font-medium text-center"
    >
      <div class="flex justify-center items-center">
        <span class="font-light text-ash-700">{{
          $t("registration.fillContactInfo")
        }}</span>
      </div>
      <form>
        <div
          class="flex flex-col lg:flex-row flex-wrap w-full gap-3 lg:gap-6 justify-center items-center mt-3"
        >
          <FloatLabel variant="on">
            <InputText
              v-model="localSurname"
              type="text"
              autocomplete="off"
              required
            />
            <label>{{ $t("info.surname") }}</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              v-model="localFirstname"
              type="text"
              autocomplete="off"
              required
            />
            <label>{{ $t("info.firstname") }}</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              v-model="localPatronymic"
              type="text"
              autocomplete="off"
            />
            <label>{{ $t("info.patronymic") }}</label>
          </FloatLabel>
          <FloatLabel v-if="role === 'artist'" variant="on">
            <InputText
              v-model="localStageName"
              type="text"
              autocomplete="off"
              required
            />
            <label>{{ $t("info.stageName") }}</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              v-model="localEmail"
              type="email"
              autocomplete="off"
              required
            />
            <label>{{ $t("info.email") }}</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              v-model="localContact"
              type="text"
              autocomplete="off"
              required
            />
            <label>{{ $t("info.contact") }}</label>
          </FloatLabel>
        </div>
      </form>
    </div>
  </div>
  <div class="flex pt-6 gap-4 justify-between text-center">
    <UiuxSeverityButton @click="emit('prev-step')" class="shrink-0">{{
      $t("buttons.back")
    }}</UiuxSeverityButton>
    <UiuxGradientButton @click="emit('next-step')" class="shrink-0">{{
      $t("buttons.next")
    }}</UiuxGradientButton>
  </div>
</template>
