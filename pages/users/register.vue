<template>
  <div>
    <Head>
      <Title>{{ $t("title.users.register") }} / {{ $t("brand.lab") }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t("registration.title") }} {{ $t("brand.shortLab") }}
      </h1>
      <p class="text-ash-700">
        {{ $t("registration.description") }}
      </p>
      <UserRegistrationStepperForm />
    </section>
    <Toast position="bottom-right" group="br" />
  </div>
</template>
