<script setup lang="ts">
import { onMounted, reactive, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useReleaseStore } from '~/stores/label/release';
import MediaService from '~/services/upload/MediaService';
import ShowToast from '~/utils/showToast';
import { ReleaseType, type ReleaseTypeItem } from '~/constants/release';
import { useToast } from 'primevue/usetoast';
import { useI18n } from '#imports';

const releaseStore = useReleaseStore();
const { id, artist, name, feat, date, type, cover, authors } =
  storeToRefs(releaseStore);

const releaseTypeList: ReleaseTypeItem[] = [
  { label: 'сингл', value: ReleaseType.SINGLE },
  { label: 'EP', value: ReleaseType.EP },
  { label: 'альбом', value: ReleaseType.ALBUM },
];

const coverState = reactive({
  file: null as File | null,
  src: null as string | null,
});

const { t } = useI18n();

ShowToast.initialize(useToast());

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const uploadCover = async (file: File): Promise<void> => {
  try {
    await MediaService.uploadCover(artist.value.userId, id.value, file);
  } catch (e) {
    ShowToast.error({ detail: e.message });
  }
};

const onCoverClear = async (): Promise<void> => {
  try {
    await MediaService.deleteFile(artist.value.userId, id.value, 'cover');
    coverState.file = null;
    coverState.src = null;
  } catch (e: any) {
    ShowToast.error({ detail: t('releases.errors.coverDeleteError') });
  }
};

const fetchCover = async (): Promise<void> => {
  try {
    const response = await MediaService.getCover(
      artist.value.userId,
      id.value,
      '1200'
    );
    const blob = new Blob([response.data], { type: 'image/jpeg' });
    coverState.src = URL.createObjectURL(blob);
  } catch (e) {
    ShowToast.error({ detail: t('releases.errors.coverError') });
  }
};

const onFileSelect = async (event: any): Promise<void> => {
  const file = event.files[0];
  if (!file) return;

  coverState.file = file;
  coverState.src = await readFileAsDataURL(file);
  await uploadCover(file);
};

const getNextFridayInTwoWeeks = (): Date => {
  const today = new Date();
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7) + 14);
  return nextFriday;
};

const updateRelease = async (): Promise<void> => {
  try {
    await releaseStore.updateRelease({
      ...releaseStore.$state,
      date: date.value,
    });
    emit('next-step');
  } catch (e) {
    ShowToast.error({ detail: e.response.data.message });
  }
};

const emit = defineEmits<{
  (e: 'next-step'): void;
}>();

onMounted(async () => {
  watchEffect(async () => {
    if (artist.value && id.value) {
      await fetchCover();

      if (!date.value) {
        date.value = getNextFridayInTwoWeeks();
      } else if (typeof date.value === 'string') {
        date.value = new Date(date.value);
      }
    }
  });
});
</script>

<template>
  <div>
    <div
      class="bg-ash-50 rounded-2xl shadow-e p-4 sm:p-4 md:p-6 flex-auto flex flex-col sm:flex-row md:flex-col lg:flex-row justify-evenly gap-2 font-medium"
    >
      <div class="flex flex-col">
        <FileUpload
          @select="onFileSelect"
          @clear="onCoverClear"
          accept="image/jpeg"
          :pt="{
            root: '!bg-transparent !border-0',
            content: '!p-0',
            header: '!p-0 !flex !flex-col !gap-2',
          }"
          :maxFileSize="10 * 1024 * 1024"
          customUpload
          auto
        >
          <template #header="{ chooseCallback, clearCallback }">
            <div
              class="w-62 h-62 md:w-72 md:h-72 rounded-md md:rounded-2xl shadow-e border-1 border-ash-200 flex justify-center items-center"
            >
              <img
                v-if="coverState.src"
                :src="coverState.src"
                :alt="$t('releases.cover')"
                class="rounded-2xl w-full h-full"
              />
              <Button
                @click="chooseCallback()"
                v-if="!coverState.src"
                ripple
                unstyled
                class="rounded-2xl sm:p-27 md:p-33 flex items-center justify-center text-ash-500 hover:text-ash-800 duration-500"
              >
                <UiuxIconArrowUpload />
              </Button>
            </div>
            <div class="flex justify-between w-full items-center">
              <span class="font-light h-6">{{
                $t('releases.coverOfRelease')
              }}</span>
              <Button
                @click="clearCallback()"
                v-if="coverState.src"
                ripple
                unstyled
                class="rounded-full p-2 pr-0 flex items-center justify-center text-ash-500 hover:text-ash-800 duration-500"
              >
                <UiuxIconTrashBox />
              </Button>
            </div>
          </template>
        </FileUpload>
      </div>
      <div class="flex flex-col gap-2">
        <FloatLabel variant="on">
          <InputText
            v-model="name"
            type="text"
            autocomplete="off"
            fluid
            required
          />
          <label for="on_label">{{ $t('releases.nameOfRelease') }}</label>
        </FloatLabel>

        <SelectButton
          v-model="type"
          :options="releaseTypeList"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          :pt="{
            root: { class: '!w-full' },
            pcToggleButton: {
              root: { class: '!flex-grow !bg-ash-200/70 !border-0' },
            },
          }"
        />

        <FloatLabel variant="on">
          <DatePicker
            v-model="date"
            dateFormat="dd.mm.yy"
            showIcon
            fluid
            iconDisplay="input"
          />
          <label for="on_label">{{ $t('releases.dateOfRelease') }}</label>
        </FloatLabel>

        <UiuxInputList
          v-model:list="feat"
          :limit="3"
          :placeholder="$t('releases.artist')"
          :title="$t('releases.featuringArtists')"
        />
        <UiuxInputList
          v-model:list="authors.lyricists"
          :limit="5"
          :placeholder="$t('releases.author')"
          :title="$t('releases.lyricists')"
        />
        <UiuxInputList
          v-model:list="authors.producers"
          :limit="5"
          :placeholder="$t('releases.author')"
          :title="$t('releases.producers')"
        />
      </div>
      <div class="hidden xl:flex flex-col gap-2">
        <p class="font-light text-sm text-ash-700 max-w-80">
          {{ $t('releases.tipForReleaseDate') }}
        </p>
        <p class="font-light text-sm text-ash-700 max-w-80">
          {{ $t('releases.tipForFormatReleaseSingle') }} <br />
          {{ $t('releases.tipForFormatReleaseEP') }} <br />
          {{ $t('releases.tipForFormatReleaseAlbum') }}
        </p>
        <p class="font-light text-sm text-ash-700 max-w-80">
          {{ $t('releases.tipForLimitOfInputs') }}
        </p>
      </div>
    </div>
  </div>
  <div class="flex pt-6 justify-end items-center gap-4">
    <UiuxGradientButton @click="updateRelease" class="shrink-0">
      {{ $t('buttons.next') }}
    </UiuxGradientButton>
  </div>
</template>
