import {Resource} from './resource';
import {Page} from './page';

import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Sort} from './sort';
import {ResourceHelper} from './resource-helper';

export let API_URI = new InjectionToken('api.uri');

@Injectable()
export class ResourceService {

  constructor(@Inject(API_URI) private root_uri: string, private http: HttpClient) {}

  getAll<R extends Resource>(type: { new(): R } , resource: string, ...sort: Sort[]): R[] {
    const uri = this.root_uri.concat(resource);
    const params = ResourceHelper.queryStringSort(new HttpParams(), sort);

    const result: R[] = [];
    result['http'] = this.http;
    result['observable'] =  this.http.get(uri, {params: params});
    result['observable'].subscribe(data => {
      for (const item  of data['_embedded'][Object.keys(data['_embedded'])[0]]){
        const e: R = new type();
        result.push(e);
        this.instantiateResource(e, item);
      }
    });
    return result;
  }

  getAllPaged<R extends Resource>(type: { new(): R }, resource: string, size?: number, ...sort: Sort[]): Page<R> {
    const uri = this.root_uri.concat(resource);
    const params = new HttpParams();
    ResourceHelper.queryStringSize(params, size);
    ResourceHelper.queryStringSort(params, sort);

    const result = new Page<R>(this.http);
    result.observable =  this.http.get(uri, {params: params});
    result.observable.subscribe(data => { result.init(data, sort); });

    return result;
  }

  get<R extends Resource>(type: { new(): R }, resource: string, id: any): R {
    const uri = this.root_uri.concat(resource).concat('/', id);
    const result: R = new type();
    result.http = this.http;
    result.observable = this.http.get(uri);
    result.observable.subscribe(data => {
      this.instantiateResource(result, data);
    });
    return result;
  }

  search<R extends Resource>(query: string, queryParams?: Map<string, any>, size?: number, ...sort: Sort[]): Page<R> {
    const uri = this.root_uri.concat('/search/', query);
    const params = new HttpParams();
    ResourceHelper.queryStringSearch(params, queryParams);
    ResourceHelper.queryStringSize(params, size);
    ResourceHelper.queryStringSort(params, sort);

    const result = new Page<R>(this.http);
    result.observable = this.http.get(uri, {params: params});
    result.observable.subscribe(data => result.init(data, sort));
    return result;
  }

  create<R extends Resource>(entity: R): any {
    const uri = this.root_uri.concat(entity.path);
    const payload = ResourceHelper.resolveRelations(entity);
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

  private instantiateResource<R extends Resource>(entity: R, payload: Object): void {
    for (const p in payload) {
      entity[p] = payload[p];
    }
    entity.http = this.http;
  }

}
