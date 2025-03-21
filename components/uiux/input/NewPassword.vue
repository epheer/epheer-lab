<script setup lang="ts">
import { passwordComplexity } from '~/constants/regex';

const props = defineProps<{ password: string; width?: number }>();
const password = defineModel<string>('password', { required: true });

const getDynamicClass = () => {
  if (!props.width) {
    return 'w-auto';
  } else {
    return `w-${props.width}`;
  }
};
</script>

<template>
  <FloatLabel variant="on" :class="getDynamicClass()">
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
      :pt="{
        overlay: getDynamicClass(),
        pcInputText: { root: getDynamicClass() },
      }"
    />
    <label>
      <slot />
    </label>
  </FloatLabel>
</template>
