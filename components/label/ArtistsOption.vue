<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import ShowToast from '~/utils/showToast';
import { useArtistStore } from '~/stores/label/artists';
import { useAuthStore } from '~/stores/user/auth';
import { UserRole } from '~/constants/roles';
import ReleaseService from '~/services/label/ReleaseService';
import type { IArtist } from '~/types/label/IArtist';

const artistStore = useArtistStore();
const authStore = useAuthStore();
const { artists, currentArtist, isFetched, pagination } =
  storeToRefs(artistStore);

const localCurrentArtist = ref<IArtist | null>(null);
const nextPage = ref(1);
const loading = ref(false);

ShowToast.initialize(useToast());

const createRelease = async () => {
  try {
    const artistId = currentArtist.value.id;
    const response = await ReleaseService.createRelease(artistId);
    navigateTo(`/releases/${response.data.id}/edit`);
  } catch (e: any) {
    ShowToast.error({ detail: e.response?.data?.message });
  }
};

const chooseFetchMethod = async () => {
  const role = authStore.user.role;

  try {
    switch (role) {
      case UserRole.ARTIST: {
        await artistStore.fetchAndUpdateArtist(authStore.user.id);
        await createRelease();
        break;
      }

      case UserRole.MANAGER: {
        await artistStore.fetchAllManagerArtists(authStore.user.id);
        break;
      }

      case UserRole.ROOT: {
        await artistStore.fetchAllArtists({
          page: 1,
          limit: 12,
        });
        break;
      }

      default: {
        console.error('Неизвестная роль пользователя:', role);
      }
    }
  } catch (e: any) {
    console.error('Ошибка при выборе метода загрузки данных:', e);
    ShowToast.error({ detail: e.message });
  }
};

const onSelect = artist => {
  localCurrentArtist.value = artist;
};

const onPageChange = (event: { page: number; rows: number }) => {
  nextPage.value = event.page + 1;
  fetchArtists(nextPage.value);
};

const fetchArtists = async (page?: number) => {
  loading.value = true;
  try {
    await artistStore.fetchAllArtists({ page, limit: 12 });
  } catch (e: any) {
    console.log(e.response.data.message);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await artistStore.fetchAndUpdateArtist(localCurrentArtist.value.id);
    await createRelease();
  } catch (e) {
    ShowToast.error({ detail: e.response?.data?.message });
  }
};

const artistIsCurrent = artist => {
  if (!localCurrentArtist.value) {
    return false;
  }
  return localCurrentArtist.value.id === artist.id;
};

onBeforeMount(async () => {
  await chooseFetchMethod();
});

onBeforeUnmount(() => {
  artistStore.currentArtist = null;
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
        <div
          v-for="artist in artists"
          :key="artist.id"
          @click="onSelect(artist)"
          class="hover:bg-ash-200/30 h-full w-full rounded-2xl duration-300 relative py-4"
          :class="artistIsCurrent(artist) ? 'bg-ash-200/30' : 'bg-none'"
        >
          <Transition name="fast-fade" mode="out-in">
            <UiuxIconVCheck
              v-if="artistIsCurrent(artist)"
              class="absolute top-1 left-1 w-7 h-7 text-e-green"
          /></Transition>
          <LabelArtistCard :artist="artist" withoutAction />
        </div>
      </div>
    </div>
    <Paginator
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
    <div class="w-full flex flex-row justify-end">
      <UiuxGradientButton
        @click="handleSubmit"
        :disabled="!localCurrentArtist"
        class="mt-4"
        >{{ $t('buttons.choose') }}</UiuxGradientButton
      >
    </div>
  </div>
</template>
