'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsFormer) {

  	$scope.download = function() {
  		fsFormer.submit('http://service.local.firestitch.com/api/dummy', {}, {});
  	}

});
