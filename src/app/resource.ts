import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Sort} from "./sort";
import {ResourceHelper} from "./resource-helper";

export abstract class Resource {

  static path: string;
  http: HttpClient;
  observable: Observable<any>;
  _links: any;
  [index: string]: any;

  constructor() {}

  // Get collection of related resources

  getAll<R extends Resource>(type: { new(): R }, relation: string, ...sort: Sort[]): R[] {

    const params = ResourceHelper.queryStringSort(new HttpParams(), sort);
    const result:  R[] = [];
    result['http'] = this.http;
    result['observable'] =  this.http.get(this._links[relation].href, params);
    result['observable'].subscribe(data => {
      for (const item  of data['_embedded'][Object.keys(data['_embedded'])[0]]){
        const e: R = new type();
        for (const p in item) {
          e[p] = item[p];
        }
        e.http = this.http;
        result.push(e);
      }
    });
    return result;
  }

  // Get related resource

  get<R extends Resource>(type: { new(): R }, relation: string): R {
    const result: R = new type();
    result.http = this.http;
    result.observable = this.http.get(this._links.relation.href);
    result.observable.subscribe(data => {
      this.instantiateResource(result, data);
    });
    return result;
  }

  // Bind the given resource to this resource by the given relation

  bind<R extends Resource>(resource: R): Observable<void> {
    return this.http.put(this._links.relation.href, resource._links.self.href)
      .map(() => null)
      .catch(this.handleError);
  }


  // Unbind the resource with the given relation from this resource

  unbind(relation: string): Observable<void> {
    return this.http.delete(this._links.relation.href)
      .map(() => null)
      .catch(this.handleError);
  }

  // Adds the given resource to the bound collection by the relation

  add<R extends Resource>(relation: string, resource: R): Observable<void> {
    return this.http.post(this._links.relation.href, resource._links.self.href)
      .map(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error);
  }

  private instantiateResource<R extends Resource>(entity: R, payload: Object): void {
    for (const p in payload) {
      entity[p] = payload[p];
    }
    entity.http = this.http;
  }

}
