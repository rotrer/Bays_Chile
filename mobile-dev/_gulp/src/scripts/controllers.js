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
    $scope.baysAll = results.bays;
    $ionicLoading.hide();
  });
})

.controller('BayController', function($scope, $stateParams, $ionicLoading, bayDetail) {

  $scope.nameBay = $stateParams.bayId;

  $scope.loadingIndicator = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i>',
      delay: 100
  });

  bayDetail.getBay($stateParams.bayId).then(function(results) {
    //Ocular loading
    $ionicLoading.hide();
    //Mes actual de bahí seleccionada
    var todayClass = '';
    var items = [];
    var fechas = results.data;
    /*
    * Calcula fase lunar, arreglo correcion mes
    */
    var fixMonth = { "m1": 0, "m2": 1, "m3": 0, "m4": 1, "m5": 2, "m6": 3, "m7": 4, "m8": 5, "m9": 6, "m10": 7, "m11": 8, "m12": 9 };
    var moonPhase = { "nm" : ["Nueva", "new_moon.png"], "fq" : ["Creciente", "first_quarter.png"], "fm" : ["Llena", "full_moon.png"], "lq" : ["Menguante", "last_quarter.png"]};
   
    angular.forEach(fechas, function(val, key) {
      if (key === '2014-07' || key === '2014-08') {
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

  $scope.addFav = function(bayId) {
    console.log(bayId);
    $scope.loadingIndicator = $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i>',
        delay: 50
    });
  }
  
});