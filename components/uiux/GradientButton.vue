<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit";
  fluid?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <Button
    :type="props.type || 'button'"
    :fluid="props.fluid ? true : undefined"
    :disabled="props.disabled ? true : undefined"
    ripple
    unstyled
    class="rounded-lg px-4 py-2 mt-2 bg-gradient-to-r from-eph-600 via-eph-500 to-eph-700 text-ash-50 transition duration-300 hover:from-eph-700 hover:via-eph-600 hover:to-eph-700"
    :class="{
      'grayscale !cursor-not-allowed': props.disabled,
    }"
  >
    <slot></slot>
  </Button>
</template>
