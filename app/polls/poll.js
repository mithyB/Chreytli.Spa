(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$resource',
        '$filter',
        'globalConfig',
        'accountService',
        controller
    ]);

    function controller($resource, $filter, globalConfig, accountService) {
        /*jshint validthis:true */
        var vm = this;

        vm.polls = [];

        vm.page = 0;

        var Poll = $resource(globalConfig.apiUrl + 'Polls/:id', {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST', headers: { authorization: localStorage.getItem('access_token') } },
            delete: { method: 'DELETE', params: { id: '@id' }, headers: { authorization: localStorage.getItem('access_token') } },
            vote: {
                method: 'POST', url: globalConfig.apiUrl + 'Polls/:id/Vote', params: { id: '@id' },
                headers: { authorization: localStorage.getItem('access_token') }
            }
        });

        accountService.onAccountLoaded(function (account) {
            var accountId = account ? account.id : '';
            Poll.query({ userId: accountId, page: vm.page, pageSize: globalConfig.pollsPageSize }).$promise.then(function (result) {
                loadData(result, accountId);
            }, function (error) {
                console.error(error);
            });
        });

        vm.isLoggedIn = function () {
            return (accountService.getAccount());
        };

        vm.canDelete = function (poll) {
            var account = accountService.getAccount();
            return vm.isInRole('Admins') || account && poll.author.id == account.id;
        };

        vm.isInRole = function (role) {
            var acc = accountService.getAccount();
            if (acc && acc.roles) {
                return acc.roles.indexOf(role) > -1;
            }
        };

        vm.delete = function (poll) {
            var p = new Poll(poll);
            p.$delete().then(success, failed);

            function success(result) {
                vm.polls = $filter('filter')(vm.polls, { id: result.id }, function (actual, expected) { return expected != actual; });
            }

            function failed(error) {
                console.error(error);
            }
        };

        vm.loadMore = function (dataLoaded) {
            vm.page++;
            vm.loadingMore = true;

            var account = accountService.getAccount();
            var accountId = account ? account.id : '';
            Poll.query({ userId: accountId, page: vm.page, pageSize: globalConfig.pollsPageSize }).$promise.then(function (result) {
                loadData(result, accountId);

                if (dataLoaded) { dataLoaded(result); }

                vm.loadingMore = false;
            }, function (error) {
                console.error(error);

                vm.loadingMore = false;
            });
        };

        function loadData(result, accountId) {
            vm.isMoreDataAvailable = result.length === globalConfig.pollsPageSize;
            ng.forEach(result, function (x) {
                x.date = moment(moment.utc(x.date).toDate()); // utc to local
                setPercentages(x);
                x.showResult = x.isVoted || !accountId;
                vm.polls.push(x);
            });
        }

        function setPercentages(poll) {
            ng.forEach(poll.choices, function (x) {
                x.percentage = (x.votes / poll.totalVotes * 100) + '%';
            });
        }

        vm.toggleVote = function (poll, choice) {
            if (!poll.choiceIds || !poll.multipleChoice) {
                poll.choiceIds = [];
            }

            if (poll.choiceIds.indexOf(choice.id) > -1) {
                poll.choiceIds.splice(poll.choiceIds.indexOf(choice.id), 1);
            } else {
                poll.choiceIds.push(choice.id);
            }
        };

        vm.vote = function (poll) {
            Poll.vote({
                id: poll.id,
                userId: accountService.getAccount().id
            }, poll.choiceIds).$promise.then(function (result) {
                result.showResult = true;
                setPercentages(result);

                result.author = poll.author;
                result.date = poll.date;

                ng.copy(result, poll);
            }, function (error) {
                console.error(error);
            });
        };

        vm.createPoll = function () {
            if (vm.newPoll) {
                vm.newPoll.date = moment();
                vm.newPoll.author = { id: accountService.getAccount().id };
                Poll.create(vm.newPoll).$promise.then(function (result) {
                    result.author = {
                        username: accountService.getAccount().username
                    };
                    result.date = moment(moment.utc(result.date).toDate());
                    vm.polls.splice(0, 0, result);
                }, function (error) {
                    console.log(error);
                });
            }

            $('#newPollModal').modal('hide');

            delete vm.newPoll;
        };

        vm.addChoice = function () {
            if (!vm.newPoll) {
                vm.newPoll = {};
            }
            if (!vm.newPoll.choices) {
                vm.newPoll.choices = [];
            }
            vm.newPoll.choices.push(ng.copy(vm.newChoice));
            delete vm.newChoice;
        };

        vm.removeChoice = function (choice) {
            var index = vm.newPoll.choices.indexOf(choice);
            vm.newPoll.choices.splice(index, 1);
        };

        vm.createPollValid = function () {
            return (vm.newPoll &&
                    vm.newPoll.title &&
                    vm.newPoll.choices &&
                    vm.newPoll.choices.length > 0);
        };
    }

})(appName, 'poll', angular);