(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).service(serviceId, [
        '$http',
        'regexService',
        service
    ]);

    function service($http, regexService) {
        var submissionTypeSettings = {
            0: {
                title: 'Image',
                enlargementIcon: 'fa-search',
                badgeIcon: 'fa-picture-o',
                style: { background: 'deepskyblue', color: 'white' },
                getMediaElement: function (submission) {
                    return $('<img>', {
                        id: 'mediaModal-image',
                        src: submission.url,
                        class: 'img-responsive'
                    });
                }
            },
            1: {
                title: 'YouTube',
                enlargementIcon: 'fa-youtube-play',
                badgeIcon: 'fa-youtube-play',
                style: { background: 'red', color: 'white' },
                // <iframe src='http://www.youtube.com/embed/QILiHiTD3uc?autoplay=1' frameborder='0' allowfullscreen></iframe>
                getMediaElement: function (submission) {
                    return $('<iframe>', {
                        id: 'mediaModal-video',
                        src: submission.url + '?autoplay=1',
                        frameborder: 0,
                        allowfullscreen: true,
                        width: '100%',
                        height: '320px'
                    });
                }
            },
            2: {
                title: 'Spotify',
                enlargementIcon: 'fa-play',
                badgeIcon: 'fa-spotify',
                style: { background: 'limegreen', color: 'white' },
                // <iframe src="https://embed.spotify.com/?uri=spotify:track:4th1RQAelzqgY7wL53UGQt" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
                getMediaElement: function (submission) {
                    return $('<iframe>', {
                        src: submission.url,
                        width: '100%',
                        height: '320px',
                        frameborder: 0,
                        allowtransparency: true
                    });
                }
            },
            3: {
                title: 'Video',
                enlargementIcon: 'fa-search',
                badgeIcon: 'fa-video-camera',
                style: { background: 'deepskyblue', color: 'white' },
                getMediaElement: function (submission) {
                    return $('<video>', {
                        id: 'mediaModal-image',
                        src: submission.url,
                        class: 'img-responsive',
                        autoplay: true,
                        loop: true,
                        controls: true
                    });
                }
            }
        };

        return {
            SubmissionTypes: {
                image: 0,
                youtube: 1,
                spotify: 2,
                video: 3
            },

            initialize: function (submission, url, callback) {
                switch (submission.type) {
                    case this.SubmissionTypes.image:
                        submission.url = url;
                        callback(submission);
                        break;
                    case this.SubmissionTypes.youtube:
                        var vid = regexService.youtube.exec(url)[1];
                        submission.url = 'http://www.youtube.com/embed/' + vid;
                        submission.img = 'http://img.youtube.com/vi/' + vid + '/0.jpg';
                        callback(submission);
                        break;
                    case this.SubmissionTypes.spotify:
                        var sid = regexService.spotify.exec(url)[1];
                        submission.url = 'https://embed.spotify.com/?uri=' + url;
                        $http.get('https://api.spotify.com/v1/tracks/' + sid).success(function (result) {
                            submission.img = result.album.images[1].url;
                            callback(submission);
                        }).error(function (error) {
                            callback(submission);
                        });
                        break;
                    case this.SubmissionTypes.video:
                        submission.url = url;
                        callback(submission);
                        break;
                }
            },

            getMediaElement: function (submission) {
                return submissionTypeSettings[submission.type].getMediaElement(submission);
            },

            getSetting: function (type, property) {
                return submissionTypeSettings[type][property];
            }
        }
    }

})(appName, 'submissionTypeService', angular);
