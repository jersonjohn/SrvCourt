'use strict';
//eApptMasterConsultantController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

 $scope.group = {
            name: 'eApptMasterConsultant',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterConsultant' }),

            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'),

            
            gridDetailCustomerColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterCustomer' }),
            gridDetailCustomerResourceURL: zSrv_ResourceServer.getURL('eApptMtrCustomerUrl'),

            editDetailCustomerModelURL: 'editeApptCustomer',
            createDetailCustomerModelURL: 'createeApptCustomer',

            gridDetailAppointmentColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterAppointment' }),
            gridDetailAppointmentResourceURL: zSrv_ResourceServer.getURL('eApptAppointmentUrl'),

            editDetailAppointmentModelURL: 'editeApptAppointment',
            createDetailAppointmentModelURL: 'createeApptAppointment',

            parentReferenceField: 'OutletId',
			
   

            createModelURL: '/createeApptConsultant',
            editModelURL: '/editeApptConsultant',
            listModelURL: '/listeApptConsultant',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Consultant Master',
            fields: [],
            buttonTop: [],
            buttons: [],
            gridOptions: {},
            gridOptions2: {},
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
            resourceURL: zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'),
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

	   
        var grp = $scope.group;

       
        grp.newDetailCustomerModel = function () {
            grp.ngLocation.path(grp.createDetailCustomerModelURL + "/" + grp.referenceId);
        }

        grp.newDetailAppointmentModel = function () {
            grp.ngLocation.path(grp.createDetailAppointmentModelURL + "/" + grp.referenceId);
        }

        grp.OnChangeResignDate = function () {
            grp.zModel.ExpiryDate = grp.zModel.ResignDate;
        }
		

    }

    zc.$inject = injectParams;

    app.register.controller('eApptMasterConsultantController', zc);

});
