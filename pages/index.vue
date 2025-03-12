<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInfoStore } from "~/stores/user/info";

const infoStore = useInfoStore();
const { userInfo } = storeToRefs(infoStore);
</script>

<template>
  <div>
    <Head>
      <Title>{{ $t("brand.lab") }}</Title>
    </Head>
    <div>
      <p>Привет, {{ userInfo.firstname }}!</p>
    </div>
  </div>
</template>
