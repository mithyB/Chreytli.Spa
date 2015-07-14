(function (moduleId, valueId, ng) {
    'use strict';
    
    var baseUrl = 'http://chreytli.noip.me/Chreytli.Api/';
    //var baseUrl = 'http://localhost:53994/';
    var apiUrl = baseUrl + 'api/';
    var tokenUrl = baseUrl + 'token';
    var metaUrl = apiUrl + 'Meta/';

    var value = {
        baseUrl: baseUrl,
        apiUrl: apiUrl,
        tokenUrl: tokenUrl,
        metaUrl: metaUrl,

        postsPageSize: 4,
        pollsPageSize: 4
    };

    ng.module(moduleId).value(valueId, value);

})(appName, 'globalConfig', angular)
