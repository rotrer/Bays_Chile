"use strict";angular.module("tideApp",["onsen","angulartics","angulartics.google.analytics","controllers","factory","directives"]).value("dataApp",{endPointBase:"http://api.mareaschile.com"}).filter("capitalize",function(){return function(input){return input?input.replace(/([^\W_]+[^\s-]*) */g,function(txt){return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase()}):""}});