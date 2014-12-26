'use strict';

/* Factory */
angular.module('factory', [])


.factory('baysData', function($http, dataApp) {
  var bayData = {'name' : '', 'slug': ''};
  return {
    setSelectedBay: function (name, slug) {
      bayData = {'name' : name, 'slug': slug};
    },
    getSelectedBay: function (name, slug) {
      return bayData;
    },
    getAll: function(bayId) {
      var url = dataApp.endPointBase + '/localidades';
      var promise = $http.get(url).then(function (response) {
        return response.data;
      });
      return promise;
    },
    getBay: function(bayId, year, month) {
      var url = dataApp.endPointBase + "/mareas/" + bayId + "/" + year + "/" + month;
      var promise = $http.get(url).then(function (response) {
        return response;
      });
      return promise;
    }
  };
})
