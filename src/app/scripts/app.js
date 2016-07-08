'use strict';

angular
.module('app', [
    'config',
    'ui.router',
    'ngMaterial',
    'fs-angular-former'
])
.config(function ($stateProvider, $urlRouterProvider, fsFormerProvider) {

    $urlRouterProvider
    .otherwise('/404')
    .when('', '/demo')
    .when('/', '/demo');

    $stateProvider
    .state('demo', {
        url: '/demo',
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl'
    })

    .state('404', {
        templateUrl: 'views/404.html',
        controller: 'DemoCtrl'
    });

    //fsFormerProvider.options({ url: CONFIG.api.url });
    fsFormerProvider.options({ url: '/api' });
})
.run(function ($rootScope, BOWER, fsFormer) {
    $rootScope.app_name = BOWER.name;


    fsFormer.on("begin",function(data, options) {
        /*
        var token = sessionService.token();
        if(token)
            data['api-key'] = token.key;
        */
    });
});
