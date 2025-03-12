<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInfoStore } from "~/stores/user/info";

const infoStore = useInfoStore();
const { getUserInfo } = storeToRefs(infoStore);
</script>

<template>
  <header class="mx-auto py-2 text-ash-800">
    <div class="mx-auto px-8">
      <div class="flex h-16 items-center justify-end">
        <div class="flex items-center gap-4">
          <span class="font-bold">{{ getUserInfo.firstname }}</span>
          <UserProfileMenu />
        </div>
      </div>
    </div>
  </header>
</template>
