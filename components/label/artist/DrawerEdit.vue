<script setup lang="ts">
import { ref } from 'vue';
import ArtistService from '~/services/label/ArtistService';
import { useArtistStore } from '~/stores/label/artists';
import { useAuthStore } from '~/stores/user/auth';
import ShowToast from '~/utils/showToast';
import { UserRole } from '~/constants/roles';
import { useClipboard } from '@vueuse/core';

const visible = defineModel<boolean>('visible');
const modalVisible = ref(false);

const artistStore = useArtistStore();
const authStore = useAuthStore();
const { currentArtist } = storeToRefs(artistStore);
const { user } = storeToRefs(authStore);

const { copy, copied } = useClipboard();

const isRoot = user.value.role === UserRole.ROOT;

const closeModal = () => {
  modalVisible.value = false;
};

const copyToClipboard = async () => {
  try {
    await copy(currentArtist.value?.contact || '');
  } catch (e) {
    console.log(e);
  }
};

const onManagerSelect = async (managerId: string) => {
  const artistId = currentArtist.value?.id as string;
  try {
    closeModal();
    await ArtistService.linkManager(artistId, managerId);
    await artistStore.fetchAndUpdateArtist(artistId);
  } catch (e: any) {
    ShowToast.error({ detail: e.response.data.message });
  }
};
</script>

<template>
  <div>
    <Drawer
      v-model:visible="visible"
      position="right"
      class="!w-96 !text-ash-800"
      :pt="{ pcCloseButton: { root: '!outline-none' } }"
    >
      <template #header>
        <h6 class="font-head font-black text-2xl text-eph-500">
          {{ currentArtist?.stage_name }}
        </h6>
      </template>
      <div class="flex flex-col gap-4">
        <p class="font-black text-lg">
          {{ currentArtist?.surname }} {{ currentArtist?.firstname }}
          {{ currentArtist?.patronymic }}
        </p>
        <div class="flex flex-col">
          <span class="text-ash-600">{{ $t('info.contact') }}</span>
          <div class="flex gap-2 items-center">
            <p class="font-semibold">
              {{ currentArtist?.contact }}
            </p>
            <Transition name="fast-fade" mode="out-in">
              <Button
                v-if="!copied"
                key="copy"
                @click="copyToClipboard"
                class="text-ash-500 hover:text-ash-800 duration-300"
                unstyled
                v-tooltip="$t('placeholders.copyToClipboard')"
              >
                <UiuxIconCopyToClipboard />
              </Button>
              <Button
                v-else
                key="copied"
                class="text-ash-500 hover:text-ash-800 duration-300"
                unstyled
                v-tooltip="$t('placeholders.copiedToClipboard')"
              >
                <UiuxIconCopiedToClipboard />
              </Button>
            </Transition>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-ash-600">{{ $t('artists.managerOfArtist') }}</span>
          <div v-if="!currentArtist?.manager.surname">
            <UiuxSeverityButton @click="modalVisible = true">{{
              $t('buttons.choose')
            }}</UiuxSeverityButton>
          </div>
          <div v-else class="flex gap-2 items-center">
            <p class="font-semibold">
              {{ currentArtist?.manager.surname }}
              {{ currentArtist?.manager.firstname }}
              {{ currentArtist?.manager.patronymic }}
            </p>
            <Button
              v-if="isRoot"
              v-tooltip.bottom="$t('artists.editManager')"
              @click="modalVisible = true"
              class="text-ash-500 hover:text-ash-800 duration-300"
              unstyled
            >
              <UiuxIconPencilSquare />
            </Button>
          </div>
        </div>
      </div>
      <template #footer>
        <NuxtLink :to="`/artists/${currentArtist.id}`">
          <UiuxGradientButton stretch>
            {{ $t('artists.goToReleases') }}
          </UiuxGradientButton>
        </NuxtLink>
      </template>
    </Drawer>

    <Dialog
      modal
      :draggable="false"
      :visible="modalVisible"
      :pt="{
        pcCloseButton: { root: '!outline-none' },
        mask: 'backdrop-blur-xs',
      }"
      @update:visible="closeModal"
    >
      <template #header>
        <h5 class="font-black text-lg text-ash-800">
          {{ $t('artists.chooseManager') }}
        </h5>
      </template>
      <template #default>
        <LabelManagersOption @select="onManagerSelect" />
      </template>
    </Dialog>
  </div>
</template>
