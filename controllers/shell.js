(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$location',
        '$route',
        '$scope',
        controller
    ]);

    function controller($location, $route, $scope) {
        var vm = this;

        vm.isActive = function(route) {
            return route === $location.path();
        };

        vm.route = $route.current.settings;
        vm.routes = [];
        ng.forEach($route.routes, function (config, route) {
            var settings = config.settings;
            if (settings) {
                settings.route = route;
                vm.routes.push(settings);
            }
        });

        $scope.$on('$routeChangeStart', function(e, next) { 
            vm.route = next.settings;
        });
    }

})(appName, 'shell', angular);