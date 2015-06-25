(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$resource',
        '$filter',
        '$location',
        '$scope',
        'globalConfig',
        'accountService',
        'submissionTypeService',
        'jQHubService',
        'regexService',
        controller
    ]);

    function controller($resource, $filter, $location, $scope,
        globalConfig, accountService, submissionTypeService, jQHubService, regexService) {
        var vm = this;

        var pageSize = 24;

        var Submission = $resource(globalConfig.apiUrl + 'Submissions/:id', {}, {
            'query': { method: 'GET', isArray: true },
            'create': { method: 'POST', headers: { authorization: localStorage.getItem('access_token') } },
            //'update': { method: 'PUT', headers: { authorization: localStorage.getItem('access_token') } },
            'delete': { method: 'DELETE', params: { id: '@id' }, headers: { authorization: localStorage.getItem('access_token') } },
            'favorite': {
                method: 'POST', url: globalConfig.apiUrl + 'Submissions/:id/Favorite', params: { id: '@id' },
                headers: { authorization: localStorage.getItem('access_token') }
            }
        });

        accountService.onAccountLoaded(function (account) {
            var accountId = account ? account.id : '';
            Submission.query({ userId: accountId, page: vm.page }).$promise.then(function (result) {
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
        });

        vm.loadMore = function (dataLoaded) {
            vm.page++;
            var account = accountService.getAccount();
            var accountId = account ? account.id : '';

            Submission.query({ userId: accountId, page: vm.page }).$promise.then(function (result) {
                loadData(result);

                if (dataLoaded) dataLoaded(result);

            }, function (error) {
                console.error(error);
            });
        }

        function loadData(result) {
            vm.isMoreDataAvailable = result.length == pageSize;
            ng.forEach(result, function (x) {
                x.date = moment(moment.utc(x.date).toDate()); // utc to local
                vm.submissions.push(x);
            })
        }

        function loadUntilSubmissionIsFound(submissions, submissionId, finished) {
            var submission = $filter('filter')(submissions, { id: submissionId }, true)[0];
            if (submission) {
                if (finished) finished(submission);
            } else {
                vm.loadMore(function (result) {
                    loadUntilSubmissionIsFound(result, submissionId, finished);
                })
            }
        }

        vm.submissions = [];
        vm.page = 0;
        vm.newSubmission = {
            type: 'image'
        };

        vm.isLoggedIn = function () {
            return (accountService.getAccount());
        };

        vm.isInRole = function (role) {
            var acc = accountService.getAccount();
            if (acc && acc.roles) {
                return acc.roles.indexOf(role) > -1;
            }
        }

        vm.canDelete = function (submission) {
            var account = accountService.getAccount();
            return vm.isInRole('Admins') || account && submission.authorId == account.id;
        };

        vm.getTypeSetting = function (type, setting) {
            return submissionTypeService.getSetting(type, setting);
        };

        function enlarge(submission) {
            var modal = $('#mediaModal');
            var content = modal.find('.modal-content');
            var media;

            $('#mediaModal').on('hidden.bs.modal', function () {
                content.empty();
            });

            modal.data('post-id', submission.id);
            content.empty();
            content.append(submissionTypeService.getMediaElement(submission));

            modal.modal('show');
        }

        vm.enlarge = function (submission) {
            $location.search({ s: submission.id })
            enlarge(submission);
        };

        vm.favorite = function (submission) {
            function success(result) {

            }

            function failed(error) {
                console.error(error);
            }

            var account = accountService.getAccount();
            if (account) {
                submission.isFavorite = !submission.isFavorite;
                submission.score += submission.isFavorite ? 1 : -1;

                var s = new Submission(submission);
                s.$favorite({ userId: account.id }).then(success, failed);
            } else {
                alert('You are not logged in. Please log in or register if you haven\'t already.')
            }
        };

        vm.delete = function (submission) {
            var s = new Submission(submission);
            s.$delete().then(success, failed);

            function success(result) {
                vm.submissions = $filter('filter')(vm.submissions, { id: '!' + result.id }, true);
            }

            function failed(error) {
                console.error(error);
            }
        };

        vm.submit = function () {
            var account = accountService.getAccount();            
            var submission = getNewSubmission();
            submission.authorId = account.id;

            submissionTypeService.initialize(submission, vm.newSubmission.url, function (sub) {
                var s = new Submission(sub);
                s.$create().then(success, failed);

                function success(result) {
                    result.author = {
                        userName: account.username
                    };
                    result.date = moment(result.date);
                    vm.submissions.splice(0, 0, result);
                    $('#submitModal').modal('hide');
                }

                function failed(error) {
                    console.error(error);
                }
            });
        };

        function getNewSubmission() {
            var submission = {
                date: moment(),
                score: 0,
                type: submissionTypeService.SubmissionTypes[vm.newSubmission.type]
            };

            return submission;
        }

        $scope.$watch('vm.newSubmission.url', function (newVal, oldVal) {
            var type = regexService.getUrlType(vm.newSubmission.url);
            vm.newSubmission.type = type;
        });

        jQHubService.initialize($filter, $location, $scope, vm);
    }

})(appName, 'hub', angular);