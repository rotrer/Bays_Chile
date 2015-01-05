'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, $location, baysData) {
  angular.element("#nav").removeClass("show");

	$scope.loadBay = function(bayID) {
    angular.forEach($scope.baysAll, function(val, key) {
      if (bayID == val.slug) {
        baysData.setSelectedBay( val.name, val.slug );
        $location.path('/bay/' + val.slug);
      }
    });
  };

  baysData.getAll().then(function(results) {
    $scope.baysAll = results;
    $("#loadingApp").fadeOut();
  });

})

.controller('BayController', function($scope, $location, $routeParams, baysData) {
  angular.element("#nav").removeClass("show");

  $scope.addFav = function() {
    var favBays = localS.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localS.getItem('baysFav'));
    favBays.bays.push(bayIdGet);
    localS.setItem('baysFav', JSON.stringify(favBays));
    $scope.favAdd = false;
    $scope.favDelete = true;
  };

  $scope.deleteFav = function() {
    var favBays = localS.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localS.getItem('baysFav'));
    favBays.bays.remove(bayIdGet);
    localS.setItem('baysFav', JSON.stringify(favBays));
    $scope.favAdd = true;
    $scope.favDelete = false;
  };
  
  // $routeParams.baySlug
  var bayInfo = baysData.getSelectedBay();
  // var bayInfo = {'name' : 'Valparaíso', 'slug': 'valparaiso'};
  var bayIdGet = $routeParams.baySlug;
  var yearCurrent = new Date().getFullYear();
  var monthCurrent = parseInt( new Date().getMonth() ) + 1;

  $scope.nameBay = bayInfo.name;
  baysData.getBay(bayInfo.slug, yearCurrent, monthCurrent).then(function(results) {
    //Mes actual de bahí seleccionada
    var todayClass = '';
    var collapseClass = '';
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
        var epacta = (nroAureo - 1) * 11;
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
          collapseClass = "in";
        } else {
          todayClass = "";
          collapseClass = "";
        }
        
        var hasH4st = 0;
        if (valDay.h4st !== "") {
          hasH4st = 1;
        }

        this.push({data: valDay, todayClass: todayClass, collapseClass: collapseClass, moonPhaseDay: moonPhaseDay, moonPhaseDayImg: moonPhaseDayImg, hasH4st: hasH4st});
      }
    }, items);
    
    $scope.itemDays = items;
    // Obtener estado de favorito bahía
    var favBays = localS.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localS.getItem('baysFav'));

    $scope.favAdd = false;
    $scope.favDelete = false;
    if (favBays.bays.indexOf(bayInfo.slug) === -1) {
      $scope.favAdd = true;
      $scope.favDelete = false;
    } else {
      $scope.favAdd = false;
      $scope.favDelete = true;
    }

    // call $anchorScroll()
    // setTimeout(function(){
    //   if($("#current_day_scroll").offset() !== undefined) {
    //     var altoScroll = parseInt($("#current_day_scroll").offset().top) - 100;
    //     $(".page__content").animate({scrollTop:altoScroll}, '500', 'swing', function() {
    //     });
    //   }
    // }, 500);
  });
  
})

.controller('favoritesController', function($scope, $location, baysData) {
  angular.element("#nav").removeClass("show");

  // var favBays = window.localS['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localS['baysFav']);
  var favBays = localS.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localS.getItem('baysFav'));
  var favBaysList = [];

  baysData.getAll().then(function(results) {
    angular.forEach(results, function(val, key) {
      if (favBays.bays.indexOf(val.slug) !== -1)
        favBaysList.push({'name' : val.name, 'slug': val.slug});
    });
    $scope.baysAll = favBaysList;
  });
  
  $scope.loadBay = function(bayID) {
    angular.forEach($scope.baysAll, function(val, key) {
      if (bayID == val.slug) {
        baysData.setSelectedBay( val.name, val.slug );
        $location.path('/bay/' + val.slug);
      }
    });
  };

})

.controller('settingsController', function($scope, $location, baysData) {
  angular.element("#nav").removeClass("show");

  $scope.moonPhaseChange = function(itemBayState){
    if (itemBayState === true) {
      $scope.moon_active = 'active';
      $scope.moon_inactive = '';
    } else{
      $scope.moon_active = '';
      $scope.moon_inactive = 'active';
    };
    localS.setItem('moonPhaseNotif', itemBayState);
    //Set local notifications
    setNotifMoonPhase(itemBayState);
  }

  $scope.weekendChange = function(itemWeekendState){
    if (itemWeekendState === true) {
      $scope.weekend_active = 'active';
      $scope.weekend_inactive = '';
      /**
      * 
      * Web local storage, arreglo de bahias favoritas con notificacion
      **/
      var baysNotif = localS.getItem('weekendNotifBays') === null ? { "bays" : [] } : JSON.parse(localS.getItem('weekendNotifBays'));
      baysData.getAll().then(function(results) {
        /*
        * 
        * Lista de favoritos para notificaciones
        */
        var favBays = localS.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localS.getItem('baysFav'));
        var favBaysList = { "bays" : [] };
        var allBays = results;

        angular.forEach(allBays, function(val, key) {
          if (favBays.bays.indexOf(val.slug) !== -1)
            setNotifBaysWeekend(val.slug, val.name);
        });
      });
    } else {
      $scope.weekend_active = '';
      $scope.weekend_inactive = 'active';
      $scope.baysAll = null;
      //Delete all notif weekend
      deleteAllNotifWeekend();
    };
    $scope.weekendNotif = itemWeekendState;
    localS.setItem('weekendNotif', itemWeekendState);

  }

  if (localS.getItem('moonPhaseNotif') === 'true') {
    $scope.moon_active = 'active';
    $scope.moon_inactive = '';
  } else {
    $scope.moon_active = '';
    $scope.moon_inactive = 'active';
  }
  
  if (localS.getItem('weekendNotif') === 'true') {
    $scope.weekend_active = 'active';
    $scope.weekend_inactive = '';
  } else {
    $scope.weekend_active = '';
    $scope.weekend_inactive = 'active';
  }

});