import {Resource} from './resource';

import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ResourceHelper} from './resource-helper';

export let API_URI = new InjectionToken('api.uri');

@Injectable()
export class ResourceService {

    constructor(@Inject(API_URI) private root_uri: string, private http: HttpClient) {
    }

    getAll<R extends Resource>(type: { new(): R }, resource: string, size?: number, ...sort: Sort[]): R[] {
        const uri = this.root_uri.concat(resource);
        const params = ResourceHelper.queryStringSort(new HttpParams(), sort);
        ResourceHelper.queryStringSize(params, size);
        const result: R[] = ResourceHelper.createEmptyResult<R>(this.http);
        result.sortInfo = sort;
        result.observable = this.http.get(uri, {params: params});
        result.observable.subscribe(response => ResourceHelper.instantiateResourceCollection(type, response, result));
        return result;
    }

    get <R extends Resource>(type: { new(): R }, resource: string, id: any): R {
        const uri = this.root_uri.concat(resource).concat('/', id);
        const result: R = new type();
        result.observable = this.http.get(uri);
        result.observable.subscribe(data => {
            ResourceHelper.instantiateResource(result, data, this.http);
        });
        return result;
    }

    search<R extends Resource>(type: { new(): R }, query: string, queryParams?: Map<string, any>, size?: number, ...sort: Sort[]): R[] {
        const uri = this.root_uri.concat('/search/', query);
        const params = new HttpParams();
        ResourceHelper.queryStringSearch(params, queryParams);
        ResourceHelper.queryStringSize(params, size);
        ResourceHelper.queryStringSort(params, sort);

        const result: R[] = ResourceHelper.createEmptyResult<R>(this.http);
        result.observable = this.http.get(uri, {params: params});
        result.observable.subscribe(response => ResourceHelper.instantiateResourceCollection(type, response, result));
        return result;
    }

    create<R extends Resource>(entity: R): Observable<Object> {
        const uri = this.root_uri.concat(entity.path);
        const payload = ResourceHelper.resolveRelations(entity);
        return this.http.post(uri, payload);
    }

    delete<R extends Resource>(resource: R): Observable<Object> {
        return this.http.delete(resource._links.self.href);
    }

}
