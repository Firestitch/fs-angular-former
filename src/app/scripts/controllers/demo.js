'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsFormer) {

  	$scope.download = function() {
  		fsFormer.submit('http://boilerplate.local.firestitch.com/api/dummy/download', {}, {});
  	}

  	$scope.view = function() {
  		fsFormer.submit('http://tuition.local.firestitch.com/pdf?template=invoice&format=inlinepdf', {}, {});
  	}



});
