export interface IAuthData {
  login: string;
  password: string;
  role: string;
  email: string;
}

export interface IInfoData {
  id: string;
  surname: string;
  firstname: string;
  patronymic?: string;
  contact: string;
}

export interface IArtistData {
  id: string;
  stageName: string;
}
