<script setup lang="ts">
import { useAppStore } from "~/stores/app";
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
const { isLoading } = storeToRefs(appStore);
</script>

<template>
  <div>
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="!isLoading" class="main-content">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </transition>

    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <Loading v-if="isLoading" />
    </transition>
  </div>
</template>