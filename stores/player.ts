import { defineStore } from 'pinia';

interface PlayerState {
  isVisible: boolean;
  audioFile: File | null;
  title: string;
  artist: string;
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    isVisible: false,
    audioFile: null,
    title: '',
    artist: '',
  }),
  actions: {
    showPlayer(audioFile: File, title: string, artist: string = ''): void {
      this.audioFile = audioFile;
      this.title = title;
      this.artist = artist;
      this.isVisible = true;
    },

    hidePlayer(): void {
      this.isVisible = false;
      this.audioFile = null;
      this.title = '';
      this.artist = '';
    },
  },
});
