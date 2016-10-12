'use strict';
//routeController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'route',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'route' }),
            gridResourceURL: zSrv_ResourceServer.getURL('routeURL'),
            createModelURL: '/createRoute',
            editModelURL: '/editRoute',
            listModelURL: '/listRoutes',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Route Master',
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
            resourceURL: zSrv_ResourceServer.getURL('routeURL'),
            modelResource: null,
            cookieGridState: 'listRoutesCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null
        }

        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);

        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);



    }

    zc.$inject = injectParams;

    app.register.controller('routeController', zc);

});
