(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        controller
    ]);

    function controller($scope) {
        /*jshint validthis:true */
        var vm = this;

        vm.hallOfFame = [
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
    }

})(appName, 'main', angular);