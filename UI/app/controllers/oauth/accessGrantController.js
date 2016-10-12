'use strict';
//accessGrantController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'accessGrant',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'accessGrant' }),
            //           gridResourceURL: clientUrl,   // only apply to externalPaginationGrid
            createModelURL: '/createAccessGrant',
            editModelURL: '/editAccessGrant',
            listModelURL: '/listAccessGrants',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Access Grant',
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
            resourceURL: zSrv_ResourceServer.getURL('accessGrantURL'),
            modelResource: null,
            cookieGridState: 'listAccessGrantsCtrl_Grid1'
        };


        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);



    }

    zc.$inject = injectParams;

    app.register.controller('accessGrantController', zc);

});
