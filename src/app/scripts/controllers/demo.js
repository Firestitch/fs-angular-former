'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsFormer) {

  	$scope.download = function() {
  		fsFormer.submit('http://boilerplate.local.firestitch.com/api/dummy/download', {}, {});
  	}

});
