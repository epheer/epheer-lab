import type { Pagination } from '~/types/Pagination';

export interface FullUserInfo {
  id: string;
  login: string;
  role: string;
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
  email: string;
  is_active: boolean;
  createdAt: string;
}

export interface InfoResponse {
  [index: number]: FullUserInfo;
}

export interface FullInfoResponse {
  data: InfoResponse[];
  pagination: Pagination;
}
