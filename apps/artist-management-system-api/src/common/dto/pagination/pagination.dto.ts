export class PaginationDto {
  totalPage: number;

  totalCount: number;

  page: number;

  constructor(totalCount: number, totalPage: number, page: number) {
    this.totalCount = totalCount;
    this.totalPage = totalPage;
    this.page = page + 1;
  }
}
