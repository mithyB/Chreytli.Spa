(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$http',
        '$location',
        '$resource',
        '$filter',
        'globalConfig',
        'accountService',
        'utilityService',
        controller
    ]);

    function controller($http, $location, $resource, $filter, globalConfig, accountService, utilityService) {
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





        var Submission = $resource(globalConfig.apiUrl + 'Submissions/Favorites?userId=:userId', {}, {
            'query': { method: 'GET', isArray: true, headers: { authorization: localStorage.getItem('access_token') } }
        });

        accountService.onAccountLoaded(function (account) {
            loadSubmissions(account ? account.id : '');
        });

        function loadSubmissions(accountId) {
            Submission.query({ userId: accountId, page: vm.page, filter: vm.filter, pageSize: globalConfig.postsPageSize }).$promise.then(function (result) {
                loadData(result);

                var search = $location.search();
                if (search.s) {
                    loadUntilSubmissionIsFound(result, parseInt(search.s), function (submission) {
                        enlarge(submission);
                    });
                }

            }, function (error) {
                console.error(error);
            });
        }

        vm.loadMore = function (dataLoaded) {
            vm.page++;
            vm.loadingMore = true;

            var account = accountService.getAccount();
            var accountId = account ? account.id : '';

            Submission.query({ userId: accountId, page: vm.page, filter: vm.filter, pageSize: globalConfig.postsPageSize }).$promise.then(function (result) {
                loadData(result);

                if (dataLoaded) { dataLoaded(result); }

                vm.loadingMore = false;
            }, function (error) {
                console.error(error);

                vm.loadingMore = false;
            });
        };

        function loadData(result) {
            vm.isMoreDataAvailable = result.length == globalConfig.postsPageSize;
            ng.forEach(result, function (x) {
                var hasHostedThumbnail = x.img.indexOf('http') !== 0;

                x.date = moment(moment.utc(x.date).toDate()); // utc to local
                x.img = (x.isHosted || hasHostedThumbnail ? globalConfig.baseUrl : '') + x.img;
                x.url = (x.isHosted ? globalConfig.baseUrl : '') + x.url;

                vm.favorites.push(x);
            });
        }

        function loadUntilSubmissionIsFound(submissions, submissionId, finished) {
            var submission = $filter('filter')(submissions, { id: submissionId }, true)[0];
            if (submission) {
                if (finished) finished(submission);
            } else {
                vm.loadMore(function (result) {
                    loadUntilSubmissionIsFound(result, submissionId, finished);
                });
            }
        }

        vm.filter = ['sfw'];
        vm.favorites = [];
        vm.page = 0;

        vm.isLoggedIn = utilityService.isLoggedIn;
        vm.isInRole = utilityService.isInRole;

        vm.onSubmissionDelete = function (submissions) {
            vm.favorites = $filter('filter')(vm.favorites, { id: submissions.id }, function (actual, expected) { return expected != actual; });
        };

        vm.selectFilter = function (filter, element) {
            $(element.target).blur();
            if (vm.isActiveFilter(filter)) {
                vm.filter.splice(vm.filter.indexOf(filter), 1);
            } else {
                vm.filter.push(filter);
            }

            vm.page = 0;
            vm.favorites = [];
            var acc = accountService.getAccount();
            loadSubmissions(acc ? acc.id : undefined);
        };

        vm.isActiveFilter = function (filter) {
            return vm.filter.indexOf(filter) > -1;
        };
    }

})(appName, 'profile', angular);