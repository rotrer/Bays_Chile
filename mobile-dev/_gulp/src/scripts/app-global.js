'use strict';
// Ionic App
angular.module('tideApp', ['onsen', 'controllers', 'factory', 'directives'])

//Constantes App
.value('dataApp', {
  endPointBase: 'http://tides.rotrer.com/bays/v2/' 
})

//Filters
.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})

// Basic config phonegap
.run(function() {
	// $( document ).on( "deviceready", function(){    
 //  });
	// ons.ready(function() {
	  
	// });
});