var appName = 'Chreytli.Spa';

(function (moduleId, ng) {
    'use strict';

    var app = ng.module(moduleId, [
        'ngRoute',
        module
    ]);

    function module() {

    }

    app.run([
        '$route',
        main
    ]);

    function main($route) {
        $route.reload();
    }

})(appName, angular);