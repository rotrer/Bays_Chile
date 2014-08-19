'use strict';

/* Factory */
angular.module('factory', [])


.factory('baysList', function($http) {
  return {
    getAll: function(bayId) {
      var url = 'http://tides.rotrer.com/bays/bays.json';
      var promise = $http.get(url).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
})

.factory('bayDetail', function($http) {
  return {
    getBay: function(bayId) {
      var url = 'http://tides.rotrer.com/bays/' + bayId + '.json';
      var promise = $http.get(url).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
})