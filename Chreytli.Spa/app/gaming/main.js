(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        controller
    ]);

    function controller($scope) {
        /*jshint validthis:true */
        var vm = this;

        
    }

})(appName, 'main', angular);