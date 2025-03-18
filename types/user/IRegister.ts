import { UserRole } from '~/constants/roles';

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

export interface IRegisterForm {
  login: string;
  password: string;
  role: UserRole;
  email: string;
  stageName: string;
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
  isRegistered: boolean;
}