(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        controller
    ]);

    function controller($scope) {
        var vm = this;

        var SubmissionTypes = {
            image: 0,
            youtube: 1,
            spotify: 2
        };

        vm.posts = [
            {
                img: 'https://pbs.twimg.com/media/CHzTMBGWUAAqY-F.jpg',
                author: {
                    userName: 'mithyB'
                },
                date: moment(),
                score: 1337,
                type: SubmissionTypes.image
            },
            {
                img: 'https://pbs.twimg.com/media/CHzOX41WEAAMQnS.png',
                author: {
                    userName: 'mithyB'
                },
                date: moment().add(-4, 'm'),
                score: 1337,
                type: SubmissionTypes.image
            },
            {
                img: 'https://pbs.twimg.com/media/CHvmu1kVAAEHlA8.jpg',
                author: {
                    userName: 'mithyB'
                },
                date: moment().add(-32, 'm'),
                score: 1337,
                type: SubmissionTypes.image
            },
            {
                img: 'https://pbs.twimg.com/media/CHzNX78WoAAuE7c.jpg',
                author: {
                    userName: 'mithyB'
                },
                date: moment().add(-2, 'h'),
                score: 1337,
                type: SubmissionTypes.image
            },
            {
                img: 'https://pbs.twimg.com/media/CHzMyr0UkAAYa3o.jpg',
                author: {
                    userName: 'mithyB'
                },
                date: moment().add(-1, 'd'),
                score: 1337,
                type: SubmissionTypes.image
            }
        ];

        vm.getEnlargementIcon = function (post) {
            switch (post.type) {
                case SubmissionTypes.image:
                    return 'fa-search';
                case SubmissionTypes.youtube:
                    return 'fa-youtube-play';
            }
        };

        vm.getBadge = function (post) {
            switch (post.type) {
                case SubmissionTypes.image:
                    return 'fa-picture-o';
                case SubmissionTypes.youtube:
                    return 'fa-youtube-play';
            }
        };

        vm.getBadgeStyle = function (post) {
            switch (post.type) {
                case SubmissionTypes.image:
                    return { background: 'deepskyblue', color: 'white' };
                case SubmissionTypes.youtube:
                    return { background: 'red', color: 'white' };
            }
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

            //<iframe src='http://www.youtube.com/embed/QILiHiTD3uc' frameborder='0' allowfullscreen></iframe>

            modal.modal('show');
        };

        vm.favorite = function (post) {
            post.isFavorite = !post.isFavorite;
            post.score += post.isFavorite ? 1 : -1;

            var p = new Post(post);
            p.$update({ id: post.id }).then(success, failed);

            function success(result) {

            }

            function failed(error) {
                console.error(error);
            }
        };
    }

})(appName, 'hub', angular);