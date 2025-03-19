<script setup lang="ts">
definePageMeta({
  middleware: 'access',
  requiredRole: 'root',
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t('title.users.all') }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t('title.users.all') }} {{ $t('brand.shortLab') }}
      </h1>
      <div class="bg-ash-50 rounded-2xl shadow-e p-4 mt-2">
        <UserUsersList />
      </div>
    </section>
  </div>
</template>
