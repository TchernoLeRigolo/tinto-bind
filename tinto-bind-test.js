'use strict';

angular.module('TintoBindTest', ['TintoBind'])
	.controller('TintoBindTestController', function($scope) {
		$scope.feed = [];

		for (var i=0;i< 100;i++) {
			var item = {id: i};
			for (var j=1; j < 20; j++) item['property' + j] = '' + (i < 10 ? '0': '')  + i + ':' + (j < 10 ? '0': '') + j ; 

			$scope.feed.push(item);
		}

		var countWatchers = function(root) {
			var watchers = [];

		    var f = function (element) {
		        if (element.data().hasOwnProperty('$scope')) {
		            angular.forEach(element.data().$scope.$$watchers, function (watcher) {
		                watchers.push(watcher);
		            });
		        }

		        angular.forEach(element.children(), function (childElement) {
		            f(angular.element(childElement));
		        });
		    };

		    f(root);

		   alert(watchers.length);
		}

		$scope.countWatchers = function(elemId) {
			countWatchers(angular.element(document.getElementById(elemId)));
		}

		$scope.doChange = function() {
			var index = Math.round(Math.random() * $scope.feed.length);
			for (var k in $scope.feed[index]) {
				$scope.feed[index][k] = 'changed';
			}
		}
	})