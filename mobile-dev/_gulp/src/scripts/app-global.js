'use strict';
// Ionic App
angular.module('tideApp', ['ionic', 'controllers', 'factory'])

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

    .state('app.single', {
      url: "/bay/:bayId",
      views: {
        'menuContent' :{
          templateUrl: "partials/bay.html",
          controller: 'BayController'
        }
      }
    });

    // .state('app.search', {
    //   url: "/search",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/search.html"
    //     }
    //   }
    // })

    // .state('app.browse', {
    //   url: "/browse",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/browse.html"
    //     }
    //   }
    // })
    // .state('app.playlists', {
    //   url: "/playlists",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/playlists.html",
    //       controller: 'PlaylistsCtrl'
    //     }
    //   }
    // })

    // .state('app.single', {
    //   url: "/playlists/:playlistId",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/playlist.html",
    //       controller: 'PlaylistCtrl'
    //     }
    //   }
    // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});