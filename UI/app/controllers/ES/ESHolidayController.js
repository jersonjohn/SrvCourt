'use strict';
//eApptHolidayController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
        name: 'eApptHoliday',
        gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptHoliday' }),

        gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'),

        //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterConsultant' }),
        //gridDetailResourceURL: eApptMtrConsultantUrl,

        //editDetailModelURL: 'editConsultant',
        //createDetailModelURL: 'createConsultant',


        //gridDetailColumnFields1: zSrv_InputCustom.formFields({ name: 'eApptSetting' }),
        //gridDetailResourceURL1: eApptMtrSettingUrl,

        //editDetailModelURL1: 'editSetting',
        //createDetailModelURL1: 'createSetting',

        //parentReferenceField: 'BrandId',

        createModelURL: '/createeApptHoliday',
        editModelURL: '/editeApptHoliday',
        listModelURL: '/listeApptHoliday',
        gridClickKey: 'row.entity.Id',
        showGridEditButton: true,
        canKeyEditDuringCreation: false,
        zModel: {},
        alerts: [],
        //isMyProfile: false,
        isEdit: true,
        isLoading: false,
        cancelButtonName: 'Cancel',
        formHeader: 'Holiday Master',
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
        resourceURL: zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'),
        modelResource: null,
        cookieGridState: 'listHolidayCtrl_Grid1',
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

	  
	/*
    var grp = $scope.group;

    grp.getModelAfterSuccess = function () {
        if (grp.ngLocation.path().indexOf(grp.editModelURL) != -1) {
            grp.editModel = function (id) {
                grp.ngLocation.path(grp.editDetailModelURL + "/" + id);
            }
        }

    }

    grp.newDetailModel = function () {
        grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
    }
    */
	  

    }

    zc.$inject = injectParams;

    app.register.controller('eApptHolidayController', zc);

});
