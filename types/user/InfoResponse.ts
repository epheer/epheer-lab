interface FullUserInfo {
  id: string;
  login: string;
  role: string;
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
  email: string;
  is_active: boolean;
  createdAt: Date;
}

export interface InfoResponse {
  [index: number]: FullUserInfo;
}
