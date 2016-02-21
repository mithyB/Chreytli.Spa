(function (moduleId, valueId, ng) {
    'use strict';

    var value = [
        {
            url: '/',
            config: {
                templateUrl: 'app/home/home.html',
                reloadOnSearch: false,
                settings: { }
            }
        },
        {
            url: '/about',
            config: {
                templateUrl: 'app/about/about.html',
                reloadOnSearch: false,
                settings: {}
            }
        },
        {
            url: '/hub',
            config: {
                controller: 'hub as vm',
                templateUrl: 'app/hub/hub.html',
                reloadOnSearch: false,
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
                templateUrl: 'app/polls/poll.html',
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
            url: '/gaming',
            config: {
                controller: 'main as vm',
                templateUrl: 'app/gaming/main.html',
                settings: {
                    title: 'Gaming',
                    style: {
                        color: "forestgreen"
                    },
                    showNav: true
                }
            }

        },
        {
            url: '/calendar',
            config: {
                controller: 'calendar as vm',
                templateUrl: 'app/calendar/calendar.html',
                settings: {
                    title: 'Events',
                    style: {
                        color: "orange"
                    },
                    showNav: true
                }
            }

        },
        {
            config: {
                settings: {
                    title: 'League',
                    showNav: true,
                    externalUrl: 'http://league.chreyt.li',
                }
            }

        },
        {
            url: '/console',
            config: {
                controller: 'console as vm',
                templateUrl: 'app/console/console.html',
                settings: {
                    title: 'Console',
                    style: {
                        color: "magenta"
                    }
                }
            }

        },
        {
            url: '/profile',
            config: {
                controller: 'profile as vm',
                templateUrl: 'app/profile/profile.html',
                settings: {
                    title: 'You',
                    style: {
                        color: "#ccc"
                    },
                    showNav: false
                }
            }

        },
        {
            url: '/donate',
            config: {
                templateUrl: 'app/donate/donate.html',
                settings: { }
            }

        }
    ];

    ng.module(moduleId).constant(valueId, value);

})(appName, 'routes', angular);