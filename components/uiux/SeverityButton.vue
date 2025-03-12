<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit" | "reset";
  fluid?: boolean;
}>();
</script>

<template>
  <Button
    :type="props.type || 'button'"
    :fluid="props.fluid ? true : undefined"
    ripple
    unstyled
    class="rounded-lg px-4 py-2 mt-2 bg-ash-200 text-ash-700 transition duration-300 hover:bg-ash-300"
  >
    <slot></slot>
  </Button>
</template>
