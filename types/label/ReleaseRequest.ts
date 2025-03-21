export class ReleaseQueryParams {
  filter: {
    status?: string;
  };
  sort: {
    name?: 'asc' | 'desc';
    stage_name?: 'asc' | 'desc';
  };
  search: string | undefined;
  page: number;
  limit: number;

  constructor(
    filter: { status?: string } = {},
    sort: { name?: 'asc' | 'desc'; stage_name?: 'asc' | 'desc' } = {},
    search: string | undefined = undefined,
    page: number = 1,
    limit: number = 10
  ) {
    this.filter = filter;
    this.sort = sort;
    this.search = search;
    this.page = page;
    this.limit = Math.min(limit, 50);
  }
}
