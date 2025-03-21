<script setup lang="ts">
import type { ArtistsList } from '~/types/label/IArtist';

const props = defineProps<{
  visible: boolean;
  artists: ArtistsList;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const closeDialog = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Dialog
    modal
    :draggable="false"
    :pt="{
      pcCloseButton: { root: '!outline-none' },
      mask: 'backdrop-blur-xs',
    }"
    v-model:visible="props.visible"
    @update:visible="closeDialog"
  >
    <template #header>
      <h2 class="font-head font-bold text-eph-500 text-2xl mr-2">
        {{ $t('artists.title') }}
      </h2>
    </template>

    <div
      v-if="props.artists.length > 0"
      class="flex flex-row justify-evenly justify-items-center flex-wrap"
    >
      <LabelArtistCard
        v-for="artist in props.artists"
        :key="artist.id"
        :artist="artist"
      />
    </div>
    <p v-else class="text-ash-600 text-center">
      {{ $t('managers.emptyPool') }}
    </p>
  </Dialog>
</template>
