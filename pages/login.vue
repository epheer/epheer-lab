<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t("title.login") }} / {{ $t("brand.lab") }}</Title>
    </Head>
    <div class="h-screen flex items-center">
      <Card class="mx-auto">
        <template #title>
          <BrandLogo class="h-10 w-auto mx-auto" />
        </template>
        <template #content>
          <UserLoginForm />
        </template>
      </Card>
    </div>

    <Toast position="bottom-right" group="br" />
  </div>
</template>
