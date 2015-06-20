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
        var vm = this;

        var SubmissionTypes = {
            image: 0,
            youtube: 1,
            spotify: 2
        };

        var submissionTypeSettings = {
            0: {
                enlargementIcon: 'fa-search',
                badgeIcon: 'fa-picture-o',
                style: { background: 'deepskyblue', color: 'white' }
            },
            1: {
                enlargementIcon: 'fa-youtube-play',
                badgeIcon: 'fa-youtube-play',
                style: { background: 'red', color: 'white' }
            },
            2: {
                enlargementIcon: 'fa-play',
                badgeIcon: 'fa-spotify',
                style: { background: 'limegreen', color: 'white' }
            }
        };

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
            Submission.query({ userId: accountId }).$promise.then(function (result) {
                ng.forEach(result, function (x) {
                    x.date = moment(moment.utc(x.date).toDate()); // utc to local
                });
                vm.submissions = result;
            }, function (error) {
                console.error(error);
            });
        });

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

        vm.getEnlargementIcon = function (submission) {
            return submissionTypeSettings[submission.type].enlargementIcon;
        };

        vm.getBadge = function (submission) {
            return submissionTypeSettings[submission.type].badgeIcon;
        };

        vm.getBadgeStyle = function (submission) {
            return submissionTypeSettings[submission.type].style;
        };

        vm.enlarge = function (post) {
            var modal = $('#mediaModal');
            var content = modal.find('.modal-content');
            content.empty();

            var media;

            switch (post.type) {
                case SubmissionTypes.image:
                    content.append($('<img>', {
                        id: 'mediaModal-image',
                        src: post.img,
                        class: 'img-responsive'
                    }));
                    break;
                case SubmissionTypes.youtube:
                    //<iframe src='http://www.youtube.com/embed/QILiHiTD3uc' frameborder='0' allowfullscreen></iframe>
                    content.append($('<iframe>', {
                        id: 'mediaModal-video',
                        src: post.url,
                        frameborder: 0,
                        allowfullscreen: true,
                        width: '100%',
                        height: '320px'
                    }));
                    break;
            }


            modal.modal('show');
        };

        vm.favorite = function (submission) {
            submission.isFavorite = !submission.isFavorite;
            submission.score += submission.isFavorite ? 1 : -1;

            var account = accountService.getAccount();
            var s = new Submission(submission);
            s.$favorite({ userId: account.id }).then(success, failed);

            function success(result) {

            }

            function failed(error) {
                console.error(error);
            }
        };

        vm.delete = function (submission) {
            var s = new Submission(submission);
            s.$delete().then(success, failed);

            function success(result) {
                vm.submissions = $filter('filter')(vm.submissions, { id: '!' + result.id });
            }

            function failed(error) {
                console.error(error);
            }
        };

        vm.submit = function () {
            var account = accountService.getAccount();            
            var submission = getNewSubmission();
            submission.authorId = account.id;

            var s = new Submission(submission);
            s.$create().then(success, failed);

            function success(result) {
                result.author = {
                    userName: account.username
                };
                result.date = moment(result.date);
                vm.submissions.push(result);
            }

            function failed(error) {
                console.error(error);
            }
        };

        function getNewSubmission() {
            var youtubeRegex = /https?:\/\/(?:www\.)?youtube.com\/watch\?.*v=([A-Za-z0-9]+)/;

            var submission = {
                date: moment(),
                score: 0,
                type: SubmissionTypes[vm.newSubmission.type]
            };

            switch (submission.type) {
                case SubmissionTypes.image:
                    submission.img = vm.newSubmission.url;
                    break;
                case SubmissionTypes.youtube:
                    var vid = youtubeRegex.exec(vm.newSubmission.url)[1];
                    submission.url = 'http://www.youtube.com/embed/' + vid;
                    submission.img = 'http://img.youtube.com/vi/' + vid + '/0.jpg';
                    break;
                case SubmissionTypes.spotify:
                    break;
            }

            return submission;
        }
    }

})(appName, 'hub', angular);