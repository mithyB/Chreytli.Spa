(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        'accountService',
        controller
    ]);

    function controller(accountService) {
        /*jshint validthis:true */
        var vm = this;

        vm.profile = accountService.getAccount();
        vm.profile.createDate = moment(vm.profile.createDate);
    }

})(appName, 'profile', angular);