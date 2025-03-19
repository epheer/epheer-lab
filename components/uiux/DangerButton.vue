<script setup lang="ts">
const props = defineProps<{
  type?: 'button' | 'reset';
  stretch?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <Button
    :type="props.type || 'button'"
    :disabled="props.disabled ? true : undefined"
    ripple
    unstyled
    class="rounded-lg px-4 py-2 mt-2 transition duration-300 bg-e-red text-ash-100 hover:saturate-150"
    :class="{
      'grayscale !cursor-not-allowed': props.disabled,
      'w-full': props.stretch,
    }"
  >
    <slot></slot>
  </Button>
</template>
