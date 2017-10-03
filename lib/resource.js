"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var http_1 = require("@angular/common/http");
var resource_helper_1 = require("./resource-helper");
var Resource = /** @class */ (function () {
  function Resource() {
  }

  // Get collection of related resources
  Resource.prototype.getAll = function (type, relation, size) {
    var sort = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      sort[_i - 3] = arguments[_i];
    }
    var params = resource_helper_1.ResourceHelper.queryStringSort(new http_1.HttpParams(), sort);
    resource_helper_1.ResourceHelper.queryStringSize(params, size);
    var result = resource_helper_1.ResourceHelper.createEmptyResult(this.http);
    result.observable = this.http.get(this._links[relation].href, {params: params});
    result.observable.subscribe(function (response) {
      return resource_helper_1.ResourceHelper.instantiateResourceCollection(type, response, result);
    });
    return result;
  };
  // Get related resource
  Resource.prototype.get = function (type, relation) {
    var _this = this;
    var result = new type();
    result.observable = this.http.get(this._links.relation.href);
    result.observable.subscribe(function (data) {
      resource_helper_1.ResourceHelper.instantiateResource(result, data, _this.http);
    });
    return result;
  };
  // Bind the given resource to this resource by the given relation
  Resource.prototype.bind = function (resource) {
    return this.http.put(this._links.relation.href, resource._links.self.href);
  };
  // Unbind the resource with the given relation from this resource
  Resource.prototype.unbind = function (relation) {
    return this.http.delete(this._links.relation.href);
  };
  // Adds the given resource to the bound collection by the relation
  Resource.prototype.add = function (relation, resource) {
    return this.http.post(this._links[relation].href, resource._links.self.href, {headers: new http_1.HttpHeaders().set('Content-Type', 'text/uri-list')});
  };
  return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map
