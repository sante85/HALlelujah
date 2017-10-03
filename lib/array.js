"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var Observable_1 = require("rxjs/Observable");
Array.prototype.totalElements = 0;
Array.prototype.totalPages = 1;
Array.prototype.pageNumber = 1;
// Load next page
Array.prototype.next = function () {
  var _this = this;
  if (this.next_uri) {
    return this.http.get(this.next_uri)
      .map(function (response) {
        return _this.init(response, _this.sortInfo);
      })
      .catch(function (error) {
        return Observable_1.Observable.throw(error);
      });
  }
};
Array.prototype.prev = function () {
  var _this = this;
  if (this.prev_uri) {
    return this.http.get(this.prev_uri)
      .map(function (response) {
        return _this.init(response, _this.sortInfo);
      })
      .catch(function (error) {
        return Observable_1.Observable.throw(error);
      });
  }
};
// Load first page
Array.prototype.first = function () {
  var _this = this;
  if (this.first_uri) {
    return this.http.get(this.first_uri)
      .map(function (response) {
        return _this.init(response, _this.sortInfo);
      })
      .catch(function (error) {
        return Observable_1.Observable.throw(error);
      });
  }
};
// Load last page
Array.prototype.last = function () {
  var _this = this;
  if (this.last_uri) {
    return this.http.get(this.last_uri)
      .map(function (response) {
        return _this.init(response, _this.sortInfo);
      })
      .catch(function (error) {
        return Observable_1.Observable.throw(error);
      });
  }
};
// Load page with given pageNumber
Array.prototype.page = function (id) {
  var _this = this;
  var uri = this.self_uri.concat('?', 'size=', this.pageSize.toString(), '&page=', id.toString());
  for (var _i = 0, _a = this.sortInfo; _i < _a.length; _i++) {
    var item = _a[_i];
    uri.concat('&sort=', item.path, ',', item.order);
  }
  return this.http.get(uri)
    .map(function (response) {
      return _this.init(response, _this.sortInfo);
    })
    .catch(function (error) {
      return Observable_1.Observable.throw(error);
    });
};
// Sort collection based on given sort attribute
Array.prototype.sortElements = function () {
  var _this = this;
  var sort = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sort[_i] = arguments[_i];
  }
  var uri = this.self_uri.concat('?', 'size=', this.pageSize.toString(), '&page=', this.pageNumber.toString());
  for (var _a = 0, sort_1 = sort; _a < sort_1.length; _a++) {
    var item = sort_1[_a];
    uri.concat('&sort=', item.path, ',', item.order);
  }
  return this.http.get(uri)
    .map(function (response) {
      return _this.init(response, sort);
    })
    .catch(function (error) {
      return Observable_1.Observable.throw(error);
    });
};
// Load page with given size
Array.prototype.size = function (size) {
  var _this = this;
  var uri = this.self_uri.concat('?', 'size=', size.toString());
  for (var _i = 0, _a = this.sortInfo; _i < _a.length; _i++) {
    var item = _a[_i];
    uri.concat('&sort=', item.path, ',', item.order);
  }
  return this.http.get(uri)
    .map(function (response) {
      return _this.init(response, _this.sortInfo);
    })
    .catch(function (error) {
      return Observable_1.Observable.throw(error);
    });
};
//# sourceMappingURL=array.js.map
