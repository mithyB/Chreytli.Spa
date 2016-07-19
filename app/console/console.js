(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$resource',
        'globalConfig',
        controller
    ]);

    function controller($resource, globalConfig) {
        /*jshint validthis:true */
        var vm = this;

        var status = [
            'Offline',
            'Starting...',
            'Running'
        ];

        var Server = $resource(globalConfig.apiUrl + 'Servers/:id', {}, {
            'query': { method: 'GET', headers: { authorization: localStorage.getItem('access_token') }, isArray: true },
            'create': { method: 'POST', headers: { authorization: localStorage.getItem('access_token') } },
            'update': { method: 'PUT', headers: { authorization: localStorage.getItem('access_token') } },
            'start': {
                method: 'POST', url: globalConfig.apiUrl + 'Servers/:id/Start', params: { id: '@id' },
                headers: { authorization: localStorage.getItem('access_token') }
            },
            'stop': {
                method: 'POST', url: globalConfig.apiUrl + 'Servers/:id/Stop', params: { id: '@id' },
                headers: { authorization: localStorage.getItem('access_token') }
            }
        });

        Server.query().$promise.then(function (result) {
            ng.forEach(result, function (x) {
                x.status = status[x.status];
            });

            vm.servers = result;
        });

        vm.addServer = function () {

        };

        vm.saveServer = function () {
            Server.update({ id: vm.server.id }, vm.server).$promise.then(function (result) {

            });
        };

        vm.startServer = function (server) {
            Server.start(server).$promise.then(function (result) {
                server.status = status[2];
            });
        };

        vm.stopServer = function (server) {
            Server.stop(server).$promise.then(function (result) {
                server.status = status[0];
            });
        };

        vm.openEditServer = function (server) {
            vm.server = server;
            $('#editModal').modal('show');
        };
    }

})(appName, 'console', angular);