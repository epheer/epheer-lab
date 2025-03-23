<script setup lang="ts">
import { ref } from 'vue';
import type { Release, Track } from '~/types/label/IRelease';
import { ReleaseType } from '~/constants/release';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const releaseId = route.params.id;

const track = ref<Track>({
  index: 1,
  name: '',
  feat: [],
  explicit: false,
  lyrics: {
    text: '',
  },
  authors: {
    producers: [],
    lyricists: [],
  },
  file: {
    key: '',
    duration: 0,
  },
  release: releaseId,
});

const trackList = ref<Track[]>([]);

const metadata = ref<Release>({
  artist: {
    user_id: '',
    stage_name: '',
  },
  name: '',
  feat: [],
  date: undefined,
  type: ReleaseType.SINGLE,
  cover_key: '',
  authors: {
    lyricists: [''],
    producers: [''],
  },
  status: {
    label: 'draft',
  },
});

const getNextFridayInTwoWeeks = (): Date => {
  const today = new Date();
  let currentDay = today.getDay();
  let daysUntilNextFriday = (5 - currentDay + 7) % 7;

  let nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilNextFriday);

  while (nextFriday - today < 14 * 24 * 60 * 60 * 1000) {
    nextFriday.setDate(nextFriday.getDate() + 7);
  }

  return nextFriday;
};

onMounted(() => {
  metadata.value.date = getNextFridayInTwoWeeks();
});
</script>

<template>
  <Stepper value="1">
    <StepList>
      <Step value="1"
        ><span class="hidden lg:block">{{
          $t('releases.steps.info')
        }}</span></Step
      >
      <Step value="2"
        ><span class="hidden lg:block">{{
          $t('releases.steps.tracks')
        }}</span></Step
      >
      <Step value="3"
        ><span class="hidden lg:block">{{
          $t('releases.steps.confirm')
        }}</span></Step
      >
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1" unstyled>
        <LabelReleaseStepReleaseMetadata
          :name="metadata.name"
          :feat="metadata.feat"
          :date="metadata.date"
          :type="metadata.type"
          :coverkey="metadata.cover_key"
          :authors="metadata.authors"
          @next-step="activateCallback"
        />
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2" unstyled> </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3" unstyled> </StepPanel>
    </StepPanels>
  </Stepper>
</template>
