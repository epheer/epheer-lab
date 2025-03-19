<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/user/auth';
import { useInfoStore } from '~/stores/user/info';

const authStore = useAuthStore();
const infoStore = useInfoStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t('title.settings') }} / {{ $t('brand.lab') }}</Title>
    </Head>
    <section class="mx-6">
      <h1 class="font-head font-medium text-xl">
        {{ $t('title.settings') }}
      </h1>
      <div class="bg-ash-50 rounded-2xl shadow-e p-8 mt-2 flex flex-col gap-3">
        <UserEditInfoForm
          :user-id="user.id"
          @updated="infoStore.fetchUserInfo(user.id)"
        />
        <Divider />
        <UserChangePasswordForm :user-id="user.id" />
      </div>
    </section>
  </div>
</template>
