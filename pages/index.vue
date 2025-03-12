<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInfoStore } from "~/stores/user/info";

const infoStore = useInfoStore();
const { getUserInfo } = storeToRefs(infoStore);
</script>

<template>
  <Head>
    <Title>{{ $t("brand.lab") }}</Title>
  </Head>
  <div>
    <p>Привет, {{ getUserInfo.firstname }}!</p>
  </div>
</template>
