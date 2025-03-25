import type { Pagination } from '~/types/Pagination';
import type { ReleaseType } from '~/constants/release';

export interface CreateReleaseSuccess {
  id: string;
  artist: {
    stage_name: string;
    user_id: string;
  };
}

export interface ReleaseListItem {
  id: string;
  artist: string;
  name: string;
  type: ReleaseType;
  cover: string;
  date: string;
  feat: string[];
  status: string;
}

export interface ReleaseList {
  data: ReleaseListItem;
  pagination: Pagination;
}
