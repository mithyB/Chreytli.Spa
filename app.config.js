(function (moduleId, valueId, ng) {
    'use strict';

    var value = {
        apiUrl: 'http://chreytli.noip.me/Chreytli.Api/api/',
        tokenUrl: 'http://chreytli.noip.me/Chreytli.Api/token'
    };

    ng.module(moduleId).value(valueId, value);

})(appName, 'globalConfig', angular)
