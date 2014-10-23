'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, $analytics, baysList) {
  $analytics.pageTrack('/home');
	$scope.loadBay = function(bayID, bayName) {
    $analytics.pageTrack('/bay/' + bayID);
    window.localStorage['currentBay'] = bayID;
	  window.localStorage['currentBayName'] = bayName;
    $scope.ons.navigator.pushPage('partials/bay.html');
  };

  baysList.getAll().then(function(results) {
    window.localStorage['allBays'] = JSON.stringify(results);
    $scope.baysAll = results;
    $("#loadingApp").fadeOut();
  });

})

.controller('BayController', function($scope, $location, bayDetail) {
  $("#loadingApp").show();
  setTimeout(function(){
    $("#loadingApp").fadeOut();
  }, 500);
  var bayIdGet = window.localStorage['currentBay'];
  var bayNameGet = window.localStorage['currentBayName'];
  var yearCurrent = new Date().getFullYear();
  var monthCurrent = parseInt( new Date().getMonth() ) + 1;

  bayDetail.getBay(bayIdGet, yearCurrent, monthCurrent).then(function(results) {
    $scope.nameBay = bayNameGet;
    //Mes actual de bahí seleccionada
    var todayClass = '';
    var items = [];
    var fechas = results.data;
    var currentMonth = parseInt(new Date().getMonth());
    var currentYear = new Date().getFullYear();
    var monthToEvCurrent = 0,
        monthToEvMinusCt = 0;

        //Mes actual menos uno para forma JS 0-11
        monthToEvCurrent = currentMonth;
        //Excepciones para primer mes del año
        if (monthToEvCurrent === 0) {
          monthToEvMinusCt = 11;
        } else {
          monthToEvMinusCt = currentMonth - 1;
        }

    /*
    * Calcula fase lunar, arreglo correcion mes
    */
    var fixMonth = { "m1": 0, "m2": 1, "m3": 0, "m4": 1, "m5": 2, "m6": 3, "m7": 4, "m8": 5, "m9": 6, "m10": 7, "m11": 8, "m12": 9 };
    var moonPhase = { "nm" : ["Nueva", "new_moon.png"], "fq" : ["Creciente", "first_quarter.png"], "fm" : ["Llena", "full_moon.png"], "lq" : ["Menguante", "last_quarter.png"]};

    angular.forEach(results.data, function(valDay, keyDay) {
      var mesInt = parseInt(valDay.months);
      var dayInt = parseInt(valDay.day);
      var today = new Date();
      var mm = today.getMonth()+1;
      
      //Fix raro :/
      // if (valDay.months == "08")
      // {
      //   mesInt = 8;
      // }
      // else if (dateTide[1] == "09")
      // {
      //   mesInt = 9;
      // }
      if (mesInt === mm) {
        /*
        * Calcula fase lunar
        */
        var monthCorr = "m" + mesInt;
        var nroAureo = (parseInt(valDay.years) + 1) % 19;
        var epacta = (nroAureo - 1) * 99;
        var edadLunar = epacta + parseInt(fixMonth[monthCorr]) + dayInt;
        var moonPhaseDay = '';
        var moonPhaseDayImg = '';
        //Correción si es mayor a 30 edad lunar
        if (edadLunar > 30)
          edadLunar = edadLunar - 30;
        
        //Fases Lunares según edad lunar
        if (edadLunar >= 0 && edadLunar <= 6) {
          moonPhaseDay = moonPhase.nm[0];
          moonPhaseDayImg = moonPhase.nm[1];
        } else if (edadLunar >= 7 && edadLunar <= 13) {
          moonPhaseDay = moonPhase.fq[0];
          moonPhaseDayImg = moonPhase.fq[1];
        } else if (edadLunar >= 14 && edadLunar <= 21) {
          moonPhaseDay = moonPhase.fm[0];
          moonPhaseDayImg = moonPhase.fm[1];
        } else if (edadLunar >= 22) {
          moonPhaseDay = moonPhase.lq[0];
          moonPhaseDayImg = moonPhase.lq[1];
        }
        
        //Destacar dia actual de marea
        if (today.getDate() === dayInt) {
          todayClass = "today_tide";
        } else {
          todayClass = "";
        }
        
        var hasH4st = 0;
        if (valDay.h4st !== "") {
          hasH4st = 1;
        }

        this.push({data: valDay, todayClass: todayClass, moonPhaseDay: moonPhaseDay, moonPhaseDayImg: moonPhaseDayImg, hasH4st: hasH4st});
      }
    }, items);

    $scope.itemDays = items;

    // call $anchorScroll()
    setTimeout(function(){
      if($("#current_day_scroll").offset() !== undefined) {
      	var altoScroll = parseInt($("#current_day_scroll").offset().top) - 100;
  			$(".page__content").animate({scrollTop:altoScroll}, '500', 'swing', function() {
  			});
      }
    }, 500);
  });
  
});