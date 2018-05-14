var buttons = {
    twitter: 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible',
    facebook: '._4-u2.mbm._4mrt._5v3q._4-u8 form .UFILikeLink[data-testid=fb-ufi-likelink]',
    linkedin: '.ember-view article .feed-shared-social-action-bar button.like-button',
    instagram: '.coreSpriteHeartOpen'
}

var app = angular.module('app', ["ngRoute"]);
app.controller('app', function($scope) {
    $scope.settings = {}
    $scope.nav = 'facebook';
    $scope.disabled = !0;

    chrome.storage.sync.get("settings", function (obj) {
        console.log(obj.settings)
        if(obj.settings){
            $scope.settings = obj.settings
            $scope.$apply()
        }
    });

    $scope.save = function(){
        chrome.storage.sync.set({"settings": $scope.settings})
        chrome.runtime.sendMessage({ act: 'run', data: $scope.settings });
    }
    $scope.run = function(e){
        chrome.runtime.sendMessage({ act: 'run-'+e });
    }

});

app.config(function($routeProvider) {
    $routeProvider
    .when("/facebook", {
        templateUrl : "../assets/facebook.html"
    })
    .when("/twitter", {
        templateUrl : "../assets/twitter.html"
    })
    .when("/linkedin", {
        templateUrl : "../assets/linkedin.html"
    })
    .when("/instagram", {
        templateUrl : "../assets/instagram.html"
    })
    .otherwise({
        templateUrl : "../assets/facebook.html"
    });;
});