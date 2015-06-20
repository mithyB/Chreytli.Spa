(function (moduleId, valueId, ng) {
    'use strict';

    var value = {
        apiUrl: 'http://localhost:53994/api/',
        tokenUrl: 'http://localhost:53994/token'
    };

    ng.module(moduleId).value(valueId, value);

})(appName, 'globalConfig', angular)
