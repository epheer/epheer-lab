<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit" | "reset";
  stretch?: boolean;
  fluid?: boolean;
}>();
</script>

<template>
  <Button
    :type="props.type || 'button'"
    ripple
    unstyled
    class="rounded-lg px-4 py-2 mt-2 bg-transparent border-1 border-ash-200 text-ash-700 transition duration-300 hover:bg-ash-200"
    :class="{ 'w-full': props.stretch }"
  >
    <slot></slot>
  </Button>
</template>
