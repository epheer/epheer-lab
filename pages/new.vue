<template>
  <div>
    <Head>
      <Title>{{ $t('title.releases.new') }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t('title.releases.new') }}
      </h1>
      <p class="text-ash-700">{{ $t('releases.new.chooseArtist') }}</p>
      <LabelArtistsOption />
    </section>
  </div>
</template>
