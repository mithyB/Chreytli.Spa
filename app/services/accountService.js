(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).service(serviceId, [
        service
    ]);

    function service() {
        var account;
        var accountLoaded;
        var accountSet = false;

        return {
            getAccount: function () {
                return account;
            },
            setAccount: function (v) {
                account = v;
                accountSet = true;

                if (accountLoaded) {
                    accountLoaded(account);
                }
            },
            resetAccount: function () {
                accountSet = false;
            },
            onAccountLoaded: function (action) {
                if (accountSet) {
                    action(account);
                } else {
                    accountLoaded = action;
                }
            }
        }
    }

})(appName, 'accountService', angular);
