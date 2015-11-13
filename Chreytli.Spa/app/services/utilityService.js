(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).service(serviceId, [
        service
    ]);

    function service() {

        function isLoggedIn() {
            return (accountService.getAccount());
        }

        function isInRole(role) {
            var acc = accountService.getAccount();
            if (acc && acc.roles) {
                return acc.roles.indexOf(role) > -1;
            }
        }

        return {
            isLoggedIn: isLoggedIn,
            isInRole: isInRole
        };
    }

})(appName, 'utilityService', angular);
