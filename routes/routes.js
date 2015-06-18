(function (moduleId, valueId, ng) {
    'use strict';

    var value = [
        {
            url: '/',
            config: {
                controller: 'hub as vm',
                templateUrl: 'templates/hub.html',
                settings: {
                    title: 'Hub',
                    style: {
                        color: "cornflowerblue"
                    },
                    showNav: true
                }
            }
        },
        {
            url: '/poll',
            config: {
                controller: 'poll as vm',
                templateUrl: 'templates/poll.html',
                settings: {
                    title: 'Poll',
                    style: {
                        color: "crimson"
                    },
                    showNav: true
                }
            }
        },
        {
            url: '/main',
            config: {
                controller: 'main as vm',
                templateUrl: 'templates/main.html',
                settings: {
                    title: 'Gaming',
                    style: {
                        color: "forestgreen"
                    },
                    showNav: true
                }
            }

        }
    ];

    ng.module(moduleId).constant(valueId, value);

})(appName, 'routes', angular)
