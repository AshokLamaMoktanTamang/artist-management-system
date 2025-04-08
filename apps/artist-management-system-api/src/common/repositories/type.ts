export type QueryOptions<T> = {
  where?: Partial<T>;
  limit?: number;
  offset?: number;
  orderBy?: keyof T;
  orderDirection?: 'ASC' | 'DESC';
};
