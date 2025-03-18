<script setup lang="ts">
import { UiuxSeverityButton } from "#components";
import { UserRole, type IFullRole } from "~/constants/roles";

defineProps<{
  role: string;
  rolesList: IFullRole[];
}>();

const emit = defineEmits<{ (e: "next-step"): void; (e: "prev-step"): void }>();

const localRole = defineModel<UserRole>("role", {
  required: true,
});
</script>

<template>
  <div class="flex flex-col lg:h-48">
    <div
      class="bg-ash-50 rounded-2xl shadow-e py-4 px-2 sm:p-4 lg:p-2 flex-auto flex flex-col justify-center items-center gap-2 font-medium text-center"
    >
      <div class="flex justify-center items-center mb-2">
        <span class="font-light text-ash-700">{{
          $t("registration.chooseRole")
        }}</span>
      </div>
      <div class="hidden sm:block">
        <SelectButton
          v-model="localRole"
          :options="rolesList"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          size="large"
        />
      </div>
      <div class="block sm:hidden">
        <SelectButton
          v-model="localRole"
          :options="rolesList"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          size="small"
        />
      </div>
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
