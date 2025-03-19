<script setup lang="ts">
import { passwordComplexity } from '~/constants/regex';

const props = defineProps<{ password: string; width?: number }>();

const password = defineModel<string>('password', { required: true });
</script>

<template>
  <FloatLabel variant="on" :class="`!w-${props.width || 'full'}`">
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
        overlay: `!w-${props.width || 'full'}`,
        pcInputText: { root: `!w-${props.width || 'full'}` },
      }"
    />
    <label>
      <slot />
    </label>
  </FloatLabel>
</template>
