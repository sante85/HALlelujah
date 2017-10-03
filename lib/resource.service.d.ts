import {Resource} from './resource';
import {InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export declare let API_URI: InjectionToken<{}>;
export declare class ResourceService {
  private root_uri;
  private http;

  constructor(root_uri: string, http: HttpClient);

  getAll<R extends Resource>(type: {
    new (): R;
  }, resource: string, size?: number, ...sort: Sort[]): R[];

  get <R extends Resource>(type: {
    new (): R;
  }, resource: string, id: any): R;

  search<R extends Resource>(type: {
    new (): R;
  }, query: string, queryParams?: Map<string, any>, size?: number, ...sort: Sort[]): R[];

  create<R extends Resource>(entity: R): Observable<Object>;

  delete<R extends Resource>(resource: R): Observable<Object>;

  private getResourceUrl(resource?);
}
