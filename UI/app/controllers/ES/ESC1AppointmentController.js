'use strict';
//eApptC1AppointmentController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$rootScope', 'zSrv_UtilService','zSrv_MasterData'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify,$rootScope,zSrv_UtilService,zSrv_MasterData) {

        var vm = this;

        //last updated on 26/07/2016
         $scope.group = {
            name: 'eApptC1Appointment',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptC1Appointment' }),

            gridResourceURL:  zSrv_ResourceServer.getURL('eApptC1AppointmentUrl'),

           
            //parentReferenceField: '',

            createModelURL: '/createeApptC1Appointment',
            editModelURL: '/editeApptC1Appointment',
            listModelURL: '/listeApptC1Appointment',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'New Customers',
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
            resourceURL: zSrv_ResourceServer.getURL('eApptC1AppointmentUrl'),
            modelResource: null,
            cookieGridState: 'listC1AppointmentCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: '',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            zData: {}
        }

        var grp = $scope.group;
	  
	   

          $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);

        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);
    }
       

    zc.$inject = injectParams;

    app.register.controller('eApptC1AppointmentController', zc);

});
