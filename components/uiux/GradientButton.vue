<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit";
}>();
</script>

<template>
  <button
    :type="props.type || 'button'"
    class="w-full rounded-md p-2 mt-2 bg-gradient-to-r from-eph-600 via-eph-500 to-eph-700 text-ash-50 transition duration-300 hover:from-eph-700 hover:via-eph-600 hover:to-eph-700"
  >
    <slot></slot>
  </button>
</template>
