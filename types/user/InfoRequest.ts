import type { UserRole } from '~/constants/roles';

export interface InfoRequestParams {
  page?: number;
  limit?: number;
  'filter[role]'?: UserRole;
  search?: string;
  'sort[createdAt]'?: 'asc' | 'desc';
  'sort[role]'?: 'asc' | 'desc';
}