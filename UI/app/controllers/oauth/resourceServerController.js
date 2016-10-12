'use strict';
//resourceServerController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'resourceServer',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'resourceServer' }),
            gridResourceURL: zSrv_ResourceServer.getURL('resourceServerURL'),

            gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'resourceServerApi' }),
            gridDetailResourceURL: zSrv_ResourceServer.getURL('resourceServerApiURL'),
            editDetailModelURL: 'editResourceServerApi',
            createDetailModelURL: 'createResourceServerApi',
            parentReferenceField: 'ResourceServerId',

            createModelURL: '/createResourceServer',
            editModelURL: '/editResourceServer',
            listModelURL: '/listResourceServer',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Resource Server Master',
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
            resourceURL: zSrv_ResourceServer.getURL('resourceServerURL'),
            modelResource: null,
            cookieGridState: 'listresourceServerCtrl_Grid1',
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
        var grp = $scope.group;

        grp.newDetailModel = function () {
            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
        }


    }

    zc.$inject = injectParams;

    app.register.controller('resourceServerController', zc);

});
