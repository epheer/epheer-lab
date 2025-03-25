import { defineStore } from 'pinia';
import type { Release } from '~/types/label/IRelease';
import ReleaseService from '~/services/label/ReleaseService';
import { ReleaseStatus, ReleaseType } from '~/constants/release';

export const useReleaseStore = defineStore('release', {
  state: (): Release => ({
    id: '',
    artist: {
      userId: '',
      stageName: '',
    },
    name: '',
    feat: [],
    date: undefined,
    type: ReleaseType.SINGLE,
    cover: '',
    authors: {
      lyricists: [],
      producers: [],
    },
    status: {
      label: ReleaseStatus.DRAFT,
    },
  }),
  actions: {
    async fetchRelease(releaseId: string): Promise<void> {
      try {
        const { data } = await ReleaseService.getReleaseById(releaseId);
        Object.assign(this, data);
      } catch (e: any) {
        console.error('Ошибка при загрузке релиза:', e);
        throw new Error(
          e.response?.data?.message || 'Не удалось загрузить релиз'
        );
      }
    },

    async updateRelease(metadata: Release): Promise<void> {
      try {
        const release = await ReleaseService.updateRelease(metadata);
        Object.assign(this, release);
      } catch (e: any) {
        console.error('Ошибка при обновлении релиза:', e);
        throw new Error(
          e.response?.data?.message || 'Не удалось обновить релиз'
        );
      }
    },
  },
});
