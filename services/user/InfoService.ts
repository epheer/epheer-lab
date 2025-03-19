import { api } from '~/utils/axios.config';
import type {
  FullInfoResponse,
  InfoResponse,
  FullUserInfo,
} from '~/types/user/InfoResponse';
import { type AxiosResponse } from 'axios';
import { type InfoRequestParams } from '~/types/user/InfoRequest';

export default class InfoService {
  static async getUserInfoById(id: string): Promise<FullUserInfo> {
    const result = await api.get<InfoResponse>(`/users/${id}`);
    return result.data[0];
  }

  static async getAllUsersInfo(
    params: InfoRequestParams
  ): Promise<AxiosResponse<FullInfoResponse>> {
    return await api.get<FullInfoResponse>(`/users/`, { params });
  }
}
