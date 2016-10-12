angular.module("zPage_Home_AccessPermit")


.controller("fieldDetailCtrl", ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants',
    function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants) {
               
        $scope.group = {
            name: 'fieldDetail',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'fieldDetail' }),
            //gridResourceURL: fieldDetailUrl,   // only apply to externalPaginationGrid
            createModelURL: '/createFieldDetail',
            editModelURL: '/editFieldDetail',
            listModelURL: '/listFieldDetail',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'Field Detail Elements',
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
            resourceURL: zSrv_ResourceServer.getURL('fieldDetailURL'),
            modelResource: null,
            cookieGridState: 'listFieldDetailsCtrl_Grid1'
        };

       

        $scope.$on("$routeChangeSuccess", function () {
            
            zSrv_InputCustom.routeChangeSuccess($scope.group);


        });
//        var grp = $scope.group;

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);



    }]);

        


       


