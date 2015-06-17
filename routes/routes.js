(function (moduleId, valueId, ng) {
    'use strict';

    var value = [
        {
            url: '/',
            config: {
                controller: 'main as vm',
                templateUrl: 'templates/main.html'
            }
        }
    ];

    ng.module(moduleId).constant(valueId, value);

})(appName, 'routes', angular)
