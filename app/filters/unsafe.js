(function (moduleId, filterId, ng) {
    'use strict';

    ng.module(moduleId).filter(filterId, [
        '$sce',
        filter
    ]);

    function filter($sce) {
        return function (s) {
            if (s) {
                return $sce.trustAsHtml(s);
                //return $sce.trustAsHtml($("<div/>").html(s).text());
            }
        }
    }

})(appName, 'unsafe', angular)