(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).service(serviceId, [
        service
    ]);

    function service() {
        var regexes = {
            youtube: /https?:\/\/(?:www\.)?youtube.com\/watch\?.*v=([A-Za-z0-9_\-]+)/,
            spotify: /spotify:track:(.*)/,
            reddit: /https?:\/\/(?:www\.)?reddit\.com\/r\/(.*)\/comments\/(.*)/,
            soundcloud: /https?:\/\/soundcloud\.com\/(.*)\/(.*)/
        };

        return {
            youtube: regexes.youtube,
            spotify: regexes.spotify,
            reddit: regexes.reddit,
            soundcloud: regexes.soundcloud,

            getUrlType: function (input) {
                for (var regex in regexes) {
                    if (regexes[regex].test(input)) {
                        return regex;
                    }
                }

                return 'image';
            }
        };
    }

})(appName, 'regexService', angular);
