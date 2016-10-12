'use strict';
//eApptMasterConsultantGMController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify','$rootScope'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify,$rootScope) {

        var vm = this;

        var param = { 'id': $rootScope.consultantId };

 $scope.group = {
            name: 'eApptMasterConsultantGM',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterConsultantGM' }),

            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'),

            
            //gridDetailCustomerColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterCustomer' }),
            //gridDetailCustomerResourceURL: zSrv_ResourceServer.getURL('eApptMtrCustomerUrl'),

            //editDetailCustomerModelURL: 'editeApptCustomer',
            //createDetailCustomerModelURL: 'createeApptCustomer',

            //gridDetailAppointmentColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterAppointment' }),
            //gridDetailAppointmentResourceURL: zSrv_ResourceServer.getURL('eApptAppointmentUrl'),

            //editDetailAppointmentModelURL: 'editeApptAppointment',
            //createDetailAppointmentModelURL: 'createeApptAppointment',

            parentReferenceField: 'OutletId',
			
   

            createModelURL: '/createeApptConsultant',
            editModelURL: '/editeApptConsultantGM',
            listModelURL: '/listeApptConsultantGM',
            gridClickKey: 'row.entity.Id',
            //gridClickKey: $rootScope.consultantId,
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
            ngRouteParams: { 'id': $rootScope.consultantId },
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
           // $scope.group.ngRouteParams.id = $rootScope.consultantId;
            zSrv_InputCustom.routeChangeSuccess($scope.group);
            ;
		    $scope.group.ngLocation.path('/editeApptConsultantGM/' + $rootScope.consultantId);

        });

        function showObject(obj) {
            var result = "";
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    result += p + " , " + obj[p] + "\n";
                }
            }
            return result;
        }

        //$scope.group.ngRouteParams.id = $rootScope.consultantId;
        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

	   
        var grp = $scope.group;

       
        //grp.newDetailCustomerModel = function () {
        //    grp.ngLocation.path(grp.createDetailCustomerModelURL + "/" + grp.referenceId);
        //}

        //grp.newDetailAppointmentModel = function () {
        //    grp.ngLocation.path(grp.createDetailAppointmentModelURL + "/" + grp.referenceId);
        //}

        grp.OnChangeResignDate = function () {
            grp.zModel.ExpiryDate = grp.zModel.ResignDate;
        }

        grp.closePage = function () {

            grp.ngLocation.path('/listeApptDailyAppointmentByBrand');
            
        }

        grp.saveConsultant = function () {

            zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl') + "/" + grp.zModel.Id, grp.zModel).then(function () {
              
                zSrv_zNotify.note('success', 'Record Updated', 'Success save Consultant.');



            }, function (err) {

                grp.isLoading = false;
            });

        }
		

    }

    zc.$inject = injectParams;

    app.register.controller('eApptMasterConsultantGMController', zc);

});
