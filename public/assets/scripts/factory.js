'use strict';

/* Factory */
angular.module('factory', [])


.factory('baysList', function($http, dataApp) {
  return {
    getAll: function(bayId) {
      var url = dataApp.endPointBase + '/localidades';
      var promise = $http.get(url).then(function (response) {
        console.log(response);
        return response.data;
      });
      return promise;
    }
  };
})

.factory('bayDetail', function($http, dataApp) {
  return {
    getBay: function(bayId) {
      var url = dataApp.endPointBase + bayId + '.json';
      var promise = $http.get(url).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
})
