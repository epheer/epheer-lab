import { api } from '~/utils/axios.config';
import type { AxiosResponse } from 'axios';

export default class MediaService {
  /**
   * Загрузка обложки релиза
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param file Файл обложки (JPG, 3000x3000 пикселей)
   * @returns Сообщение об успешной загрузке
   */
  public static async uploadCover(
    artistId: string,
    releaseId: string,
    file: File
  ): Promise<AxiosResponse<{ message: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(`/media/${artistId}/${releaseId}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Загрузка трека
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param file Файл трека (WAV или FLAC)
   * @param trackNumber Порядковый номер трека
   * @param trackTitle Название трека
   * @returns Сообщение об успешной загрузке
   */
  public static async uploadTrack(
    artistId: string,
    releaseId: string,
    file: File,
    trackNumber: number,
    trackTitle: string
  ): Promise<AxiosResponse<{ message: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('trackNumber', trackNumber.toString());
    formData.append('trackTitle', trackTitle);

    return await api.post(`/media/${artistId}/${releaseId}/track`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Получение обложки релиза
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param size Размер обложки (original, 1200, 600)
   * @returns Поток файла обложки (JPG)
   */
  public static async getCover(
    artistId: string,
    releaseId: string,
    size: 'original' | '1200' | '600'
  ): Promise<AxiosResponse<Blob>> {
    return await api.get(`/media/${artistId}/${releaseId}/cover/${size}`, {
      responseType: 'blob',
    });
  }

  /**
   * Получение трека
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param fileName Имя файла трека
   * @returns Поток файла трека (WAV или FLAC)
   */
  public static async getTrack(
    artistId: string,
    releaseId: string,
    fileName: string
  ): Promise<AxiosResponse<Blob>> {
    return await api.get(`/media/${artistId}/${releaseId}/tracks/${fileName}`, {
      responseType: 'blob',
    });
  }

  /**
   * Скачивание файла (обложки или трека)
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param fileName Имя файла
   * @returns Файл в виде буфера
   */
  public static async downloadFile(
    artistId: string,
    releaseId: string,
    fileName: string
  ): Promise<AxiosResponse<Blob>> {
    return await api.get(
      `/media/${artistId}/${releaseId}/${fileName}/download`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * Удаление файла (обложки или трека)
   * @param artistId ID артиста
   * @param releaseId ID релиза
   * @param fileName Имя файла
   * @returns Ответ без содержимого
   */
  public static async deleteFile(
    artistId: string,
    releaseId: string,
    fileName: string
  ): Promise<AxiosResponse<void>> {
    return await api.delete(`/media/${artistId}/${releaseId}/${fileName}`);
  }
}
