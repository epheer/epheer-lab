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
        Требования к оформлению релиза вы можете найти в разделе
        <NuxtLink
          to="/guides"
          class="text-eph-500 font-semibold hover:underline underline-offset-4"
          >Инструкции</NuxtLink
        >
      </p>
      <LabelReleaseForm />
    </section>
  </div>
</template>
