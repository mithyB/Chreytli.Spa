(function (moduleId, directiveId, ng) {
    'use strict';

    ng.module(moduleId).directive(directiveId, directive)
        .controller(directiveId, [
            '$scope',
            '$location',
            '$resource',
            '$filter',
            'globalConfig',
            'submissionTypeService',
            'accountService',
            'utilityService',
            controller
        ]);

    function directive() {
        return {
            restrict: 'E',
            scope: {
                submission: '=',
                onDelete: '&'
            },
            controller: directiveId,
            controllerAs: 'vm',
            templateUrl: 'app/directives/mediaElement.html'
        }
    }

    function controller($scope, $location, $resource, $filter,
        globalConfig, submissionTypeService, accountService, utilityService) {
        var vm = this;

        var Submission = $resource(globalConfig.apiUrl + 'Submissions/:id', {}, {
            'delete': { method: 'DELETE', params: { id: '@id' }, headers: { authorization: localStorage.getItem('access_token') } },
            'favorite': {
                method: 'POST', url: globalConfig.apiUrl + 'Submissions/:id/Favorite', params: { id: '@id' },
                headers: { authorization: localStorage.getItem('access_token') }
            }
        });

        vm.getTypeSetting = function (type, setting) {
            return submissionTypeService.getSetting(type, setting);
        };

        vm.enlarge = function (submission) {
            $location.search({ s: submission.id });
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
                alert('You are not logged in. Please log in or register if you haven\'t already.');
            }
        };

        vm.canDelete = function (submission) {
            var account = accountService.getAccount();
            return utilityService.isInRole('Admins') || account && submission.author.id == account.id;
        };

        vm.delete = function (submission) {
            var s = new Submission(submission);
            s.$delete().then(success, failed);

            function success(result) {
                $scope.onDelete(submission);
            }

            function failed(error) {
                console.error(error);
            }
        };

        function enlarge(submission) {
            var modal = $('#mediaModal');
            var content = modal.find('.modal-content');
            var media;

            $('#mediaModal').on('hidden.bs.modal', function () {
                content.empty();
            });

            modal.data('submission-id', submission.id);
            content.empty();
            content.append(submissionTypeService.getMediaElement(submission));

            modal.modal('show');
        }
    }

})(appName, 'mediaElement', angular);