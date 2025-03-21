import type { ArtistsList } from '~/types/label/IArtist';
import type { Pagination } from '~/types/Pagination';

export interface ArtistResponse {
  data: ArtistsList;
  pagination: Pagination;
}
