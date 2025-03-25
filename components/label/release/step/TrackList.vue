<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { usePlayerStore } from '~/stores/player.js';
import ShowToast from '~/utils/showToast';

const audioFile = ref(null);

const playerStore = usePlayerStore();
ShowToast.initialize(useToast());

const formatSize = bytes => {
  if (bytes < 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const onFileSelect = event => {
  const file = event.files[0];

  if (!file) return;

  if (file.size > 100 * 1024 * 1024) {
    ShowToast.error({ detail: 'Размер файла превышает 100 МБ' });
    return;
  }

  uploadFile(file);
};

const uploadFile = async file => {
  audioFile.value = file;
  const title = file.name.split('.').slice(0, -1).join('.');
  playerStore.showPlayer(file, title, `Неизвестный`);
};

const onFileClear = (removeCallback, index) => {
  removeCallback(index);
  audioFile.value = null;
  playerStore.hidePlayer();
};

onBeforeUnmount(() => {
  playerStore.hidePlayer();
});
</script>

<template>
  <div class="file-upload-container">
    <FileUpload
      :multiple="false"
      :accept="'.wav,.flac'"
      :maxFileSize="100 * 1024 * 1024"
      @select="onFileSelect"
      @clear="onFileClear"
      :pt="{
        root: '!p-0 !relative !w-full !h-48',
        content:
          '!absolute top-0 !h-full !w-full !p-0 flex justify-center items-center',
        empty:
          '!absolute flex justify-center items-center !w-full !h-full top-7',
        header:
          '!absolute flex justify-center items-center !w-full !h-full !p-0',
      }"
    >
      <template #empty>
        <div class="flex flex-column align-center justify-center">
          <p class="font-light text-ash-600">
            Для добавления трека загрузите файл WAV 16 bit или FLAC 24 bit
          </p>
        </div>
      </template>

      <template #content="{ files, removeFileCallback }">
        <div v-if="files.length > 0">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="flex justify-center items-center gap-2"
          >
            <span>{{ file.name }} ({{ formatSize(file.size) }})</span>
            <Button unstyled @click="onFileClear(removeFileCallback, index)">
              <UiuxIconTrashBox />
            </Button>
          </div>
        </div>
      </template>

      <template #header="{ chooseCallback }">
        <div class="w-full flex justify-center items-start">
          <Button
            v-if="!audioFile"
            unstyled
            @click="chooseCallback()"
            class="p-2 rounded-full z-1"
          >
            <UiuxIconArrowUpload />
          </Button>
        </div>
      </template>
    </FileUpload>
  </div>
</template>
