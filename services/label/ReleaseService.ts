import { api } from '~/utils/axios.config';
import type { AxiosResponse } from 'axios';
import type {
  CreateReleaseSuccess,
  ReleaseList,
} from '~/types/label/ReleaseResponse';
import type { Release } from '~/types/label/IRelease';

export default class ReleaseService {
  // 1. Создание релиза
  static async createRelease(
    artistId: string
  ): Promise<AxiosResponse<CreateReleaseSuccessResponse>> {
    return await api.post(`/${artistId}/new`);
  }

  // 2. Обновление релиза
  static async updateRelease(data: Release): Promise<AxiosResponse<Release>> {
    return await api.put(`/${data.id}`, data);
  }

  // 3. Сохранение релиза (перевод в статус "ожидание")
  static async saveRelease(releaseId: string): Promise<AxiosResponse<Release>> {
    return await api.patch(`/${releaseId}`);
  }

  // 4. Обновление статуса релиза
  static async updateReleaseStatus(
    releaseId: string,
    status: string,
    userId: string,
    message?: string
  ): Promise<AxiosResponse<Release>> {
    const body = { status, userId, message };
    return await api.patch(`/${releaseId}/status`, body);
  }

  // 5. Получение релиза по ID
  static async getReleaseById(
    releaseId: string
  ): Promise<AxiosResponse<Release>> {
    return await api.get(`/${releaseId}`);
  }

  // 6. Получение релизов по артистам
  static async getReleasesByArtists(
    artistIds: string[],
    queryParams: ReleaseQueryParams
  ): Promise<AxiosResponse<ReleaseList>> {
    const ids = artistIds.join(',');
    const cleanedParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );
    return await api.get(`/artists/${ids}`, { params: cleanedParams });
  }

  // 7. Получение всех релизов
  static async getAllReleases(
    queryParams: ReleaseQueryParams
  ): Promise<AxiosResponse<ReleaseList>> {
    const cleanedParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );
    return await api.get(`/`, { params: cleanedParams });
  }
}
