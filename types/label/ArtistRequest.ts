export class ArtistQueryParams {
  filter: { managerId?: string } | undefined;
  search: string | undefined;
  sort: {
    stage_name?: 'asc' | 'desc';
    surname?: 'asc' | 'desc';
    firstname?: 'asc' | 'desc';
    createdAt?: 'asc' | 'desc';
  };
  page: number;
  limit: number;

  constructor(
    filter:
      | {
          managerId?: string;
        }
      | undefined = undefined,
    search: string | undefined = undefined,
    sort: {
      stage_name?: 'asc' | 'desc';
      surname?: 'asc' | 'desc';
      firstname?: 'asc' | 'desc';
      createdAt?: 'asc' | 'desc';
    } = { stage_name: 'asc' },
    page: number = 1,
    limit: number = 12
  ) {
    this.filter = filter;
    this.search = search;
    this.sort = sort;
    this.page = page;
    this.limit = limit;
  }
}
