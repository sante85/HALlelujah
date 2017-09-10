import {Resource} from './resource';
import {Page} from './page';
import {SortOrder} from './sort-order';

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Sort} from './sort';


@Injectable()
export class ResourceService {

  constructor(private root_uri: string, private http: HttpClient) {}

  getAll<R extends Resource>(cls: typeof R, ...sort: Sort[]): R[] {

    const uri = this.root_uri.concat(cls.path);
    const params = this.queryStringSort(new HttpParams(), sort);

    const result = [];
    result['http'] = this.http;
    result['observable'] =  this.http.get(uri, {params: params});
    result['observable'].subscribe(data => {
      for (const item  of data['_embedded'][Object.keys(data['_embedded'])[0]]){
        item.http = this.http;
        result.push(item);
      }
    });
    return result;
  }

  getAllPaged<R extends Resource>(cls: typeof R, size?: number, ...sort: Sort[]): Page<R> {
    const uri = this.root_uri.concat(cls.path);
    let params = new HttpParams();
    params = this.queryStringSize(params, size);
    params = this.queryStringSort(params, sort);

    const result = new Page<R>(this.http);
    result.observable =  this.http.get(uri, {params: params});
    result.observable.subscribe(data => { result.init(data, sort); });

    return result;
  }

  get<R extends Resource>(cls: typeof R, id: any): R {
    const uri = this.root_uri.concat(cls.path).concat('/', id);
    const resource: R = {} as R;
    resource.http = this.http;
    resource.observable = this.http.get(uri);
    resource.observable.subscribe(data => {
      for (let p in data) {
        resource[p] = data[p];
      }
    });
    return resource;
  }

  search<R extends Resource>(query: string, queryParams?: Map<string, any>, size?: number, ...sort: Sort[]): Page<R> {
    const uri = this.root_uri.concat('/search/', query);
    let params = new HttpParams();
    params = this.queryStringSearch(params, queryParams);
    params = this.queryStringSize(params, size);
    params = this.queryStringSort(params, sort);

    const result = new Page<R>(this.http);
    result.observable = this.http.get(uri,{params: params});
    result.observable.subscribe(data => result.init(data, sort));
    return result;
  }

  create<R extends Resource>(entity: R): any {
    const uri = this.root_uri.concat(entity.path);
    const payload = this.resolveRelations(entity);
    const result = {};
    result['observable'] = this.http.post(uri, payload);
    result['observable'].susbcribe(data => {
      for (let p in payload) {
        result[p] = payload[p];
      }
    });
    return result;
  }

  delete<R extends Resource>(resource: R): Observable<any> {
    return this.http.delete(resource._links.self.href);
  }

  private queryStringSort(params: HttpParams, sort?: {path: string, order: SortOrder}[]): HttpParams {

    if (sort) {
      for (let i = 0; i < sort.length; i++) {
        params = params.append('sort', sort[i].path.concat(',').concat(sort[i].order));
      }
    }
    return params;
  }

  private queryStringSize(params: HttpParams, size?: number): HttpParams {
    if (size) {
      params = params.append('size', size.toString());
    }
    return params;
  }

  private queryStringSearch(params: HttpParams, queryParams?: Map<string, any>): HttpParams {
    if (queryParams && queryParams.size > 0) {
      const qs = '';
      const i = 0;
      queryParams.forEach((value: any, key: string) => {
        params.append(key, value);
      });
    }
    return params;
  }

  private resolveRelations(resource: Resource): Object {
    const result: any = {};
    for (const key in resource) {
      if (resource[key] instanceof Resource) {
        result[key] = resource[key]['_links']['self']['href'];
      }else {
        result[key] = resource[key];
      }
    }
    return result as Object;
  }

}
