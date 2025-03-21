<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';
import { useI18n } from '#imports';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const showBackButton = ref(false);
const loginRef = ref<string>('');

const userId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const goBack = () => {
  if (showBackButton.value) {
    router.back();
  }
};

onMounted(() => {
  if (import.meta.server) {
    return;
  }
  showBackButton.value = window.history.length > 1;
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ loginRef }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <div class="flex gap-2 items-center">
        <Button
          v-if="showBackButton"
          unstyled
          ripple
          @click="goBack"
          class="text-ash-500 hover:text-ash-800 duration-300 p-2 rounded-full"
        >
          <UiuxIconArrowBack />
        </Button>
        <h1 class="font-head font-medium text-xl">
          {{ $t('title.users.edit') }}
          <span class="text-eph-500">{{ loginRef }}</span>
        </h1>
      </div>
      <div class="bg-ash-50 rounded-2xl shadow-e p-6 mt-2">
        <UserEditInfoForm :user-id="userId" v-model:login="loginRef" />
      </div>
    </section>
  </div>
</template>
