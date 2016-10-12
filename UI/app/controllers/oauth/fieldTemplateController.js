'use strict';
//fieldTemplateController
define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants',
                        'zSrv_MagnificPopUp', 'Upload', 'zSrv_zNotify', 'zSrv_Field'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants,
                        zSrv_MagnificPopUp, Upload, zSrv_zNotify, zSrv_Field) {

        var vm = this;


        $scope.group = {
            name: 'fieldTemplate',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'fieldTemplate' }),
            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'fieldDetail' }),
            gridResourceURL: zSrv_ResourceServer.getURL('fieldTemplateURL'),   // only apply to externalPaginationGrid
            //gridDetailResourceURL: zSrv_ResourceServer.getURL('fieldDetailURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createFieldTemplate',
            editModelURL: '/editFieldTemplate',
            //editDetailModelURL: '/editFieldDetail',
            listModelURL: '/listFieldTemplate',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'List Field Template',
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
            resourceURL: zSrv_ResourceServer.getURL('fieldTemplateURL'),
            modelResource: null,
            cookieGridState: 'listFieldTemplateCtrl_Grid1',
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



    }

    zc.$inject = injectParams;

    app.register.controller('fieldTemplateController', zc);

});
