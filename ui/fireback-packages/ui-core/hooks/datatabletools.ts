export declare type SortingDirection = "asc" | "desc";

export interface Filters {
  itemsPerPage: number;
  cursor?: string;
  sort?: string;
  sorting?: Sorting[];
}

export interface Sorting {
  /** Specifies a column's name to which the sorting is applied. */
  columnName: string;
  /** Specifies a column's sorting order. */
  direction: SortingDirection;
}

export interface Filter {
  /** Specifies the name of a column whose value is used for filtering. */
  columnName: string;
  /** Specifies the operation name. The value is 'contains' if the operation name is not set. */
  operation?: any;
  /** Specifies the filter value. */
  value?: any;
}
