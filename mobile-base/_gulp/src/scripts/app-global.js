'use strict';

/* App Module */
angular.module('tideApp', [
  'ngRoute',
  // 'myApp.filters',
  // 'myApp.services',
  // 'myApp.directives',
  'tideApp.controllers'
]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/home', {templateUrl: 'partials/base.html', controller: 'BaysController'}).
      when('/favorites', {templateUrl: 'partials/favorites.html', controller: 'FavoritesController'}).
      otherwise({redirectTo: '/home'});
  }]);