'use strict';
// Ionic App
angular.module('tideApp', ['onsen', 'angulartics', 'angulartics.google.analytics', 'controllers', 'factory', 'directives'])

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