import {HttpClient, HttpParams} from '@angular/common/http';
import {Resource} from './resource';

export declare class ResourceHelper {
  static queryStringSort(params: HttpParams, sort?: Sort[]): HttpParams;

  static queryStringSize(params: HttpParams, size?: number): HttpParams;

  static queryStringSearch(params: HttpParams, queryParams?: Map<string, any>): HttpParams;

  static resolveRelations(resource: Resource): Object;

  static createEmptyResult<R extends Resource>(http: HttpClient): R[];

  static instantiateResourceCollection<R extends Resource>(type: {
    new (): R;
  }, payload: any, result: R[]): void;

  static instantiateResource<R extends Resource>(entity: R, payload: Object, http: HttpClient): void;
}
