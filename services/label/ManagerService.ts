import { api } from '~/utils/axios.config';
import type { AxiosResponse } from 'axios';
import type { ArtistsList } from '~/types/label/IArtist';
import type { ManagerResponse } from '~/types/label/ManagerResponse';

export default class ManagerService {
  static async getArtistsPool(id: string): Promise<AxiosResponse<ArtistsList>> {
    return await api.get(`/managers/${id}/artists`);
  }

  static async getAllManagers(
    params: any
  ): Promise<AxiosResponse<ManagerResponse>> {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return await api.get(`/managers/`, { params: cleanedParams });
  }
}
