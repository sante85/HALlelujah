import {HttpClient, HttpParams} from '@angular/common/http';
import {Resource} from './resource';

export class ResourceHelper {

    static queryStringSort(params: HttpParams, sort?: Sort[]): HttpParams {
        if (sort) {
            for (const s of sort) {
                params = params.append('sort', s.path.concat(',').concat(s.order));
            }
        }
        return params;
    }

    static queryStringSize(params: HttpParams, size?: number): HttpParams {
        if (size) {
            params = params.append('size', size.toString());
        }
        return params;
    }

    static queryStringSearch(params: HttpParams, queryParams?: Map<string, any>): HttpParams {
        if (queryParams && queryParams.size > 0) {
            const qs = '';
            const i = 0;
            queryParams.forEach((value: any, key: string) => {
                params.append(key, value);
            });
        }
        return params;
    }

    static resolveRelations(resource: Resource): Object {
        const result: any = {};
        for (const key in resource) {
            if (resource[key] instanceof Resource) {
                result[key] = resource[key]['_links']['self']['href'];
            } else {
                result[key] = resource[key];
            }
        }
        return result as Object;
    }

    static createEmptyResult<R extends Resource>(http: HttpClient): R[] {
        const result: R[] = [];
        result.http = http;
        return result;
    }

    static instantiateResourceCollection<R extends Resource>(type: { new(): R }, payload: any, result: R[]): void {
        for (const item  of payload._embedded [Object.keys(payload['_embedded'])[0]]) {
            const e: R = new type();
            this.instantiateResource(e, item, result['http']);
            result.push(e);
        }

        result.totalElements = payload.page ? payload.page.totalElements : result.length;
        result.totalPages = payload.page ? payload.page.totalPages : 1;
        result.pageNumber = payload.page ? payload.page.number : 1;

        result.self_uri = payload._links.self ? payload._links.self.href : undefined;
        result.next_uri = payload._links.next ? payload._links.next.href : undefined;
        result.prev_uri = payload._links.prev ? payload._links.prev.href : undefined;
        result.first_uri = payload._links.first ? payload._links.first.href : undefined;
        result.last_uri = payload._links.last ? payload._links.last.href : undefined;
    }

    static instantiateResource<R extends Resource>(entity: R, payload: Object, http: HttpClient): void {
        for (const p in payload) {
            entity[p] = payload[p];
        }
        entity.http = http;
    }
}
