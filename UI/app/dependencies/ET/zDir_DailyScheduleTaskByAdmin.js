'use strict';
//zDir_DailyScheduleTaskByAdmin
define(['app'], function (app) {

    //angular.module("zDir_DailyScheduleBrand", ["zDir_ScheduleGridDaily"])
    //.directive("dailyScheduleBrand", ['$compile', '$rootScope', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', '$location', 'dataService', '$http',
    //function ($compile, $rootScope, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, $location, dataService, $http) {

    var injectParams = ["$compile", "$window", "$timeout"];

    var zd = function ($compile, $window, $timeout) {

        return {


            link: function (scope, element, attrs) {

                //require(['/Scripts/app/dependencies/eAppointment/zDir_ScheduleGrid.js'], function () {


                scope.$watch("outletId", function (newValue, oldValue) {

                    element.empty();
                    $compile(element.contents())(scope);
                    generateGrid();


                });

                scope.$watch("dt", function (newValue, oldValue) {

                    scope.block = false;
                    element.empty();
                    $compile(element.contents())(scope);
                    generateGrid();


                });



                var generateGrid = function () {



                    console.log("outlet :" + scope.outletId);
                    console.log("date :" + scope.dt);

                    var scheduleGrid = angular.element("<schedule-grid>");
                    scheduleGrid.attr('outletid', '{{outletId}}');
                    scheduleGrid.attr('sdate', '{{dt | date:"MM-dd-yyyy"}}');
                    scheduleGrid.attr('block', '{{block}}');


                    element.append(scheduleGrid);
                    $compile(element.contents())(scope);
                }

                //})
            },
            restrict: "E",
            replace: true
        }

    }
    zd.$inject = injectParams;

    app.register.directive('dailyScheduleAdmin', zd);
});
