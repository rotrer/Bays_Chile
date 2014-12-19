'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, baysList) {
	$scope.loadBay = function(bayID) {
	  // window.localStorage['currentBay'] = bayID;
    localStorage.setItem('currentBay', bayID);
    $scope.ons.navigator.pushPage('partials/bay.html');
  };

  baysList.getAll().then(function(results) {
    // window.localStorage['allBays'] = JSON.stringify(results);
    localStorage.setItem('allBays', JSON.stringify(results));
    $scope.baysAll = results;
    $("#loadingApp").fadeOut();
  });

})

.controller('BayController', function($scope, $location, $routeParams, bayDetail) {
  $scope.baySlug = $routeParams.baySlug;
  console.log($scope.baySlug);

  // var bayIdGet = window.localStorage['currentBay'];
	// var bayIdGet = localStorage.getItem('currentBay');

  // $scope.addFav = function() {
  //   // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  //   var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  //   favBays.bays.push(bayIdGet);
  //   // window.localStorage['baysFav'] = JSON.stringify(favBays);
  //   localStorage.setItem('baysFav', JSON.stringify(favBays));
  //   $scope.favAdd = false;
  //   $scope.favDelete = true;
  // };

  // $scope.deleteFav = function() {
  //   // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  //   var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  //   favBays.bays.remove(bayIdGet);
  //   // window.localStorage['baysFav'] = JSON.stringify(favBays);
  //   localStorage.setItem('baysFav', JSON.stringify(favBays));
  //   $scope.favAdd = true;
  //   $scope.favDelete = false;
  // };

  // bayDetail.getBay(bayIdGet).then(function(results) {
  //   $scope.nameBay = results.name;
  //   //Mes actual de bahí seleccionada
  //   var todayClass = '';
  //   var items = [];
  //   var fechas = results.data;
  //   var currentMonth = parseInt(new Date().getMonth());
  //   var currentYear = new Date().getFullYear();
  //   var monthToEvCurrent = 0,
  //       monthToEvMinusCt = 0;

  //       //Mes actual menos uno para forma JS 0-11
  //       monthToEvCurrent = currentMonth;
  //       //Excepciones para primer mes del año
  //       if (monthToEvCurrent === 0) {
  //         monthToEvMinusCt = 11;
  //       } else {
  //         monthToEvMinusCt = currentMonth - 1;
  //       }

  //   //
  //   // Calcula fase lunar, arreglo correcion mes
  //   //
  //   var fixMonth = { "m1": 0, "m2": 1, "m3": 0, "m4": 1, "m5": 2, "m6": 3, "m7": 4, "m8": 5, "m9": 6, "m10": 7, "m11": 8, "m12": 9 };
  //   var moonPhase = { "nm" : ["Nueva", "new_moon.png"], "fq" : ["Creciente", "first_quarter.png"], "fm" : ["Llena", "full_moon.png"], "lq" : ["Menguante", "last_quarter.png"]};
   
  //   angular.forEach(fechas, function(val, key) {
  //     var monthStr = key.trim().split("-"),
  //         monthNumber = parseInt(monthStr[1]),
  //         monthToEv = 0,
  //         monthToEvMin = 0;

  //         //Fix raro :/
  //         var tmpMonthYear8 = currentYear + "-08";
  //         var tmpMonthYear9 = currentYear + "-09";
  //         if (key == tmpMonthYear8)
  //         {
  //           monthNumber = 8;
  //         }
  //         else if (key == tmpMonthYear9)
  //         {
  //           monthNumber = 9;
  //         }

  //         //Mes actual menos uno para forma JS 0-11
  //         monthToEv = monthNumber - 1;
  //         //Excepciones para primer mes del año
  //         if (monthToEv === 0) {
  //           monthToEvMin = 11;
  //           monthToEv = 0;
  //         } else {
  //           monthToEvMin = monthNumber - 2;
  //         }
      
  //     if (
  //         monthToEvCurrent === monthToEv ||
  //         monthToEvMinusCt === monthToEvMin
  //         ) 
  //     {
  //       angular.forEach(val, function(valDay, keyDay) {
  //         var dateTide = keyDay.split("-");
  //         var mesInt = parseInt(dateTide[1]);
  //         var dayInt = parseInt(dateTide[0]);
  //         var today = new Date();
  //         var mm = today.getMonth()+1;
          
  //         //Fix raro :/
  //         if (dateTide[1] == "08")
  //         {
  //           mesInt = 8;
  //         }
  //         else if (dateTide[1] == "09")
  //         {
  //           mesInt = 9;
  //         }
  //         if (mesInt === mm) {
  //           //
  //           // Calcula fase lunar
  //           //
  //           var monthCorr = "m" + mesInt;
  //           var nroAureo = (parseInt(dateTide[2]) + 1) % 19;
  //           var epacta = (nroAureo - 1) * 99;
  //           var edadLunar = epacta + parseInt(fixMonth[monthCorr]) + dayInt;
  //           var moonPhaseDay = '';
  //           var moonPhaseDayImg = '';
  //           //Correción si es mayor a 30 edad lunar
  //           if (edadLunar > 30)
  //             edadLunar = edadLunar - 30;
            
  //           //Fases Lunares según edad lunar
  //           if (edadLunar >= 0 && edadLunar <= 6) {
  //             moonPhaseDay = moonPhase.nm[0];
  //             moonPhaseDayImg = moonPhase.nm[1];
  //           } else if (edadLunar >= 7 && edadLunar <= 13) {
  //             moonPhaseDay = moonPhase.fq[0];
  //             moonPhaseDayImg = moonPhase.fq[1];
  //           } else if (edadLunar >= 14 && edadLunar <= 21) {
  //             moonPhaseDay = moonPhase.fm[0];
  //             moonPhaseDayImg = moonPhase.fm[1];
  //           } else if (edadLunar >= 22) {
  //             moonPhaseDay = moonPhase.lq[0];
  //             moonPhaseDayImg = moonPhase.lq[1];
  //           }
            
  //           //Destacar dia actual de marea
  //           if (today.getDate() === dayInt) {
  //             todayClass = "today_tide";
  //           } else {
  //             todayClass = "";
  //           }
            
  //           var hasH4th = 0;
  //           if (valDay.hasOwnProperty("h4th")) {
  //             hasH4th = 1;
  //           }
            
  //           this.push({data: valDay, todayClass: todayClass, dayInt: dayInt, keyDay: keyDay, moonPhaseDay: moonPhaseDay, moonPhaseDayImg: moonPhaseDayImg, hasH4th: hasH4th});
  //         }
  //       }, items);
  //     }
  //   });

  //   $scope.itemDays = items;

  //   // call $anchorScroll()
  //   setTimeout(function(){
  //     if($("#current_day_scroll").offset() !== undefined) {
  //     	var altoScroll = parseInt($("#current_day_scroll").offset().top) - 100;
  // 			$(".page__content").animate({scrollTop:altoScroll}, '500', 'swing', function() {
  // 			});
  //     }
  //   }, 500);
  // });
  
  //Obtener estado de favorito bahía
  //
  // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  // var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  // $scope.favAdd = false;
  // $scope.favDelete = true;
  // if (favBays.bays.indexOf(bayIdGet) === -1) {
  //   $scope.favAdd = true;
  //   $scope.favDelete = false;
  // }
  
})

