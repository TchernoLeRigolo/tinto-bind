'use strict';

/*
TODO: 
- allow for some options (removeToInsertLater, etc...)
*/

angular.module('TintoBind', [])
	.directive('tintoBind', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.text($scope.$eval($attrs.tintoBind));
				});
			}
		};
	})
	//TODO user ng-sanitize !!
	.directive('tintoBindHtml', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.html($scope.$eval($attrs.tintoBindHtml));
				});
			}
		};
	})

	.directive('tintoSrc', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.attr('src', $scope.$eval($attrs.tintoSrc));
				});
			}
		};
	})

	.directive('tintoHref', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.attr('href', $scope.$eval($attrs.tintoHref));
				});
			}
		};
	})

	.directive('tintoShow', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.toggleClass('ng-hide', !$scope.$eval($attrs.tintoShow));
				});
			}
		};
	})

	.directive('tintoHide', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					$element.toggleClass('ng-hide', $scope.$eval($attrs.tintoShow));
				});
			}
		};
	})

	.directive('tintoClass', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function(item) {
					var value = $scope.$eval($attrs.tintoSrc);
					for (var v in value) $element.toggleClass(v, value[v]);
				});
			}
		};
	})

	.directive('tintoWatch', function() {
		/* reduce the DOM redraws by removing the element prior to updates and adding it back after*/	
		var removeToInsertLater = function(element) {
			var e = element[0];
			var p = e.parentNode;
			var n = e.nextSibling;
			p.removeChild(e);

			return function() {
				if (n) {
					p.insertBefore(e, n);
				} else {
					p.appendChild(e);
				}
			};
		}

		return {
			restrict: 'A',
			scope: false,
			controller: function() {
				var appliers = [];
				this.add = function(f) {
					appliers.push(f);
				}

				this.apply = function(item) {
					appliers.forEach(function(f) {
						f(item);
					});
				}
			},
			link: function($scope, $element, $attrs, ctrl) {
				$scope.$watch($attrs.tintoWatch, function(itm) {
					var reinsert = removeToInsertLater($element);
					ctrl.apply();
					reinsert();
				}, true);
			}
		}
	});