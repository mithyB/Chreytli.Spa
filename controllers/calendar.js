(function (moduleId, controllerId, ng) {
    'use strict';

    ng.module(moduleId).controller(controllerId, [
        '$scope',
        '$resource',
        'globalConfig',
        controller
    ]);

    function controller($scope, $resource, globalConfig) {
        var vm = this;

        var Event = $resource(globalConfig.apiUrl + 'Events/:id', {}, {
            query: { method: 'GET', isArray: true, headers: { authorization: localStorage.getItem('access_token') } },
            create: { method: 'POST', headers: { authorization: localStorage.getItem('access_token') } },
            update: { method: 'PUT', headers: { authorization: localStorage.getItem('access_token') }, params: { id: '@id' } },
            delete: { method: 'DELETE', headers: { authorization: localStorage.getItem('access_token'), params: { id: '@id' } } }
        });

        var eventSource = {
            className: 'fullCalendar-event'
        };

        var events = Event.query(function () {

            eventSource.events = events;

            $('#calendar').fullCalendar({
                selectable: true,
                editable: true,
                eventStartEditable: true,
                eventDurationEditable: true,
                weekNumbers: true,
                timeFormat: 'H:mm',
                axisFormat: 'H:mm',
                columnFormat: 'dddd',
                firstDay: 1,
                defaultView: 'agendaWeek',
                businessHours: {
                    start: '06:00',
                    end: '18:00',
                    dow: [1, 2, 3, 4, 5]
                },
                header: {
                    right: 'prev,next,month,agendaWeek,agendaDay'
                },
                buttonText: {
                    month: 'Month',
                    agendaWeek: 'Week',
                    agendaDay: 'Day'
                },
                eventSources: eventSource,
                select: function (start, end, jsEvent, view) {
                    vm.newEvent = {};
                    vm.newEvent.allDay = !start.hasTime();

                    vm.newEvent.start = start;
                    vm.newEvent.end = end;
                },
                eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                    Event.update(convertEvent(event));
                },
                eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                    Event.update(convertEvent(event));
                },
                eventClick: function (event, jsEvent, view) {
                    $('#showEventModal').modal('show');
                },
                eventRender: function (event, element, view) {
                    $(element).on('mousedown', function () {
                        vm.selectedEvent = event;
                        $scope.$apply();
                    });
                }
            });
        });

        vm.newEvent = {};

        function convertEvent(evt) {
            return {
                id: evt.id,
                title: evt.title,
                description: evt.description,
                start: evt.start,
                end: evt.end,
                allDay: evt.allDay
            };
        }

        vm.save = function () {
            var event = new Event(vm.newEvent);
            event.$create().then(function (result) {
                events.push(result);
                updateData(events);
            });
            $('#newEventModal').modal('hide');
        };

        vm.saveChanges = function () {
            var event = new Event(convertEvent(vm.editEvent));
            event.$update().then(function (result) {
                var i = events.map(function (x) { return x.id; }).indexOf(result.id);
                events[i] = result;
                updateData(events);
            });
            $('#editEventModal').modal('hide');
        };

        vm.delete = function () {
            Event.delete(convertEvent(vm.selectedEvent)).$promise.then(function (result) {
                var i = events.map(function (x) { return x.id; }).indexOf(result.id);
                events.splice(i, 1);
                updateData(events);
            });
        };

        function updateData(events) {
            eventSource.events = events;
            $('#calendar').fullCalendar('removeEventSource', eventSource);
            $('#calendar').fullCalendar('addEventSource', eventSource);
        }

        customContextMenu.onOpen(function (e) {
            var x = $('#calendar').find(e.srcElement || e.target);
            return x.length > 0;
        }, function (e) {

            var items = [];
            var el = $('.fc-event-container').find(e.srcElement || e.originalTarget);
            if (el.length > 0) { // right click on event
                items = [
                    {
                        key: 'edit',
                        html: '<i class="fa fa-edit"></i>&nbsp;Edit'
                    },
                    {
                        key: 'delete',
                        html: '<i class="fa fa-times"></i>&nbsp;Delete'
                    }
                ]
            } else {
                items = [
                    {
                        key: 'new',
                        html: '<i class="fa fa-calendar"></i>&nbsp;New event'
                    }
                ]
            }

            return items;
        }, function (key) {
            switch (key) {
                case 'new':
                    $('#newEventModal').modal('show');
                    break;
                case 'edit':
                    $scope.$apply(function () {
                        vm.editEvent = ng.copy(vm.selectedEvent);
                        $('#editEventModal').modal('show');
                    });
                    break;
                case 'delete':
                    $scope.$apply(function () {
                        vm.delete();
                    });
                    break;
            }
        })

    }

})(appName, 'calendar', angular);