export class ManagerQueryParams {
  search: string | undefined;
  sort: {
    surname?: 'asc' | 'desc';
    firstname?: 'asc' | 'desc';
    createdAt?: 'asc' | 'desc';
  };
  page: number;
  limit: number;

  constructor(
    search: string | undefined = undefined,
    sort: {
      surname?: 'asc' | 'desc';
      firstname?: 'asc' | 'desc';
      createdAt?: 'asc' | 'desc';
    } = { surname: 'asc' },
    page: number = 1,
    limit: number = 10
  ) {
    this.search = search;
    this.sort = sort;
    this.page = page;
    this.limit = limit;
  }
}
