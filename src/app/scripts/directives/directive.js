(function () {
    'use strict';

    angular.module('fs-angular-former',['fs-angular-alert'])
    .directive('fsFormer', function(fsFormer) {
 		return {
 			restrict: 'E',
	        scope: {
	        	path: '@fsPath',
	        	data: '=?fsData'
	        },
	        link: function($scope, element) {
	        	fsFormer.submit($scope.path,$scope.data,{ element: element });
	        }
	    }
    });
})();