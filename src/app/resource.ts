import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';

export class Resource {

  static path: string;
  http: HttpClient;
  observable: Observable<any>;
  _links: any;
  [index: string]: any;

  constructor() {}

  // Get collection of related resources

  getAll<R extends Resource>(cls: typeof R, relation: string): R[] {

    const result = [];
    result['http'] = this.http;
    result['observable'] =  this.http.get(this._links.relation.href);
    result['observable'].subscribe(data => {
      for (const item of data['_embedded'][Object.keys(data['_embedded'])[0]]){
        item as R;
        item.http = this.http;
        result.push(item);
      }
    });
    return result;
  }

  // Get related resource

  get<R extends Resource>(cls: typeof R, relation: string): R {
    const resource: R = {} as R;
    resource.http = this.http;
    resource.observable = this.http.get(this._links.relation.href);
    resource.observable.subscribe(data => {
      for(let p in data){
        resource[p] = data[p];
      }
    });
    return resource;
  }

  // Bind the given resource to this resource by the given relation

  bind<R extends Resource>(relation: string, resource: R): Observable<void> {
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

  add<R extends Resource>(relation: string, resource:R): Observable<void> {
    return this.http.post(this._links.relation.href, resource._links.self.href)
      .map(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error);
  }

}
