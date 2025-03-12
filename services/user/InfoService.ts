import { api } from "~/utils/axios.config";
import { type InfoResponse } from "~/types/user/InfoResponse";
import { type IInfo } from "~/types/user/IInfo";

export default class InfoService {
  static async getUserInfoById(id: string): Promise<IInfo> {
    const result = await api.get<InfoResponse>(`/users/${id}`);
    const userInfo: IInfo = {
      surname: result.data[0].surname,
      firstname: result.data[0].firstname,
      patronymic: result.data[0].patronymic,
      contact: result.data[0].contact,
      email: result.data[0].email,
      createdAt: result.data[0].createdAt,
    };
    return userInfo;
  }
}
