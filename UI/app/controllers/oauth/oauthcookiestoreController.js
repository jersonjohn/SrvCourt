'use strict';
//oauthcookiestoreController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', ];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field) {

        var vm = this;

        $scope.group = {
            name: 'oauthcookiestore',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'oauthcookiestore' }),
            gridResourceURL: zSrv_ResourceServer.getURL('oauthcookiestoreURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createoauthcookiestore',
            editModelURL: '/editoauthcookiestore',
            listModelURL: '/listoauthcookiestore',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'OAuth CookieStore Master',
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
            resourceURL: zSrv_ResourceServer.getURL('oauthcookiestoreURL'),
            modelResource: null,
            cookieGridState: 'listoauthcookiestoreCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            //currentModelReferenceId: 'IBudgetChargeCategoryId',
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

    app.register.controller('oauthcookiestoreController', zc);

});
