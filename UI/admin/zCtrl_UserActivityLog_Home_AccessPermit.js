angular.module("zPage_Home_AccessPermit")

.controller("userActivityLogCtrl", ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants',
    function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants) {
               
        $scope.group = {
            name: 'userActivityLog',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'userActivityLog' }),
            gridResourceURL: zSrv_ResourceServer.getURL('userActivityLogURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createUserActivityLog',
            editModelURL: '/editUserActivityLog',
            listModelURL: '/listUserActivityLogs',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'User Activity Log',
            fields: [],
            buttonTop: [],
            buttons: [],
            gridOptions: {},
            toggleFiltering: null,
            listModels: null,
            editModel: null,
            getModel: null,
            updateModel: null,
            createModel: null,
            deleteModel: null,
            uiGridConstants: uiGridConstants,
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,
            ngScope: $scope,
            resourceURL: zSrv_ResourceServer.getURL('userActivityLogURL'),
            modelResource: null,
            cookieGridState: 'listUserActivityLogsCtrl_Grid1'
        };

       

        $scope.$on("$routeChangeSuccess", function () {
            
            zSrv_InputCustom.routeChangeSuccess($scope.group);


        });


        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        var grp = $scope.group;

        
    }]);

        


       


