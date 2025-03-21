import type { ManagersList } from '~/types/label/IManager';
import type { Pagination } from '~/types/Pagination';

export interface ManagerResponse {
  data: ManagersList;
  pagination: Pagination;
}
