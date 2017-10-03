import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';

export declare abstract class Resource {
  static path: string;
  http: HttpClient;
  observable: Observable<any>;
  _links: any;
  [index: string]: any;

  constructor();

  getAll<R extends Resource>(type: {
    new (): R;
  }, relation: string, size?: number, ...sort: Sort[]): R[];

  get <R extends Resource>(type: {
    new (): R;
  }, relation: string): R;

  bind<R extends Resource>(resource: R): Observable<any>;

  unbind(relation: string): Observable<any>;

  add<R extends Resource>(relation: string, resource: R): Observable<any>;
}
