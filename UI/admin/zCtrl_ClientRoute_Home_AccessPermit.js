angular.module("zPage_Home_AccessPermit")

.controller("clientRouteCtrl", ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants',
    function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants) {

        $scope.group = {
            name: 'clientRoute',
            createModelURL: '/createClientRoute',
            editModelURL: '/editClientRoute',
            listModelURL: '/listClientRoutes',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Client Route Master',
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
            resourceURL: zSrv_ResourceServer.getURL('clientRouteURL'),
            modelResource: null,
            cookieGridState: 'listClientRoutesCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
            addRouteCollectionModelURL: '/createRoute',
            listRouteCollectionModelURL: '/listRoutes',
            indexKey: 'Id',
            newModel: null
        }

        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);

        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        $scope.group.addRouteCollectionModel = function (model) {
            $location.path($scope.group.addRouteCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.listRouteCollectionModel = function (model) {
            $location.path($scope.group.listRouteCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

    }]);
