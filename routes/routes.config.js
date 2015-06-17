(function (moduleId, ng) {
    'use strict';

    ng.module(moduleId).config([
        '$routeProvider',
        'routes',
        config]);

    function config($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

})(appName, angular)