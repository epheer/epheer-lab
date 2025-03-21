import type { Pagination } from '~/types/Pagination';
import type { ReleaseType } from '~/constants/release';

interface CreateReleaseSuccess {
  id: string;
  artist: {
    stage_name: string;
    user_id: string;
  };
}

interface ReleaseListItem {
  id: string;
  artist: string;
  name: string;
  type: ReleaseType;
  cover: string;
  date: string;
  feat: string[];
  status: string;
}

interface ReleaseList {
  data: ReleaseListItem;
  pagination: Pagination;
}
