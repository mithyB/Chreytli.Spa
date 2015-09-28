(function (moduleId, serviceId, ng) {
    'use strict';

    ng.module(moduleId).factory(serviceId, [
        factory
    ]);

    function factory() {
        var initialized = false;

        return {
            initialize: function ($filter, $location, $scope, vm) {
                if (!initialized) {
                    $(document).on('hidden.bs.modal', '#mediaModal', function () {
                        $location.search('s', null);
                        $scope.$apply();
                    });

                    $(document).keydown(function (e, handler) {
                        var modal = $('#mediaModal');
                        var isModalOpen = (modal.data('bs.modal') || {}).isShown;

                        var currentSubmission = $filter('filter')(vm.submissions, { id: modal.data('post-id') }, true)[0];

                        if (isModalOpen) {
                            var index = 0;
                            switch (e.keyCode) {
                                case 37: //left
                                    index = vm.submissions.indexOf(currentSubmission) - 1;
                                    break;
                                case 39: //right
                                    index = vm.submissions.indexOf(currentSubmission) + 1;
                                    break;
                            }

                            var nextSubmission = vm.submissions[index];
                            if (nextSubmission) {
                                vm.enlarge(nextSubmission);
                                $scope.$apply();
                            }
                        }
                    });

                    $(document).on('show.bs.modal', function () {
                        vm.newSubmission = {
                            type: 'image',
                            isHosted: true
                        };
                    });

                    initialized = true;
                }
            }
        }
    }

})(appName, 'jQHubService', angular);
