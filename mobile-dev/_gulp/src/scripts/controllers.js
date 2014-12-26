'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, $location, baysData) {
  angular.element("#nav").removeClass("show");

	$scope.loadBay = function(bayID) {
	  // window.localStorage['currentBay'] = bayID;
    // localStorage.setItem('currentBay', bayID);
    // $scope.ons.navigator.pushPage('partials/bay.html');
    // /bay/{{ bay.slug }}
    angular.forEach($scope.baysAll, function(val, key) {
      if (bayID == val.slug) {
        baysData.setSelectedBay( val.name, val.slug );
        $location.path('/bay/' + val.slug);
      }
    });
  };

  baysData.getAll().then(function(results) {
    // window.localStorage['allBays'] = JSON.stringify(results);
    // localStorage.setItem('allBays', JSON.stringify(results));
    $scope.baysAll = results;
    $("#loadingApp").fadeOut();
  });

})

.controller('BayController', function($scope, $location, $routeParams, baysData) {
  angular.element("#nav").removeClass("show");

  $scope.addFav = function() {
    // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
    var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
    favBays.bays.push(bayIdGet);
    // window.localStorage['baysFav'] = JSON.stringify(favBays);
    localStorage.setItem('baysFav', JSON.stringify(favBays));
    $scope.favAdd = false;
    $scope.favDelete = true;
  };

  $scope.deleteFav = function() {
    // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
    var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
    favBays.bays.remove(bayIdGet);
    // window.localStorage['baysFav'] = JSON.stringify(favBays);
    localStorage.setItem('baysFav', JSON.stringify(favBays));
    $scope.favAdd = true;
    $scope.favDelete = false;
  };
  
  // $routeParams.baySlug
  // var bayInfo = baysData.getSelectedBay();
  var bayInfo = {'name' : 'Valparaíso', 'slug': 'valparaiso'};
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
    // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
    var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
    $scope.favAdd = false;
    $scope.favDelete = false;
    if (favBays.bays.indexOf(bayInfo.slug) === -1) {
      $scope.favAdd = true;
      $scope.favDelete = false;
    }

    // call $anchorScroll()
    setTimeout(function(){
      if($("#current_day_scroll").offset() !== undefined) {
        var altoScroll = parseInt($("#current_day_scroll").offset().top) - 100;
        $(".page__content").animate({scrollTop:altoScroll}, '500', 'swing', function() {
        });
      }
    }, 500);
  });
  
})

.controller('favoritesController', function($scope, $location, baysData) {
  angular.element("#nav").removeClass("show");

  // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  var favBaysList = [];
  // var allBays = JSON.parse(window.localStorage['allBays']);
  // var allBays = JSON.parse(localStorage.getItem('allBays'));

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
	//Helper setttings ONS
	// ons.ready(function() {
 //    // if (window.localStorage['moonPhaseNotif'] === 'true') {
	// 	if (localStorage.getItem('moonPhaseNotif') === 'true') {
	// 		$("#moonPhaseNotif").attr('checked', 'checked');
	// 	}

 //    // if (window.localStorage['weekendNotif'] === 'true') {
	// 	if (localStorage.getItem('weekendNotif') === 'true') {
	// 		$("#weekendNotif").attr('checked', 'checked');
	// 	}
	// });

  //function listener notificacion fin de semana por bahia/puerto
  $scope.bayChanged = function(itemBay, itemBayState, itemBayName){
    if (itemBayState === true) {
      if (baysNotif.bays.indexOf(itemBay) === -1) {
        baysNotif.bays.push(itemBay);
      }
      //Set local notifications weekend by Bay
      setNotifBaysWeekend(itemBay, itemBayName);
    } else {
      baysNotif.bays.remove(itemBay);
      //Delete all notif weekend by Bay
      deleteNotifWeekendByBay(itemBay);
    }
    // window.localStorage['weekendNotifBays'] = JSON.stringify(baysNotif);
    localStorage.setItem('weekendNotifBays', JSON.stringify(baysNotif));
  }

  $scope.moonPhaseChange = function(itemBayState){
    localStorage.setItem('moonPhaseNotif', itemBayState);
    //Set local notifications
    setNotifMoonPhase(itemBayState);
  }

  $scope.weekendChange = function(itemWeekendState){
    localStorage.setItem('weekendNotif', itemWeekendState);

    $scope.listBayNotif = itemWeekendState;
    if (itemWeekendState === false) {
      //Delete all notif weekend
      deleteAllNotifWeekend();
    }
  }

  // if (localStorage.getItem('moonPhaseNotif') === 'true') {
  //    $scope.moonChk = true;
  // } else {
  //   $scope.moonChk = false;
  // }
  
  // if (localStorage.getItem('weekendNotif') === 'true') {
  //   $scope.weekendChk = true;
  // } else {
  //   $scope.weekendChk = false;
  // }

  // /**
  // * 
  // * Web local storage, preferencias usuarios notificaciones
  // **/
  // // $scope.listBayNotif   = window.localStorage['weekendNotif'] === "true" ? true : false;
  // $scope.listBayNotif 	= localStorage.getItem('weekendNotif') === "true" ? true : false;
  
  // /**
  // * 
  // * Web local storage, arreglo de bahias favoritas con notificacion
  // **/
  // // var baysNotif = window.localStorage['weekendNotifBays'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['weekendNotifBays']);
  // var baysNotif = localStorage.getItem('weekendNotifBays') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('weekendNotifBays'));

  // *
  // * 
  // * Lista de favoritos para notificaciones
  // *
  // // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  // var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  // var favBaysList = { "bays" : [] };
  // // var allBays = JSON.parse(window.localStorage['allBays']);
  // var allBays = JSON.parse(localStorage.getItem('allBays'));

  // angular.forEach(allBays.bays, function(val, key) {
  //   if (favBays.bays.indexOf(val.file) !== -1)
  //     favBaysList.bays.push(val);
  // });
  
  // var favsState = [];
  // var checkedBay;
  // angular.forEach(favBaysList.bays, function(val, key) {
  //   //Busca la bahia en el arreglo local
  //   if (baysNotif.bays.indexOf(val.file) !== -1)
  //     checkedBay = true;
  //   else
  //     checkedBay = false;
  //   favsState.push({bay: val, checked: checkedBay});
  // });
  // $scope.baysAll = favsState;
});