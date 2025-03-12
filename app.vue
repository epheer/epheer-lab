<script setup lang="ts">
import { useAppStore } from "~/stores/app";

const appStore = useAppStore();
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <Loading v-if="appStore.isLoading" />
    </transition>
  </div>
</template>
