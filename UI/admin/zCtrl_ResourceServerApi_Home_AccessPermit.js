angular.module("zPage_Home_AccessPermit")



.controller("resourceServerApiCtrl", ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp',
    function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp) {

        $scope.group = {
            name: 'resourceServerApi',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'resourceServerApi' }),
            parentReferenceField: 'ResourceServerId',
            //gridResourceURL: resourceServerApiUrl,
            createModelURL: '/createResourceServerApi',
            editModelURL: '/editResourceServerApi',
            listModelURL: '/listResourceServerApi',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Resource Server API Details',
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
            resourceURL: zSrv_ResourceServer.getURL('resourceServerApiURL'),
            modelResource: null,
            cookieGridState: 'listresourceServerApiCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
            indexKey: 'Id',
            newModel: null,
        }

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            zSrv_InputCustom.routeChangeSuccess($scope.group);

            
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);



    }]);





