import { defineStore } from 'pinia';
import type { ArtistsList, IArtist } from '~/types/label/IArtist';
import ArtistService from '~/services/label/ArtistService';
import { ArtistQueryParams } from '~/types/label/ArtistRequest';
import ManagerService from '~/services/label/ManagerService';
import type { Pagination } from '~/types/Pagination';

interface ArtistStore {
  artists: ArtistsList;
  currentArtist: IArtist | null;
  isFetched: boolean;
  isRootFetch: boolean;
  pagination: Pagination | null;
}

export const useArtistStore = defineStore('artist', {
  state: (): ArtistStore => ({
    artists: [],
    currentArtist: null,
    isFetched: false,
    isRootFetch: false,
    pagination: null,
  }),
  actions: {
    async fetchAllArtists(
      queryParams: Partial<ArtistQueryParams>
    ): Promise<void> {
      try {
        const params = new ArtistQueryParams(
          queryParams.filter,
          queryParams.search,
          queryParams.sort,
          queryParams.page,
          queryParams.limit
        );
        const response = await ArtistService.getAllArtists(params);
        this.artists = response.data.data;
        this.pagination = response.data.pagination;
        this.isFetched = true;
        this.isRootFetch = true;
      } catch (e: any) {
        throw new Error(
          e.response?.data?.message || 'Ошибка при получении списка артистов'
        );
      }
    },

    async fetchAllManagerArtists(managerId: string): Promise<void> {
      try {
        const response = await ManagerService.getArtistsPool(managerId);
        this.artists = response.data;
        this.isFetched = true;
        this.isRootFetch = false;
      } catch (e: any) {
        throw new Error(e.response?.data?.message);
      }
    },

    async fetchAndUpdateArtist(id: string): Promise<void> {
      try {
        const updatedArtist = await ArtistService.getArtistById(id);
        const artistIndex = this.artists.findIndex(artist => artist.id === id);

        if (artistIndex !== -1) {
          this.artists[artistIndex] = updatedArtist;
        } else {
          this.artists.push(updatedArtist);
        }
        this.isRootFetch = false;
        this.currentArtist = updatedArtist;
      } catch (e: any) {
        throw new Error(e);
      }
    },
  },
});
