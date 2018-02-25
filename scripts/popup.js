var app = angular.module('app', []);
app.controller('app', function($scope) {
    $scope.title = 'Liker'
    $scope.params = {
        task: 'start',
        interval: 4,
        pause: 50,
        resume: 60,
        estimated: '...'
    }
    $scope.estimated = '...';


	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { task: "count" }, function(response) {
            $scope.params.estimated = response.count;
            $scope.$apply()
        });

        $scope.start = function() {
        	chrome.tabs.sendMessage(tabs[0].id, $scope.params);
        }
	});

});