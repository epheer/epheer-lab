<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <BrandSmallLogo class="relative contrast-50 brightness-75 blur-xs" />
    <div
      class="absolute flex flex-col justify-center items-center bg-ash-900/50 backdrop-blur-2xl backdrop-saturate-180 rounded-3xl p-12 shadow-e"
    >
      <h1 class="font-head font-black text-eph-500 text-9xl">
        {{ error.statusCode }}
      </h1>
      <p class="text-ash-200">{{ error.statusMessage }}</p>
      <UiuxGradientButton>
        <NuxtLink to="/">{{ $t('errors.goToHome') }}</NuxtLink>
      </UiuxGradientButton>
    </div>
  </div>
</template>
