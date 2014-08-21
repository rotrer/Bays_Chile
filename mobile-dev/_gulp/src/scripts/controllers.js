'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, $ionicSideMenuDelegate, $ionicLoading, baysList) {

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.loadingIndicator = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i>',
      delay: 100
  });

  baysList.getAll().then(function(results) {
    window.localStorage['allBays'] = JSON.stringify(results);
    $scope.baysAll = results.bays;
    $ionicLoading.hide();
  });
})

.controller('BayController', function($scope, $stateParams, $ionicLoading, bayDetail) {

  $scope.loadingIndicator = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i>',
      delay: 100
  });

  $scope.addFav = function() {
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i>',
        delay: 50
    });

    var favBays = window.localStorage['baysFav'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
    favBays.bays.push($stateParams.bayId);
    window.localStorage['baysFav'] = JSON.stringify(favBays);
    $scope.favAdd = false;
    $scope.favDelete = true;
    setTimeout(function(){
      $ionicLoading.hide();
    }, 1000);
  };

  $scope.deleteFav = function() {
    $scope.loadingIndicator = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i>',
      delay: 50
    });

    var favBays = window.localStorage['baysFav'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
    favBays.bays.remove($stateParams.bayId);
    window.localStorage['baysFav'] = JSON.stringify(favBays);
    $scope.favAdd = true;
    $scope.favDelete = false;
    setTimeout(function(){
      $ionicLoading.hide();
    }, 1000);
  };

  bayDetail.getBay($stateParams.bayId).then(function(results) {
    $scope.nameBay = results.name;
    //Ocular loading
    $ionicLoading.hide();
    //Mes actual de bahí seleccionada
    var todayClass = '';
    var items = [];
    var fechas = results.data;
    var currentMonth = parseInt(new Date().getMonth());
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
   
    angular.forEach(fechas, function(val, key) {
      var monthStr = key.split("-"),
          monthNumber = parseInt(monthStr[1]),
          monthToEv = 0,
          monthToEvMin = 0;

          //Mes actual menos uno para forma JS 0-11
          monthToEv = monthNumber - 1;
          //Excepciones para primer mes del año
          if (monthToEv === 0) {
            monthToEvMin = 11;
            monthToEv = 0;
          } else {
            monthToEvMin = monthNumber - 2;
          }
          
      if (
          monthToEvCurrent === monthToEv ||
          monthToEvMinusCt === monthToEvMin
          ) {

        angular.forEach(val, function(valDay, keyDay) {
          var dateTide = keyDay.split("-");
          var mesInt = parseInt(dateTide[1]);
          var dayInt = parseInt(dateTide[0]);
          var today = new Date();
          var mm = today.getMonth()+1;
          
          if (mesInt === mm) {
            /*
            * Calcula fase lunar
            */
            var monthCorr = "m" + mesInt;
            var nroAureo = (parseInt(dateTide[2]) + 1) % 19;
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
            
            var hasH4th = false;
            if (valDay.hasOwnProperty("h4th")) {
              hasH4th = true;
            }
            this.push({data: valDay, todayClass: todayClass, dayInt: dayInt, keyDay: keyDay, moonPhaseDay: moonPhaseDay, moonPhaseDayImg: moonPhaseDayImg, hasH4th: hasH4th});
          }
        }, items);
      }
    });
    $scope.itemDays = items;

  });
  
  //Obtener estado de favorito bahía
  var favBays = window.localStorage['baysFav'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  $scope.favAdd = false;
  $scope.favDelete = true;
  if (favBays.bays.indexOf($stateParams.bayId) === -1) {
    $scope.favAdd = true;
    $scope.favDelete = false;
  }

  
})

.controller('favoritesController', function($scope, $ionicLoading) {
  notifScheduledLog();

  var favBays = window.localStorage['baysFav'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  var favBaysList = { "bays" : [] };
  var allBays = JSON.parse(window.localStorage['allBays']);

  angular.forEach(allBays.bays, function(val, key) {
    if (favBays.bays.indexOf(val.file) !== -1)
      favBaysList.bays.push(val);
  });
  
  $scope.baysAll = favBaysList.bays;

})

.controller('settingsController', function($scope, $ionicLoading) {
  //function listener notificacion cambio de luna
  $scope.moonPhaseChange = function() {
    $scope.moonPhaseNotif = ! $scope.moonPhaseNotif;
    window.localStorage['moonPhaseNotif'] = $scope.moonPhaseNotif;
    //Set local notifications
    setNotifMoonPhase($scope.moonPhaseNotif);
  };

  //function listener notificacion fin de semana
  $scope.weekendChange = function() {
    $scope.weekendNotif = ! $scope.weekendNotif;
    window.localStorage['weekendNotif'] = $scope.weekendNotif;

    if ($scope.weekendNotif === true) {
      $scope.listBayNotif = true;
    } else {
      $scope.listBayNotif = false;
      //Delete all notif weekend
      deleteAllNotifWeekend();
    }
  };

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
    window.localStorage['weekendNotifBays'] = JSON.stringify(baysNotif);
  }

  /**
  * 
  * Web local storage, preferencias usuarios notificaciones
  **/
  $scope.moonPhaseNotif = window.localStorage['moonPhaseNotif'] === "true" ? true : false;
  $scope.weekendNotif = window.localStorage['weekendNotif'] === "true" ? true : false;
  $scope.listBayNotif = window.localStorage['weekendNotif'] === "true" ? true : false;
  
  /**
  * 
  * Web local storage, arreglo de bahias favoritas con notificacion
  **/
  var baysNotif = window.localStorage['weekendNotifBays'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['weekendNotifBays']);

  /**
  * 
  * Lista de favoritos para notificaciones
  **/
  var favBays = window.localStorage['baysFav'] === undefined ? { "bays" : [] } : JSON.parse(window.localStorage['baysFav']);
  var favBaysList = { "bays" : [] };
  var allBays = JSON.parse(window.localStorage['allBays']);

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