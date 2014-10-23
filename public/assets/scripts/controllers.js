"use strict";angular.module("controllers",[]).controller("homeController",function($scope,$analytics,baysList){$analytics.pageTrack("/home"),$scope.loadBay=function(bayID,bayName){$analytics.pageTrack("/bay/"+bayID),window.localStorage.currentBay=bayID,window.localStorage.currentBayName=bayName,$scope.ons.navigator.pushPage("partials/bay.html")},baysList.getAll().then(function(results){window.localStorage.allBays=JSON.stringify(results),$scope.baysAll=results,$("#loadingApp").fadeOut()})}).controller("BayController",function($scope,$location,bayDetail){$("#loadingApp").show(),setTimeout(function(){$("#loadingApp").fadeOut()},500);var bayIdGet=window.localStorage.currentBay,bayNameGet=window.localStorage.currentBayName,yearCurrent=(new Date).getFullYear(),monthCurrent=parseInt((new Date).getMonth())+1;bayDetail.getBay(bayIdGet,yearCurrent,monthCurrent).then(function(results){$scope.nameBay=bayNameGet;var todayClass="",items=[],currentMonth=(results.data,parseInt((new Date).getMonth())),monthToEvCurrent=((new Date).getFullYear(),0),monthToEvMinusCt=0;monthToEvCurrent=currentMonth,monthToEvMinusCt=0===monthToEvCurrent?11:currentMonth-1;var fixMonth={m1:0,m2:1,m3:0,m4:1,m5:2,m6:3,m7:4,m8:5,m9:6,m10:7,m11:8,m12:9},moonPhase={nm:["Nueva","new_moon.png"],fq:["Creciente","first_quarter.png"],fm:["Llena","full_moon.png"],lq:["Menguante","last_quarter.png"]};angular.forEach(results.data,function(valDay){var mesInt=parseInt(valDay.months),dayInt=parseInt(valDay.day),today=new Date,mm=today.getMonth()+1;if(mesInt===mm){var monthCorr="m"+mesInt,nroAureo=(parseInt(valDay.years)+1)%19,epacta=99*(nroAureo-1),edadLunar=epacta+parseInt(fixMonth[monthCorr])+dayInt,moonPhaseDay="",moonPhaseDayImg="";edadLunar>30&&(edadLunar-=30),edadLunar>=0&&6>=edadLunar?(moonPhaseDay=moonPhase.nm[0],moonPhaseDayImg=moonPhase.nm[1]):edadLunar>=7&&13>=edadLunar?(moonPhaseDay=moonPhase.fq[0],moonPhaseDayImg=moonPhase.fq[1]):edadLunar>=14&&21>=edadLunar?(moonPhaseDay=moonPhase.fm[0],moonPhaseDayImg=moonPhase.fm[1]):edadLunar>=22&&(moonPhaseDay=moonPhase.lq[0],moonPhaseDayImg=moonPhase.lq[1]),todayClass=today.getDate()===dayInt?"today_tide":"";var hasH4st=0;""!==valDay.h4st&&(hasH4st=1),this.push({data:valDay,todayClass:todayClass,moonPhaseDay:moonPhaseDay,moonPhaseDayImg:moonPhaseDayImg,hasH4st:hasH4st})}},items),$scope.itemDays=items,setTimeout(function(){if(void 0!==$("#current_day_scroll").offset()){var altoScroll=parseInt($("#current_day_scroll").offset().top)-100;$(".page__content").animate({scrollTop:altoScroll},"500","swing",function(){})}},500)})});