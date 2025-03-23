<script setup lang="ts">
import { ref } from 'vue';
import { ReleaseType } from '~/constants/release';
import ShowToast from '~/utils/showToast';
import { useToast } from 'primevue/usetoast';
import type { Authors } from '~/types/label/IRelease';

interface ReleaseTypeList {
  label: string;
  value: ReleaseType;
}

const emit = defineEmits<{ (e: 'next-step'): void }>();

const localName = defineModel<string | undefined>('name');
const localFeat = defineModel<string[] | undefined>('feat');
const localDate = defineModel<Date>('date', { required: true });
const localType = defineModel<ReleaseType>('type', { required: true });
const localCoverKey = defineModel<string | undefined>('coverKey');
const localAuthors = defineModel<Authors>('authors', { required: true });

const coverFile = ref<File | Blob | null>(null);
const coverSrc = ref<string | null>(null);

const releaseTypeList: ReleaseTypeList[] = [
  { label: 'сингл', value: ReleaseType.SINGLE },
  { label: 'EP', value: ReleaseType.EP },
  { label: 'альбом', value: ReleaseType.ALBUM },
];

ShowToast.initialize(useToast());

function onFileSelect(event: any): void {
  if (Array.isArray(event.files) && event.files.length > 0) {
    const file = event.files[0];
    if (file.size > 10 * 1024 * 1024) {
      ShowToast.error({
        detail: 'Размер файла превышает 10 МБ',
      });
      return;
    }
    coverFile.value = file;
    const reader = new FileReader();
    reader.onload = e => {
      coverSrc.value = e.target?.result as string;
    };
    reader.readAsDataURL(coverFile.value);
  }
}

function onFileClear(): void {
  coverFile.value = null;
  coverSrc.value = null;
}
</script>

<template>
  <div>
    <div
      class="bg-ash-50 rounded-2xl shadow-e p-4 sm:p-4 md:p-6 flex-auto flex flex-col sm:flex-row md:flex-col lg:flex-row justify-evenly gap-2 font-medium"
    >
      <div class="flex flex-col">
        <FileUpload
          @select="onFileSelect"
          @clear="onFileClear"
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
                v-if="coverSrc"
                :src="coverSrc"
                :alt="$t('releases.cover')"
                class="rounded-2xl w-full h-full"
              />
              <Button
                @click="chooseCallback()"
                v-if="!coverSrc"
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
                v-if="coverSrc"
                ripple
                unstyled
                class="rounded-full p-2 pr-0 flex items-center justify-center text-ash-500 hover:text-ash-800 duration-500"
                ><UiuxIconTrashBox />
              </Button>
            </div>
          </template>
        </FileUpload>
      </div>
      <div class="flex flex-col gap-2">
        <FloatLabel variant="on">
          <InputText
            v-model="localName"
            type="text"
            autocomplete="off"
            fluid
            required
          />
          <label for="on_label">{{ $t('releases.nameOfRelease') }}</label>
        </FloatLabel>

        <SelectButton
          v-model="localType"
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
            v-model="localDate"
            dateFormat="dd.mm.yy"
            showIcon
            fluid
            iconDisplay="input"
          />
          <label for="on_label">{{ $t('releases.dateOfRelease') }}</label>
        </FloatLabel>

        <UiuxInputList
          v-model:list="localFeat"
          :limit="3"
          :placeholder="$t('releases.artist')"
          :title="$t('releases.featuringArtists')"
        />
        <UiuxInputList
          v-model:list="localAuthors.lyricists"
          :limit="5"
          :placeholder="$t('releases.author')"
          :title="$t('releases.lyricists')"
        />
        <UiuxInputList
          v-model:list="localAuthors.producers"
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
    <UiuxGradientButton @click="$emit('next-step')" class="shrink-0">
      {{ $t('buttons.next') }}
    </UiuxGradientButton>
  </div>
</template>
