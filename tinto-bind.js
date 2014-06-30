'use strict';

/* TODO: allow for some options (removeToInsertLater, etc...) */

angular.module('TintoBind', ['ngSanitize'])
	.directive('tintoBind', function() {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function() {
					$element.text($scope.$eval($attrs.tintoBind));
				});
			}
		};
	})
	.directive('tintoBindHtml', function($sanitize) {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function() {
					$element.html($sanitize($scope.$eval($attrs.tintoBindHtml)));
				});
			}
		};
	})

	.directive('tintoSrc', function($interpolate) {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function() {
					var src = $attrs.tintoSrc.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
					$element.attr('src', $interpolate(src)($scope));
				});
			}
		};
	})

	.directive('tintoHref', function($interpolate) {
		return {
			require: '^tintoWatch',
			restrict: 'A',
			scope: false,
			link: function($scope, $element, $attrs, tintoWatch) {
				tintoWatch.add(function() {
					var href = $attrs.tintoHref.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
					$element.attr('href', $interpolate(href)($scope));
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
				tintoWatch.add(function() {
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
				tintoWatch.add(function() {
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
				tintoWatch.add(function() {
					var value = $scope.$eval($attrs.tintoClass);
					for (var v in value) $element.toggleClass(v, value[v]);
				});
			}
		};
	})
	.directive('tintoWatch', function() {
		/* reduce the DOM redraws by removing the element prior to updates and adding it back after*/	
		var removeToInsertLater = function(element) {
			var e = element[0], p = e.parentNode, n = e.nextSibling;
			p.removeChild(e);

			return function() {
				n ? p.insertBefore(e, n): p.appendChild(e);
			};
		}
		
		return {
			restrict: 'A',
			controller: function() {
				var appliers = [];
				this.add = function(f) {
					appliers.push(f);
				}
		
				this.apply = function() {
					appliers.forEach(function(f) {
						f();
					});
				}
			},
			link: function($scope, $element, $attrs, ctrl) {
				var doWatch = function(exp) {
					$scope.$watch(exp.trim(), function() {
						var reinsert = ctrl.$removeToInsertLater($element);
						ctrl.apply();
						reinsert();
					}, true);	
				}
				if ($attrs.tintoWatch.indexOf(',') > -1) {
					$attrs.tintoWatch.split(',').forEach(doWatch);
				} else {
					doWatch($attrs.tintoWatch);
				}
			}
		}
	})
