'use strict';
// Ionic App
angular.module('tideApp', ['ionic', 'controllers', 'factory', 'directives'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "partials/menu.html"
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "partials/base.html",
          controller: 'homeController'
        }
      }
    })

    .state('app.bay', {
      url: "/bay/:bayId",
      views: {
        'menuContent' :{
          templateUrl: "partials/bay.html",
          controller: 'BayController'
        }
      }
    })

    .state('app.favorites', {
      url: "/favorites",
      views: {
        'menuContent' :{
          templateUrl: "partials/favorites.html",
          controller: 'favoritesController'
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "partials/settings.html",
          controller: 'settingsController'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};