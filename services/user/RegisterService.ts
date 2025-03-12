import { api } from "~/utils/axios.config";
import { type AxiosResponse } from "axios";
import type { IAuthData, IInfoData, IArtistData } from "~/types/user/IRegister";
import { type AuthResponse } from "~/types/user/AuthResponse";

export default class RegisterService {
  static async registerUser(
    authData: IAuthData
  ): Promise<AxiosResponse<AuthResponse>> {
    const { login, password, role, email } = authData;
    return await api.post("/auth/register", { login, password, role, email });
  }

  static async addInfoAboutUserById(
    infoData: IInfoData
  ): Promise<AxiosResponse> {
    const { id, surname, firstname, patronymic, contact } = infoData;
    return await api.put(`/users/${id}`, {
      surname,
      firstname,
      patronymic,
      contact,
    });
  }

  static async addStageNameById(
    artistData: IArtistData
  ): Promise<AxiosResponse> {
    const { id, stageName } = artistData;
    return await api.patch(`/artists/${id}/name`, {
      stageName,
    });
  }
}
