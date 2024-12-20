// shared/interfaces/paginate.ts
export interface Paginate<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number | any;
    per_page: number | any;
  }