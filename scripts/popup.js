var buttons = {
    twitter: 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible',
    facebook: '._4-u2.mbm._4mrt._5v3q._4-u8 form .UFILikeLink[data-testid=fb-ufi-likelink]',
    linkedin: '.ember-view article .feed-shared-social-action-bar button.like-button',
    instagram: '.coreSpriteHeartOpen'
}

var app = angular.module('app', []);
app.controller('app', function($scope) {
    $scope.disabled = !0;
    $scope.title = 'Liker'
    $scope.params = {
        task: 'start',
        interval: 4,
        pause: 50,
        resume: 60,
        estimated: '...'
    }

    chrome.storage.sync.get("paramses", function (obj) {
        console.log(obj.paramses)
        if(obj.paramses){
            $scope.params = obj.paramses
            $scope.$apply()
        }
    });


	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { params: {task: "count"}, buttons: buttons }, function(response) {
            if(response.count){
                console.log(response.count)
                $scope.params.estimated = response.count;
                $scope.disabled = !1;
                $scope.$apply()
                $scope.start = function() {
                    chrome.storage.sync.set({"paramses": $scope.params})
                    chrome.tabs.sendMessage(tabs[0].id, { params: $scope.params, buttons: buttons });
                }
            }
        });
    });


    chrome.runtime.onMessage.addListener(function(e){
        $scope.params.estimated = e.count;
        if($scope.params.estimated < 0)
            $scope.params.estimated = 0
        $scope.$apply()
    });

});