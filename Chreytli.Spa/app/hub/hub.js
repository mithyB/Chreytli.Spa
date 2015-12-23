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
        'utilityService',
        controller
    ]);

    function controller($resource, $filter, $location, $scope,
        globalConfig, accountService, submissionTypeService, jQHubService, regexService, utilityService) {
        /*jshint validthis:true */
        var vm = this;

        var Submission = $resource(globalConfig.apiUrl + 'Submissions/:id', {}, {
            'query': { method: 'GET', isArray: true },
            'create': { method: 'POST', headers: { authorization: localStorage.getItem('access_token') } }
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

                vm.submissions.push(x);
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
        vm.submissions = [];
        vm.page = 0;
        vm.newSubmission = {
            type: 'image'
        };
        vm.newSubmission.tag = 0;

        vm.isLoggedIn = utilityService.isLoggedIn;
        vm.isInRole = utilityService.isInRole;

        vm.onSubmissionDelete = function (submissions) {
            vm.submissions = $filter('filter')(vm.submissions, { id: submissions.id }, function (actual, expected) { return expected != actual; });
        };

        vm.selectType = function (type) {
            vm.newSubmission.type = type;
        };

        vm.isActiveType = function (type) {
            return vm.newSubmission.type == type;
        };

        vm.selectTag = function (tag) {
            vm.newSubmission.tag = tag;
        };

        vm.isActiveTag = function (tag) {
            return vm.newSubmission.tag == tag;
        };

        vm.selectFilter = function (filter, element) {
            $(element.target).blur();
            if (vm.isActiveFilter(filter)) {
                vm.filter.splice(vm.filter.indexOf(filter), 1);
            } else {
                vm.filter.push(filter);
            }

            vm.page = 0;
            vm.submissions = [];
            var acc = accountService.getAccount();
            loadSubmissions(acc ? acc.id : undefined);
        };

        vm.isActiveFilter = function (filter) {
            return vm.filter.indexOf(filter) > -1;
        };

        vm.submit = function () {
            var account = accountService.getAccount();            
            var submission = getNewSubmission();
            submission.author = { id: account.id };
            submission.isHosted = true;// vm.newSubmission.isHosted;

            vm.isSubmitting = true;

            submissionTypeService.initialize(submission, vm.newSubmission.url, function (sub) {
                var s = new Submission(sub);
                s.$create().then(success, failed);

                function success(result) {
                    var hasHostedThumbnail = result.img.indexOf('http') !== 0;

                    result.author = {
                        userName: account.username
                    };
                    result.date = moment(result.date);
                    result.img = (result.isHosted || hasHostedThumbnail ? globalConfig.baseUrl : '') + result.img;
                    result.url = (result.isHosted ? globalConfig.baseUrl : '') + result.url;

                    vm.submissions.splice(0, 0, result);
                    $('#submitModal').modal('hide');

                    vm.isSubmitting = false;
                }

                function failed(error) {
                    console.error(error);

                    vm.isSubmitting = false;
                }
            });
        };

        function getNewSubmission() {
            var submission = {
                url: vm.newSubmission.url,
                date: moment(),
                score: 0,
                type: submissionTypeService.SubmissionTypes[vm.newSubmission.type],
                tag: vm.newSubmission.tag
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