(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).service(serviceId, [
        service
    ]);

    function service() {

        var youtubeRegex = /https?:\/\/(?:www\.)?youtube.com\/watch\?.*v=([A-Za-z0-9]+)/;

        var submissionTypeSettings = {
            0: {
                title: 'Image',
                enlargementIcon: 'fa-search',
                badgeIcon: 'fa-picture-o',
                style: { background: 'deepskyblue', color: 'white' },
                getMediaElement: function (submission) {
                    return $('<img>', {
                        id: 'mediaModal-image',
                        src: submission.img,
                        class: 'img-responsive'
                    });
                }
            },
            1: {
                title: 'YouTube',
                enlargementIcon: 'fa-youtube-play',
                badgeIcon: 'fa-youtube-play',
                style: { background: 'red', color: 'white' },
                // <iframe src='http://www.youtube.com/embed/QILiHiTD3uc' frameborder='0' allowfullscreen></iframe>
                getMediaElement: function (submission) {
                    return $('<iframe>', {
                        id: 'mediaModal-video',
                        src: submission.url,
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
                        width: 300,
                        height: 380,
                        frameborder: 0,
                        allowtransparency: true
                    });
                }
            }
        };

        return {
            SubmissionTypes: {
                image: 0,
                youtube: 1,
                spotify: 2
            },

            initialize: function (submission, url) {
                switch (submission.type) {
                    case this.SubmissionTypes.image:
                        submission.img = url;
                        break;
                    case this.SubmissionTypes.youtube:
                        var vid = youtubeRegex.exec(url)[1];
                        submission.url = 'http://www.youtube.com/embed/' + vid;
                        submission.img = 'http://img.youtube.com/vi/' + vid + '/0.jpg';
                        break;
                    case this.SubmissionTypes.spotify:
                        submission.url = 'https://embed.spotify.com/?uri=' + url;
                        break;
                }
                return submission;
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
