'use strict';
//eApptMasterCustomerController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

    $scope.group = {
            name: 'eApptMasterCustomer',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterCustomer' }),

            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrCustomerUrl'),

            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterOutlet' }),
            //gridDetailResourceURL: eApptMtrOutletUrl,

            //editDetailModelURL: 'editOutlet',
            //createDetailModelURL: 'createOutlet',
            parentReferenceField: 'ConsultantId',

            createModelURL: '/createeApptCustomer',
            editModelURL: '/editeApptCustomer',
            listModelURL: '/listeApptCustomer',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Customer Master',
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
            resourceURL: zSrv_ResourceServer.getURL('eApptMtrCustomerUrl'),
            modelResource: null,
            cookieGridState: 'listConsultantCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: '',
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

    app.register.controller('eApptMasterCustomerController', zc);

});
