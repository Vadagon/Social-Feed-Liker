var s = {};
var d = {
  features: [
    'Pool Jobs',
    'Follow Settings',
    'UnFollow Settings',
    'Auto Likes',
    'Auto Comments',
    'Statistics',
    'Settings'
  ]
}
angular.module('App', ['ngMaterial', 'ngRoute'])
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, $route, $routeParams, $location, $mdToast) {
    sGet((e)=>{ $scope.s = e; $scope.$apply(); console.log(e); })
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.features = d.features;

    $scope.toggleLeft = function(){
  		$mdSidenav('left').toggle();
  	};
    $scope.provide = function(e){
      window.location.hash = "!/"+e;
    }
    $scope.save = function(){
      sSet({type: 'settings', obj: $scope.s.settings}, function(e){

        $mdToast.show(
          $mdToast.simple()
            .textContent(e?'Saved!':'Error!')
            .hideDelay(3000)
        );

      })
    }





  })
 .config(function($routeProvider) {

    d.features.forEach(function(el){
      $routeProvider.when("/"+el, {
        templateUrl : "/temp/"+el+".htm"
      })
    })
    
    $routeProvider.when("/", {
        templateUrl : "/temp/index.htm"
    }).otherwise({redirectTo : "/"});

 })

function sGet(cb){
  chrome.storage.local.get('data', function(items){
      cb(items.data)
  })
}
function sSet(e, cb){
  chrome.extension.sendMessage(e, function(res){
    cb(res)
  })
}