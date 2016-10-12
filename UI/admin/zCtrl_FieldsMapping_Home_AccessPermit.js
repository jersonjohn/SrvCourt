angular.module("zPage_Home_AccessPermit")


.controller("fieldsMappingCtrl", ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field',
    function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_Field) {

        $scope.group = {
            name: 'fieldsMapping',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'fieldsMapping' }),
            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'fieldDetail' }),
            gridResourceURL: zSrv_ResourceServer.getURL('fieldsMappingURL'),   // only apply to externalPaginationGrid
            //gridDetailResourceURL: zSrv_ResourceServer.getURL('fieldDetailURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createFieldsMapping',
            editModelURL: '/editFieldsMapping',
            //editDetailModelURL: '/editFieldDetail',
            listModelURL: '/listFieldsMapping',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'List Field Mapping',
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
            resourceURL: zSrv_ResourceServer.getURL('fieldsMappingURL'),
            modelResource: null,
            cookieGridState: 'listFieldsMappingCtrl_Grid1',
            zData: {},
            indexKey: 'Id'
        };

        var grp = $scope.group;
        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            //grp.zData.FieldElementOptions = zSrv_Field.getDataFormFieldArray();
            zSrv_InputCustom.routeChangeSuccess($scope.group);



        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        


    }]);







