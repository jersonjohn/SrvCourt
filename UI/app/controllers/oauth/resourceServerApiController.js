'use strict';
//resourceServerApiController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


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
            ngScope: $scope,
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




    }

    zc.$inject = injectParams;

    app.register.controller('resourceServerApiController', zc);

});
