import { api } from '~/utils/axios.config';
import type { ArtistsList, IArtist } from '~/types/label/IArtist';
import type { AxiosResponse } from 'axios';
import type { ArtistResponse } from '~/types/label/ArtistResponse';
import type { ArtistQueryParams } from '~/types/label/ArtistRequest';

export default class ArtistService {
  static async linkManager(
    artistId: string,
    managerId: string
  ): Promise<IArtist> {
    return await api.patch(`/artists/${artistId}/manager`, { managerId });
  }

  static async getArtistById(id: string): Promise<IArtist> {
    let response: AxiosResponse<ArtistsList>;
    response = await this.getArtistsByIds(id);
    return response.data[0];
  }

  static async getArtistsByIds(
    ids: string
  ): Promise<AxiosResponse<ArtistsList>> {
    return await api.get(`/artists/${ids}`);
  }

  static async getAllArtists(
    params: ArtistQueryParams
  ): Promise<AxiosResponse<ArtistResponse>> {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return await api.get(`/artists`, { params: cleanedParams });
  }
}
