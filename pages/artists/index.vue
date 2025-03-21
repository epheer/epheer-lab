<script setup lang="ts">
definePageMeta({
  middleware: 'access',
  requiredRole: 'manager',
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t('title.artists') }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t('artists.title') }}
      </h1>

      <LabelArtistList />
    </section>
  </div>
</template>
