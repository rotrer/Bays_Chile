'use strict';
// Ionic App
angular.module('tideApp', ['ngRoute', 'controllers', 'factory', 'directives'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'homeController'
			}).
			when('/bay/:baySlug', {
				templateUrl: 'partials/bay.html',
				controller: 'BayController'
			}).
			when('/favorites', {
				templateUrl: 'partials/favorites.html',
				controller: 'favoritesController'
			}).
			when('/settings', {
				templateUrl: 'partials/settings.html',
				controller: 'settingsController'
			}).
			otherwise({
				redirectTo: 'home'
			});
}])

//Constantes App
.value('dataApp', {
  endPointBase: 'http://api.mareaschile.com' 
})

//Filters
.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});