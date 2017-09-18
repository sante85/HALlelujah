import {HttpParams} from "@angular/common/http";
import {Sort} from "./sort";
import {Resource} from "./resource";

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
      }else {
        result[key] = resource[key];
      }
    }
    return result as Object;
  }
}
