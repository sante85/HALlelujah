"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var resource_1 = require("./resource");
var ResourceHelper = /** @class */ (function () {
  function ResourceHelper() {
  }

  ResourceHelper.queryStringSort = function (params, sort) {
    if (sort) {
      for (var _i = 0, sort_1 = sort; _i < sort_1.length; _i++) {
        var s = sort_1[_i];
        params = params.append('sort', s.path.concat(',').concat(s.order));
      }
    }
    return params;
  };
  ResourceHelper.queryStringSize = function (params, size) {
    if (size) {
      params = params.append('size', size.toString());
    }
    return params;
  };
  ResourceHelper.queryStringSearch = function (params, queryParams) {
    if (queryParams && queryParams.size > 0) {
      var qs = '';
      var i = 0;
      queryParams.forEach(function (value, key) {
        params.append(key, value);
      });
    }
    return params;
  };
  ResourceHelper.resolveRelations = function (resource) {
    var result = {};
    for (var key in resource) {
      if (resource[key] instanceof resource_1.Resource) {
        result[key] = resource[key]['_links']['self']['href'];
      }
      else {
        result[key] = resource[key];
      }
    }
    return result;
  };
  ResourceHelper.createEmptyResult = function (http) {
    var result = [];
    result.http = http;
    return result;
  };
  ResourceHelper.instantiateResourceCollection = function (type, payload, result) {
    for (var _i = 0, _a = payload._embedded[Object.keys(payload['_embedded'])[0]]; _i < _a.length; _i++) {
      var item = _a[_i];
      var e = new type();
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
  };
  ResourceHelper.instantiateResource = function (entity, payload, http) {
    for (var p in payload) {
      entity[p] = payload[p];
    }
    entity.http = http;
  };
  return ResourceHelper;
}());
exports.ResourceHelper = ResourceHelper;
//# sourceMappingURL=resource-helper.js.map
