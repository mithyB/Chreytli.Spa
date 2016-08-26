(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$rootScope',
        '$scope',
        controller
    ]);

    function controller($rootScope, $scope) {
        /*jshint validthis:true */
        var vm = this;

        $rootScope.$on('themeChanged', function(e, args) {
            updateTsViewerTheme(args);
        });

        vm.hallOfFame = [
            {
                rank: 1,
                userName: 'Emotionerror',
                game: 'League of Legends 1v1',
                place: 'Des Führers Next Reichsstratege'
            },
            {
                rank: 2,
                userName: 'ZeMooX',
                game: 'League of Legends 1v1',
                place: 'Des Führers Next Reichsstratege'
            },
            {
                rank: 3,
                userName: 'Hirschkönig',
                game: 'League of Legends 1v1',
                place: 'Des Führers Next Reichsstratege'
            },
            {
                rank: 2,
                userName: 'Command_BAum',
                game: 'Exploding Kittens',
                place: 'NETGAME'
            }
        ];

        vm.getRankClass = function (rank) {
            var base = 'fame-item-icon-';
            if (rank === 1) {
                return base + 'gold';
            } else if (rank === 2) {
                return base + 'silver';
            } else {
                return base + 'bronze';
            }
        };

        updateTsViewerTheme(parseInt(localStorage.getItem('theme_id')));

        function updateTsViewerTheme(themeId) {
            if (themeId === 0) {
                vm.tsviewer = {
                    style: {
                        'background-color': ''
                    },
                    url: "https://www.tsviewer.com/ts3viewer.php?ID=1071354&text=000000&text_size=12&text_family=1&js=1&text_s_weight=bold&text_s_style=normal&text_s_variant=normal&text_s_decoration=none&text_s_color_h=525284&text_s_weight_h=bold&text_s_style_h=normal&text_s_variant_h=normal&text_s_decoration_h=underline&text_i_weight=normal&text_i_style=normal&text_i_variant=normal&text_i_decoration=none&text_i_color_h=525284&text_i_weight_h=normal&text_i_style_h=normal&text_i_variant_h=normal&text_i_decoration_h=underline&text_c_weight=normal&text_c_style=normal&text_c_variant=normal&text_c_decoration=none&text_c_color_h=525284&text_c_weight_h=normal&text_c_style_h=normal&text_c_variant_h=normal&text_c_decoration_h=underline&text_u_weight=bold&text_u_style=normal&text_u_variant=normal&text_u_decoration=none&text_u_color_h=525284&text_u_weight_h=bold&text_u_style_h=normal&text_u_variant_h=normal&text_u_decoration_h=none"
                };
            } else {
                vm.tsviewer = {
                    style: {
                        'background-color': 'rgb(51, 51, 51)'
                    },
                    url: "https://www.tsviewer.com/ts3viewer.php?ID=1071354&text=a8a8a8&text_size=12&text_family=4&text_s_color=ffffff&text_s_weight=bold&text_s_style=normal&text_s_variant=normal&text_s_decoration=none&text_i_color=&text_i_weight=normal&text_i_style=normal&text_i_variant=normal&text_i_decoration=none&text_c_color=&text_c_weight=normal&text_c_style=normal&text_c_variant=normal&text_c_decoration=none&text_u_color=ffffff&text_u_weight=normal&text_u_style=normal&text_u_variant=normal&text_u_decoration=none&text_s_color_h=&text_s_weight_h=bold&text_s_style_h=normal&text_s_variant_h=normal&text_s_decoration_h=none&text_i_color_h=ffffff&text_i_weight_h=bold&text_i_style_h=normal&text_i_variant_h=normal&text_i_decoration_h=none&text_c_color_h=&text_c_weight_h=normal&text_c_style_h=normal&text_c_variant_h=normal&text_c_decoration_h=none&text_u_color_h=&text_u_weight_h=bold&text_u_style_h=normal&text_u_variant_h=normal&text_u_decoration_h=none&flags=0&iconset=default_mono_2014"
                };
            }
            ts3v_display.init(vm.tsviewer.url, 1071354, 100);
        }
    }

})(appName, 'main', angular);
