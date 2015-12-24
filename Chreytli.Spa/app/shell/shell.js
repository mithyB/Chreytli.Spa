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
        /*jshint validthis:true */
        var vm = this;

        vm.theme = {
            switch: function () {
                if (this.id === 0) {
                    this.id = 1;
                    this.display = 'Light mode';
                    this.style = 'css/bootstrap.dark.css';
                } else {
                    this.id = 0;
                    this.display = 'Dark mode';
                    this.style = 'css/bootstrap.css';
                }
                document.getElementById("themeStyle").href = this.style;
            },
            id: 0
        };

        vm.theme.switch();

        vm.isActive = function(route) {
            return route === $location.path();
        };

        vm.canRegister = false;
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
            accountService.setAccount();
        }

        vm.getPasswordStrength = function () {
            var strength = 0;

            var baseRequirement = vm.login.password !== undefined && /.{6}/.test(vm.login.password);

            var requirements = [
                /[A-Z]/,
                /[a-z]/,
                /[0-9]/,
                /[^a-zA-Z\d\s:]/
            ];

            for (var i = 0; i < requirements.length; i++) {
                strength += requirements[i].test(vm.login.password) && baseRequirement ? 1 : 0;
            }

            strength = strength / requirements.length * 100;

            return strength + '%';
        };

        vm.register = function () {
            var data = {
                Username: vm.login.username,
                Email: vm.login.email,
                Password: vm.login.password,
                ConfirmPassword: vm.login.confirmPassword
            };

            $http.post(globalConfig.apiUrl + 'Account/Register', data, {
                headers: {
                    authorization: localStorage.getItem('access_token')
                }
            }).success(function (result) {
                delete vm.registerError;
                // vm.login();
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
            accountService.setAccount();
            vm.canRegister = false;
            $route.reload();
        };

        function getUserInfo(token) {
            accountService.resetAccount();
            var access_token = token || localStorage.getItem('access_token');
            $http.get(globalConfig.apiUrl + 'Account/UserInfo', {
                headers: {
                    authorization: access_token
                }
            }).success(function (result) {
                vm.account = result;
                accountService.setAccount(vm.account);
                vm.canRegister = vm.account.roles.indexOf('Admins') > -1;
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