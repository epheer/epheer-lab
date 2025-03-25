<script setup lang="ts">
import { useRoute } from '#app';
import { useReleaseStore } from '~/stores/label/release';

const route = useRoute();
const releaseId = route.params.id as string;

const releaseStore = useReleaseStore();

const { error } = await useAsyncData(async () => {
  try {
    if (import.meta.server) {
      return;
    }
    await releaseStore.fetchRelease(releaseId);
  } catch (e) {
    throw createError({ statusCode: 404, statusMessage: 'Релиз не найден' });
  }
});

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Релиз не найден' });
}
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t('title.releases.edit') }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t('title.releases.edit') }}
      </h1>
      <p class="text-ash-700">
        {{ $t('releases.actualRequirements') }}
        <NuxtLink
          to="/guides"
          class="text-eph-500 font-semibold hover:underline underline-offset-4"
          >{{ $t('title.guides') }}</NuxtLink
        >
      </p>
      <LabelReleaseForm :release="releaseStore" />
    </section>
  </div>
</template>
