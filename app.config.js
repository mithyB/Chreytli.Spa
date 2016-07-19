(function (moduleId, ng) {
    'use strict';

    ng.module(moduleId).config([
        '$routeProvider',
        '$locationProvider',
        'routes',
        config]);

    function config($routeProvider, $locationProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        // $locationProvider.html5Mode(true);
    }

})(appName, angular);
