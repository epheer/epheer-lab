<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '~/stores/player';
import { Howl } from 'howler';

const playerStore = usePlayerStore();
const { title, artist, isVisible } = storeToRefs(playerStore);

const sound = ref();
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(1);
const prevVolume = ref(0);
const volumePopover = ref();
const fileUrl = ref();
let progressInterval;

const loadAudio = file => {
  fileUrl.value = URL.createObjectURL(file);
  if (sound.value) sound.value.unload();

  sound.value = new Howl({
    src: [fileUrl.value],
    html5: true,
    onplay: () => {
      isPlaying.value = true;
      progressInterval = setInterval(updateProgress, 100);
    },
    onpause: () => {
      isPlaying.value = false;
      if (progressInterval) clearInterval(progressInterval);
    },
    onend: () => {
      isPlaying.value = false;
      currentTime.value = 0;
      progress.value = 0;
      if (progressInterval) clearInterval(progressInterval);
    },
    onload: () => (duration.value = Number(sound.value?.duration())),
    onseek: () => (currentTime.value = Number(sound.value?.seek())),
    onloaderror: () => {
      console.error('Ошибка загрузки аудио');
    },
  });
};

onBeforeUnmount(() => {
  playerStore.hidePlayer();
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
  if (sound.value) sound.value.unload();
  if (progressInterval) clearInterval(progressInterval);
});

const togglePlay = () => {
  if (!sound.value) return;
  isPlaying.value ? sound.value.pause() : sound.value.play();
};

const seek = value => {
  if (!sound.value) return;
  sound.value.seek(value);
};

const setVolume = newVolume => {
  if (!sound.value) return;
  volume.value = newVolume;
  if (newVolume > 0 && isMuted()) toggleMute();
};

const updateProgress = () => {
  if (!sound.value || !isPlaying.value) return;
  currentTime.value = Number(sound.value.seek());
  progress.value = currentTime.value;
};

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const toggleMute = () => {
  if (!sound.value) return;
  if (volume.value > 0) {
    prevVolume.value = volume.value;
    volume.value = 0;
    sound.value.mute(true);
  } else {
    volume.value = prevVolume.value;
    sound.value.mute(false);
  }
};

const isMuted = () => {
  return volume.value === 0;
};

const toggleVolumePopover = event => {
  volumePopover.value.toggle(event);
};

watch(volume, newVolume => {
  if (!sound.value) return;
  sound.value.volume(newVolume);
});

watch(
  () => playerStore.audioFile,
  newFile => {
    if (newFile) {
      loadAudio(newFile);
    }
  },
  { immediate: true }
);

watch(
  () => playerStore.isVisible,
  newVisibility => {
    if (!newVisibility) {
      if (sound.value) {
        sound.value.stop();
        isPlaying.value = false;
      }
      if (progressInterval) clearInterval(progressInterval);
      currentTime.value = 0;
      progress.value = 0;
      duration.value = 0;
    }
  }
);
</script>

<template>
  <div
    v-if="isVisible"
    class="bg-ash-200/60 backdrop-blur-md backdrop-saturate-180 grid grid-cols-3 rounded-t-3xl shadow-e border-1 border-ash-200 p-4"
  >
    <div class="justify-self-start flex items-center justify-evenly gap-4">
      <div
        class="h-14 p-3 aspect-square rounded-xl bg-ash-300/60 flex items-center justify-center text-ash-600/80 hover:text-ash-700 duration-300"
      >
        <UiuxPlayerSongIcon class="w-full h-full" />
      </div>
      <div class="hidden md:flex flex-col">
        <span class="font-bold">{{ title }}</span>
        <span class="font-light">{{ artist }}</span>
      </div>
    </div>

    <div
      class="flex flex-col items-center justify-center justify-self-center w-full"
    >
      <Button
        unstyled
        @click="togglePlay"
        class="w-11 h-11 p-1 flex items-center justify-center rounded-full text-ash-600 hover:text-ash-900 transition-all duration-300"
      >
        <UiuxPlayerPlayIcon v-if="!isPlaying" class="w-full h-full" />
        <UiuxPlayerPauseIcon v-else class="w-full h-full" />
      </Button>

      <div
        class="group/controls flex justify-between items-center gap-4 w-[150%] md:w-[120%]"
      >
        <span
          class="hidden md:block tabular-nums opacity-0 group-hover/controls:opacity-100 text-light text-ash-600 text-sm transition-all duration-500"
        >
          {{ formatTime(currentTime) }}
        </span>
        <div class="group/duration py-2 flex-1">
          <Slider
            v-model="progress"
            :min="0"
            :max="duration"
            @value-change="seek"
            class="flex-1 rounded-full appearance-none !cursor-pointer"
            :pt="{
              root: '!h-1 !bg-ash-400',
              handle:
                'opacity-0 group-hover/duration:opacity-100 !cursor-pointer !outline-none !transition-opacity !duration-300',
              range: '!bg-ash-700 !rounded-full',
            }"
          />
        </div>
        <span
          class="hidden md:block tabular-nums opacity-0 group-hover/controls:opacity-100 text-light text-ash-600 text-sm transition-all duration-500"
        >
          {{ formatTime(duration) }}
        </span>
      </div>
    </div>

    <div class="justify-self-end flex items-center">
      <div class="flex gap-3 justify-evenly items-center">
        <Button
          unstyled
          @click="toggleMute"
          class="hidden md:block text-ash-600 hover:text-ash-900 transition-all duration-300"
        >
          <UiuxPlayerVolumeXIcon v-show="volume === 0" />
          <UiuxPlayerVolumeIcon v-show="volume > 0" />
        </Button>

        <div class="group/volume">
          <Slider
            v-model="volume"
            :min="0"
            :max="1"
            :step="0.01"
            @value-change="setVolume"
            class="hidden md:block w-30 rounded-full appearance-none !cursor-pointer"
            :pt="{
              root: '!bg-ash-400 !h-1 !cursor-pointer',
              handle:
                'opacity-0 group-hover/volume:opacity-100 !cursor-pointer !outline-none !transition-opacity !duration-300',
              range: '!bg-ash-700 !rounded-full',
            }"
          />
        </div>

        <Button
          unstyled
          @click="toggleVolumePopover"
          class="md:hidden text-ash-600 hover:text-ash-900 transition-all duration-300"
        >
          <UiuxPlayerVolumeXIcon v-show="volume === 0" />
          <UiuxPlayerVolumeIcon v-show="volume > 0" />
        </Button>

        <Popover ref="volumePopover">
          <Slider
            v-model="volume"
            orientation="vertical"
            :min="0"
            :max="1"
            :step="0.01"
            @value-change="setVolume"
            class="w-30 rounded-full appearance-none !cursor-pointer slider-vertical"
            :pt="{
              handle:
                '!bg-ash-400 !cursor-pointer !outline-none !transition-opacity !duration-300',
              range: '!bg-ash-700 !rounded-full',
            }"
          />
        </Popover>
      </div>
    </div>
  </div>
</template>
