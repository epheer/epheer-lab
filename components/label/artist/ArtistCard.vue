<script setup lang="ts">
import { ref } from 'vue';
import { useArtistStore } from '~/stores/label/artists';
import type { IArtist } from '~/types/label/IArtist';

const props = defineProps<{ artist: IArtist }>();
const drawerVisible = ref(false);

const artistStore = useArtistStore();

const openDrawer = async (artistId: string) => {
  await artistStore.fetchAndUpdateArtist(artistId);
  drawerVisible.value = true;
};
</script>

<template>
  <div>
    <Card
      @click="openDrawer(artist.id)"
      class="inline-flex justify-center items-center w-36 md:w-48 hover:cursor-pointer"
      :pt="{ root: '!shadow-none' }"
    >
      <template #title>
        <OverlayBadge
          v-if="!props.artist.manager"
          v-tooltip="$t('artists.needLinkManager')"
          size="small"
          severity="danger"
        />
        <Avatar
          unstyled
          class="w-24 h-24 md:w-36 md:h-36 rounded-full bg-ash-200/70 outline-1 text-ash-600 hover:text-ash-800 outline-offset-4 outline-ash-400 duration-300"
        >
          <UiuxIconMusicNote class="w-full h-full" />
        </Avatar>
      </template>
      <template #content>
        <h6
          class="w-full text-center font-bold mt-2 text-ash-700 hover:text-ash-800 duration-300"
        >
          {{ props.artist.stage_name }}
        </h6>
      </template>
    </Card>
    <LabelArtistDrawerEdit
      :visible="drawerVisible"
      @update:visible="drawerVisible = $event"
    />
  </div>
</template>
