<script setup lang="ts">
import { passwordComplexity } from "~/constants/regex";

defineProps<{ password: string }>();

const password = defineModel<string>("password", { required: true });
</script>

<template>
  <FloatLabel variant="on" class="w-full">
    <Password
      v-model="password"
      type="password"
      autocomplete="off"
      promptLabel="Начните вводить"
      weakLabel="Слишком простой"
      mediumLabel="Ещё немного"
      strongLabel="Отлично"
      :strongRegex="passwordComplexity"
      required
      toggleMask
    />
    <label><slot /></label>
  </FloatLabel>
</template>
