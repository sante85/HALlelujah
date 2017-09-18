import {Resource} from './resource';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';
import {Sort} from './sort';

export class Page<R extends Resource> {

  data: R[];
  pageSize: number;
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  sortInfo: Sort[];
  observable: Observable<any>;

  private self_uri: string;
  private next_uri: string;
  private prev_uri: string;
  private first_uri: string;
  private last_uri: string;

  constructor(private http: HttpClient) {}

  public init(response: any, sort: Sort[]) {
    this.data = [];

    for (const item  of response._embedded[Object.keys(response._embedded)[0]]) {
      item as R;
      item.http = this.http;
      this.data.push(item);
    }

    this.pageSize = response.page.size;
    this.totalElements = response.page.totalElements;
    this.totalPages = response.page.totalPages;
    this.pageNumber = response.page.number;
    this.sortInfo = sort;

    this.self_uri = response._links.self ? response._links.self.href : undefined;
    this.next_uri = response._links.next ? response._links.next.href : undefined;
    this.prev_uri = response._links.prev ? response._links.prev.href : undefined;
    this.first_uri = response._links.first() ? response._links.first().href : undefined;
    this.last_uri = response._links.last ? response._links.last.href : undefined;
  }

  // Load next page

  next(): Observable<void> {
    if (this.next_uri) {
      return this.http.get(this.next_uri)
        .map(response => this.init(response, this.sortInfo))
        .catch(error => Observable.throw(error));
    }
  }

  // Load previous page

  prev(): Observable<void> {
    if (this.prev_uri) {
      return this.http.get(this.prev_uri)
        .map(response => this.init(response, this.sortInfo))
        .catch(error => Observable.throw(error));
    }
  }

  // Load first page

  first(): Observable<void> {
    if (this.first_uri) {
      return this.http.get(this.first_uri)
        .map(response => this.init(response, this.sortInfo))
        .catch(error => Observable.throw(error));
    }
  }

  // Load last page

  last(): Observable<void> {
    if (this.last_uri) {
      return this.http.get(this.last_uri)
        .map(response => this.init(response, this.sortInfo))
        .catch(error => Observable.throw(error));
    }
  }

  // Load page with given pageNumber

  page (page: number): Observable<void> {
    const uri = this.self_uri.concat('?', 'size=', this.pageSize.toString(), '&page=', page.toString());
    for(const item of this.sortInfo){
      uri.concat('&sort=', item.path, ',', item.order);
    }
    return this.http.get(uri)
      .map(response => this.init(response, this.sortInfo))
      .catch(error => Observable.throw(error));
  }

  // Sort collection based on given sort attribute

  sort( ...sort: Sort[]): Observable<void> {
    const uri = this.self_uri.concat('?', 'size=', this.pageSize.toString(), '&page=', this.pageNumber.toString());
    for (const item of sort) {
      uri.concat('&sort=', item.path, ',', item.order);
    }
    return this.http.get(uri)
      .map(response => this.init(response, sort))
      .catch(error => Observable.throw(error));
  }

  // Load page with given size

  size(size: number): Observable<void> {
    const uri = this.self_uri.concat('?', 'size=', size.toString());
    for (const item of this.sortInfo) {
      uri.concat('&sort=', item.path, ',', item.order);
    }
    return this.http.get(uri)
      .map(response => this.init(response, this.sortInfo))
      .catch(error => Observable.throw(error));
  }

}
