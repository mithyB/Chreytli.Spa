(function (moduleId, directiveId, ng) {
    'use strict';

    ng.module(moduleId).directive(directiveId, [
        directive
    ]);

    function directive() {
        return {
            restrict: 'E',
            scope: {
                submissions: '='
            },
            templateUrl: 'app/directives/submissionsControl.html'
        };
    }

})(appName, 'submissionsControl', angular);