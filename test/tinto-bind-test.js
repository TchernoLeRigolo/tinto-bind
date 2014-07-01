'use strict';

angular.module('TintoBindTest', ['TintoBind'])
	.controller('TintoBindTestController', function($timeout, $scope) {
		$scope.feed = [];
		$scope.reset = function(newV) {
			newV = newV || 10;
			if (newV < $scope.feed.length) {
				$scope.feed.splice(newV, $scope.feed.length-newV);
			} else {
				var L = $scope.feed.length;
				for (var i=L;i < newV;i++) {
					var item = {id: i};
					item.properties = {};

					for (var j=1; j < 20; j++) {
						var v = j < 10 ? '0' + j: j;
						item.properties['property' + v] = j;
						item.when = new Date();
					}
	
					$scope.feed.push(item);
				}
			}

			$timeout(function() {
				$scope.watchers = countWatchers(angular.element(document.body));
			}, 10);
		}
		$scope.$watch('rows',$scope.reset);
		$scope.$watch('mode', $scope.reset);
		$scope.rows = 10;
		

		var countWatchers = function(root) {
			var watchers = [];

		    var f = function (element) {
		        if (element.data() && element.data().hasOwnProperty('$scope')) {
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

		
		$scope.editItem = function(item) {
			for (var k in item.properties) {
				item.properties[k] = ++item.properties[k];
			}
			item.when = new Date();
		}

		$scope.picture  = 'https://gp3.googleusercontent.com/-O1DdovdVaJQ/AAAAAAAAAAI/AAAAAAAAABs/SHG409tnXZQ/s48-c-k-no/photo.jpg';

		$scope.htmlTest = '<span class="test" style="color:red">This is html</span>';
	})
