<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { Release, Track } from '~/types/label/IRelease';

const track = reactive<Track>({
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
  release: '',
});

const trackList = reactive<Track[]>([]);
</script>

<template>
  <Stepper value="1" linear>
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
      <StepPanel
        v-slot="{ activateCallback }"
        value="1"
        unstyled
        class="bg-ash-100"
      >
        <LabelReleaseStepReleaseMetadata @next-step="activateCallback('2')" />
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="2"
        unstyled
        class="bg-ash-100"
      >
        <LabelReleaseStepTrackList
          :trackList="trackList"
          :track="track"
          @next-step="activateCallback('3')"
        />
      </StepPanel>
      <StepPanel
        v-slot="{ activateCallback }"
        value="3"
        unstyled
        class="bg-ash-100"
      >
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
