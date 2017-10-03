/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

type SortOrder = 'DESC' | 'ASC';

interface Observable<T> {}

interface Sort {
  path: string;
  order: SortOrder;
}

interface Array<T> {
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  sortInfo: Sort[];
  self_uri: string;
  next_uri: string;
  prev_uri: string;
  first_uri: string;
  last_uri: string;
  next(): Observable<void>;
  prev(): Observable<void>;
  first(): Observable<void>;
  last(): Observable<void>;
  page(id: number): Observable<void>;
  sortElements(...sort: Sort[]): Observable<void>;
  size(size: number): Observable<void>;
}



