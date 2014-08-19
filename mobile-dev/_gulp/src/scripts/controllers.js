'use strict';

/* Controllers */
angular.module('controllers', [])


.controller('homeController', function($scope, $ionicSideMenuDelegate, $ionicLoading, baysList) {


  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  baysList.getAll(function(results) {
    $scope.baysAll = results.bays;
    $ionicLoading.hide();
  });
})

.controller('BayController', function($scope, $stateParams, $ionicLoading, bayDetail) {
  console.log($stateParams);

  $scope.nameBay = $stateParams.bayId;

  $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 500
  });

  bayDetail.getBay($stateParams.bayId).then(function(results) {   
    console.log(results);
    $ionicLoading.hide();
  });
  
});