.controller('favoritesController', function($scope) {
  // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  var favBaysList = { "bays" : [] };
  // var allBays = JSON.parse(window.localStorage['allBays']);
  var allBays = JSON.parse(localStorage.getItem('allBays'));

  angular.forEach(allBays.bays, function(val, key) {
    if (favBays.bays.indexOf(val.file) !== -1)
      favBaysList.bays.push(val);
  });
  
  $scope.baysAll = favBaysList.bays;

  $scope.loadBay = function(bayID) {
	  // window.localStorage['currentBay'] = bayID;
    localStorage.setItem('currentBay', bayID);
    $scope.ons.navigator.pushPage('partials/bay.html');
  };

})

.controller('settingsController', function($scope) {
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
  if (localStorage.getItem('moonPhaseNotif') === 'true') {
     $scope.moonChk = true;
  } else {
    $scope.moonChk = false;
  }

  $scope.weekendChange = function(itemWeekendState){
    localStorage.setItem('weekendNotif', itemWeekendState);

    $scope.listBayNotif = itemWeekendState;
    if (itemWeekendState === false) {
      //Delete all notif weekend
      deleteAllNotifWeekend();
    }
  }
  if (localStorage.getItem('weekendNotif') === 'true') {
    $scope.weekendChk = true;
  } else {
    $scope.weekendChk = false;
  }

  /**
  * 
  * Web local storage, preferencias usuarios notificaciones
  **/
  // $scope.listBayNotif   = window.localStorage['weekendNotif'] === "true" ? true : false;
  $scope.listBayNotif 	= localStorage.getItem('weekendNotif') === "true" ? true : false;
  
  /**
  * 
  * Web local storage, arreglo de bahias favoritas con notificacion
  **/
  // var baysNotif = window.localStorage['weekendNotifBays'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['weekendNotifBays']);
  var baysNotif = localStorage.getItem('weekendNotifBays') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('weekendNotifBays'));

  /**
  * 
  * Lista de favoritos para notificaciones
  **/
  // var favBays = window.localStorage['baysFav'] === null ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  var favBays = localStorage.getItem('baysFav') === null ? { "bays" : [] } : JSON.parse(localStorage.getItem('baysFav'));
  var favBaysList = { "bays" : [] };
  // var allBays = JSON.parse(window.localStorage['allBays']);
  var allBays = JSON.parse(localStorage.getItem('allBays'));

  angular.forEach(allBays.bays, function(val, key) {
    if (favBays.bays.indexOf(val.file) !== -1)
      favBaysList.bays.push(val);
  });
  
  var favsState = [];
  var checkedBay;
  angular.forEach(favBaysList.bays, function(val, key) {
    //Busca la bahia en el arreglo local
    if (baysNotif.bays.indexOf(val.file) !== -1)
      checkedBay = true;
    else
      checkedBay = false;
    favsState.push({bay: val, checked: checkedBay});
  });
  $scope.baysAll = favsState;
});