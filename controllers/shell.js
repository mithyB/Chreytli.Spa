(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$location',
        '$route',
        '$scope',
        '$http',
        '$filter',
        'globalConfig',
        'accountService',
        controller
    ]);

    function controller($location, $route, $scope, $http, $filter, globalConfig, accountService) {
        var vm = this;

        vm.isActive = function(route) {
            return route === $location.path();
        };

        vm.serverUnreachable = false;
        vm.loading = true;
        vm.route = $route.current.settings;
        vm.routes = [];
        ng.forEach($route.routes, function (config, route) {
            var settings = config.settings;
            if (settings) {
                settings.route = route;
                vm.routes.push(settings);
            }
        });

        $scope.$on('$routeChangeStart', function(e, next) { 
            vm.route = next.settings;
        });

        var access_token = localStorage.getItem('access_token');
        if (access_token) {
            getUserInfo(access_token);
        } else {
            accountService.resetAccount();
        }

        vm.register = function () {
            var data = {
                Username: vm.login.username,
                Email: vm.login.email,
                Password: vm.login.password,
                ConfirmPassword: vm.login.confirmPassword
            }

            $http.post(globalConfig.apiUrl + 'Account/Register', data).success(function (result) {
                delete vm.registerError;
                vm.login();
                $('#registerModal').modal('hide');
            }).error(function (error, message) {
                vm.registerError = 'An error occured';
                if (error) {
                    var errors = error.modelState;
                    for (var e in errors) {
                        vm.registerError = errors[e][0];
                        break;
                    }
                }
            });
        };

        vm.login = function (usr, pwd) {
            var username = usr || vm.login.username;
            var password = pwd || vm.login.password;

            var data = {
                grant_type: 'password',
                userName: username,
                password: password
            };

            $.ajax({
                method: 'POST',
                url: globalConfig.tokenUrl,
                data: data
            }).done(function (result) {
                localStorage.setItem('access_token', result.token_type + ' ' + result.access_token);
                getUserInfo();
                $('#loginModal').modal('hide');
                $route.reload();
            }).error(function (error, message) {
                vm.loginError = 'An error occured';
                if (error) {
                    vm.loginError = JSON.parse(error.responseText).error_description;
                }
            });
        };

        vm.logout = function () {
            localStorage.removeItem('access_token');
            delete vm.account;
            accountService.resetAccount();
            $route.reload();
        };

        function getUserInfo(token) {
            var access_token = token || localStorage.getItem('access_token');
            $http.get(globalConfig.apiUrl + 'Account/UserInfo', {
                headers: {
                    authorization: access_token
                }
            }).success(function (result) {
                vm.account = result;
                accountService.setAccount(vm.account);
            }).error(function (error, message) {
                console.error(message);
                vm.logout();
            });
        }

        $http.get(globalConfig.metaUrl + 'TopScore').success(function (result) {
            vm.topUsers = result;
        }).then(function () {
            vm.loading = false;
        }, function (error) {
            vm.loading = false;
            vm.serverUnreachable = true;
        });

        $http.get(globalConfig.metaUrl + 'RecentRegistrations').success(function (result) {
            result = $filter('filter')(result, { createDate: '!!' });
            ng.forEach(result, function (x) {
                x.createDate = moment(x.createDate);
            });
            vm.registrations = result;
        });
    }

})(appName, 'shell', angular);