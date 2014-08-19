'use strict';

/* Factory */
angular.module('factory', [])


.factory('baysList', function($http) {
  return {
    getAll: function(callback) {
      $http.get('http://tides.rotrer.com/bays/bays.json').success(callback);
    }
  };
})

.factory('bayDetail', function($http) {
  return {
    getBay: function(bayId) {
      var urlBay = 'http://tides.rotrer.com/bays/' + bayId + '.json';
      var promise = $http.get(urlBay).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
})