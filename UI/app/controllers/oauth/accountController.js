'use strict';
//accountController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

        $scope.group = {
            name: 'account',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'account' }),
            //gridResourceURL: clientUrl,   // only apply to externalPaginationGrid
            createModelURL: '/createAccount',
            editModelURL: '/editAccount',
            listModelURL: '/listAccounts',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Account Master',
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
            resourceURL: zSrv_ResourceServer.getURL('accountURL'),
            modelResource: null,
            cookieGridState: 'listAccountsCtrl_Grid1',
            //referenceResourceURL: null,
            referenceModelResource: null,
            currentModelReferenceId: null,
            //referenceId: null,
            addUserCollectionModelURL: '/createUser',
            listUserCollectionModelURL: '/listUsers',
            addClientCollectionModelURL: '/createClient',
            listClientCollectionModelURL: '/listClients',
            indexKey: 'Id',
            newModel: null,
            gridState: null,
            //gridDefaultState: null,
            scope: $scope
            //            ngCookies: $cookies
        };


        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);
        });


        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        $scope.group.addClientCollectionModel = function (model) {
            $location.path($scope.group.addClientCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.listClientCollectionModel = function (model) {
            $location.path($scope.group.listClientCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }


    }

    zc.$inject = injectParams;

    app.register.controller('accountController', zc);

});
