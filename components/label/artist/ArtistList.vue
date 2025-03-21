<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/user/auth';
import { useArtistStore } from '~/stores/label/artists';
import { UserRole } from '~/constants/roles';

const artistStore = useArtistStore();
const authStore = useAuthStore();
const { artists, isFetched, pagination } = storeToRefs(artistStore);
const { user } = authStore;

const nextPage = ref(1);

const isRoot = user.role === UserRole.ROOT;

const onPageChange = (event: { page: number; rows: number }) => {
  nextPage.value = event.page + 1;
  fetchArtists(nextPage.value);
};

const fetchArtists = async (page?: number) => {
  if (isRoot) {
    try {
      await artistStore.fetchAllArtists({ page, limit: 12 });
    } catch (e: any) {
      console.log(e.message);
    }
  } else {
    try {
      await artistStore.fetchAllManagerArtists(user.id);
    } catch (e: any) {
      console.log(e.message);
    }
  }
};

onMounted(() => {
  fetchArtists();
});
</script>

<template>
  <div>
    <p v-if="isFetched && !artists.length" class="text-ash-600">
      {{ $t('artists.emptyPool') }}
    </p>
    <div v-else-if="!isFetched">
      <div
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 justify-evenly justify-items-center flex-wrap"
      >
        <LabelArtistCardSkeleton v-for="i in 4" :key="i" />
        <LabelArtistCardSkeleton
          v-for="i in 2"
          :key="i"
          class="sm:hidden 2xl:block"
        />
      </div>
    </div>
    <div v-else class="bg-ash-50 rounded-2xl shadow-e p-4 mt-2">
      <div
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 justify-evenly justify-items-center flex-wrap"
      >
        <LabelArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
        />
      </div>
    </div>
    <Paginator
      v-if="isRoot"
      :pt="{
        root: '!mt-2 !-mx-6 !bg-transparent',
        content: 'gap-0',
      }"
      :first="(pagination?.currentPage - 1) * pagination?.limit"
      :rows="pagination?.limit"
      :totalRecords="pagination?.total"
      :alwaysShow="false"
      :pageLinkSize="3"
      @page="onPageChange"
    />
  </div>
</template>
