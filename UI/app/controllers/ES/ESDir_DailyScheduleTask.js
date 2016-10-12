/// <reference path="eApptSettingController.js" />
angular.module("zDir_DailyScheduleTask", ["zDir_ScheduleGrid"])
.directive("dailyScheduleTask", ['$compile', '$rootScope', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', '$location', 'dataService', '$http',
function ($compile, $rootScope, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, $location, dataService, $http) {
    return {


        link: function (scope, element, attrs) {


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

             

                console.log("outlet :"+ scope.outletId);
                console.log("date :" + scope.dt);

                var scheduleGrid = angular.element("<schedule-grid>");
                scheduleGrid.attr('outletid', '{{outletId}}');
                scheduleGrid.attr('sdate', '{{dt | date:"MM-dd-yyyy"}}');
                scheduleGrid.attr('block', '{{block}}');
               

                element.append(scheduleGrid);
                $compile(element.contents())(scope);
            }
        },
        restrict: "E",
        replace: true
    }
}]);

