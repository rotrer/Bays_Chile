'use strict';
// Ionic App
angular.module('tideApp', ['ionic', 'controllers', 'factory', 'directives'])

//Router
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
})

//Constantes App
.value('dataApp', {
  endPointBase: 'http://tides.rotrer.com/bays/' 
})

//Filters
.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})

//Basic config phonegap
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
