'use strict';
//clientController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

        $scope.group = {
            name: 'client',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'client' }),
            gridResourceURL: zSrv_ResourceServer.getURL('clientURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createClient',
            editModelURL: '/editClient',
            listModelURL: '/listClients',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Client Master',
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
            //            ngCookies: $cookies,
            resourceURL: zSrv_ResourceServer.getURL('clientURL'),
            modelResource: null,
            //            cookieGridState: 'listClientsCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'AccountId',
            referenceId: null,
            listClientUserURL: '/listClientUsers',
            treeMenuRelationshipURL: '/treeMenuRelationship',
            menuAccessGrantsURL: '/roleMenuItemAccessGrants',
            addUserCollectionModelURL: '/createUser',
            listUserCollectionModelURL: '/listUsers',
            addRoleCollectionModelURL: '/createRole',
            listRoleCollectionModelURL: '/listRoles',
            addMenuItemCollectionModelURL: '/createMenuItem',
            listMenuItemCollectionModelURL: '/listMenuItems',
            addRouteCollectionModelURL: '/createRoute',
            listRouteCollectionModelURL: '/listRoutes',
            indexKey: 'Id',
            newModel: null,
            gridState: null,
            //gridDefaultState: null,
            scope: $scope

        }

        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);
            if ($scope.group.ngLocation.path().indexOf($scope.group.createModelURL) == 0) {
                $scope.group.zModel.AccountId = $scope.group.referenceId;
            }
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        $scope.group.listClientUser = function () {
            if ($scope.group.referenceId)
                $scope.group.ngLocation.path($scope.group.listClientUserURL + "/" + $scope.group.referenceId);
            else
                alert("There is no clientId to this form referenceId, hence cannot access user authorization");
        }

        $scope.group.treeMenuRelationship = function () {
            if ($scope.group.referenceId)
                $scope.group.ngLocation.path($scope.group.treeMenuRelationshipURL + "/" + $scope.group.referenceId);
            else
                alert("There is no clientId to this form referenceId, hence cannot access user authorization");
        }

        $scope.group.getModelAfterSuccess = function () {
            $scope.group.zModel.ApplicationType = String($scope.group.zModel.ApplicationType);
        }

        $scope.group.menuAccessGrants = function () {
            $scope.group.ngLocation.path($scope.group.menuAccessGrantsURL + "/");
        }

        $scope.group.addUserCollectionModel = function (model) {
            $location.path($scope.group.addUserCollectionModelURL + "/" + model[$scope.group.currentModelReferenceId]);
        }

        $scope.group.listUserCollectionModel = function (model) {
            $location.path($scope.group.listUserCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.addRoleCollectionModel = function (model) {
            $location.path($scope.group.addRoleCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.listRoleCollectionModel = function (model) {
            $location.path($scope.group.listRoleCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.addMenuItemCollectionModel = function (model) {
            $location.path($scope.group.addMenuItemCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.listMenuItemCollectionModel = function (model) {
            $location.path($scope.group.listMenuItemCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.addRouteCollectionModel = function (model) {
            $location.path($scope.group.addRouteCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

        $scope.group.listRouteCollectionModel = function (model) {
            $location.path($scope.group.listRouteCollectionModelURL + "/" + model[$scope.group.indexKey]);
        }

    }

    zc.$inject = injectParams;

    app.register.controller('clientController', zc);

});
