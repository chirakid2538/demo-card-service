export interface ResponsePaginate<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}
