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

		   return watchers.length;
		}

		$scope.countWatchers = function(elemId) {
			return countWatchers(angular.element(document.getElementById(elemId)));
		}

		$scope.editItem = function(item) {
			for (var k in item) {
				if (k!=='id') item[k] = 'HAHA';
			}
		}

		$scope.htmlTest = '<span class="test" style="color:red">This is html</span>';
	})