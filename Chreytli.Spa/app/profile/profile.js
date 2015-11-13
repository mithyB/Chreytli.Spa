(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$http',
        '$location',
        'globalConfig',
        'accountService',
        controller
    ]);

    function controller($http, $location, globalConfig, accountService) {
        /*jshint validthis:true */
        var vm = this;

        accountService.onAccountLoaded(function (account) {
            if (account) {
                vm.profile = account;
                vm.profile.createDate = moment(vm.profile.createDate);
            } else {
                $location.path('');
            }
        });

        vm.updateEmail = function () {
            $http.post(globalConfig.apiUrl + 'Account/ChangeEmail?newEmail=' + vm.profile.email, {}, {
                headers: {
                    authorization: localStorage.getItem('access_token')
                }
            }).success(function (result) {
                vm.successMessage = 'Your profile has been updated.';
            }).error(function (error, message) {
                vm.successMessage = 'Error: ' + message;
            });
        };

        vm.changePassword = function () {
            var data = {
                oldPassword: vm.updatedPassword.oldPassword,
                newPassword: vm.updatedPassword.newPassword,
                confirmPassword: vm.updatedPassword.confirmPassword
            };

            $http.post(globalConfig.apiUrl + 'Account/ChangePassword', vm.updatedPassword, {
                headers: {
                    authorization: localStorage.getItem('access_token')
                }
            }).success(function (result) {
                vm.successMessage = 'Your profile has been updated.';
            }).error(function (error, message) {
                vm.successMessage = 'Error: ' + message;
            });
        };
    }

})(appName, 'profile', angular);