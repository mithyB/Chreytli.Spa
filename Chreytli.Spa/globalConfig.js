(function (moduleId, valueId, ng) {
    'use strict';

    //var baseUrl = 'http://api.chreyt.li/';
    //var baseUrl = 'http://chreyt.li/pre-release/Chreytli.Api/';
    var baseUrl = 'http://localhost:53994/';
    var apiUrl = baseUrl + 'api/';
    var tokenUrl = baseUrl + 'token';
    var metaUrl = apiUrl + 'Meta/';

    var value = {
        baseUrl: baseUrl,
        apiUrl: apiUrl,
        tokenUrl: tokenUrl,
        metaUrl: metaUrl,

        postsPageSize: 12,
        pollsPageSize: 12
    };

    ng.module(moduleId).value(valueId, value);

})(appName, 'globalConfig', angular);