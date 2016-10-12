'use strict';

//eApptMasterOutletController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;
        //last updated on 26/7/2016

        $scope.group = {
            name: 'eApptMasterOutlet',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterOutlet' }),

            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrOutletUrl'),

		  
            gridDetailConsultantColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterConsultant' }),
            gridDetailConsultantResourceURL: zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'),
            
            editDetailConsultantModelURL: 'editeApptConsultant',
            createDetailConsultantModelURL: 'createeApptConsultant',

            
            gridDetailSettingColumnFields: zSrv_InputCustom.formFields({ name: 'eApptSlotSetting' }),
            gridDetailSettingResourceURL: zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'),

            editDetailSettingModelURL: 'editeApptSlotSetting',
            createDetailSettingModelURL: 'createeApptSlotSetting',
            
            gridDetailPfSettingColumnFields: zSrv_InputCustom.formFields({ name: 'eApptPfDaySetting' }),
            gridDetailPfSettingResourceURL: zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'),

            editDetailPfSettingModelURL: 'editeApptPfDaySetting',
            createDetailPfSettingModelURL: 'createeApptPfDaySetting',


            gridDetailWkdaySettingColumnFields: zSrv_InputCustom.formFields({ name: 'eApptWkdaySetting' }),
            gridDetailWkdaySettingResourceURL: zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'),

            editDetailWkdaySettingModelURL: 'editeApptWkDaySetting',
            createDetailWkdaySettingModelURL: 'createeApptWkDaySetting',


            parentReferenceField: 'OutletId',
			

            createModelURL: '/createeApptOutlet',
            editModelURL: '/editeApptOutlet',
            listModelURL: '/listeApptOutlet',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Outlet Master',
            fields: [],
            buttonTop: [],
            buttons: [],
            gridOptions: {},
		    gridOptions2: {},
		    gridOptions3: {},
		    gridOptions4: {},
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
		    resourceURL: zSrv_ResourceServer.getURL('eApptMtrOutletUrl'),
            modelResource: null,
            cookieGridState: 'listOutletCtrl_Grid1',
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
        /*
        grp.getModelAfterSuccess = function () {
            if (grp.ngLocation.path().indexOf(grp.editModelURL) != -1) {
                grp.editModel = function (id) {
                    grp.ngLocation.path(grp.editDetailModelURL + "/" + id);
                }
            }

        }
		*/

        grp.newDetailConsultantModel = function () {
            grp.ngLocation.path(grp.createDetailConsultantModelURL + "/" + grp.referenceId);
        }

        grp.newDetailSettingModel = function () {
            grp.ngLocation.path(grp.createDetailSettingModelURL + "/" + grp.referenceId);
        }
		
        grp.newDetailPfSettingModel = function () {
            grp.ngLocation.path(grp.createDetailPfSettingModelURL + "/" + grp.referenceId);
        }
        grp.newDetailWkdaySettingModel = function () {
            grp.ngLocation.path(grp.createDetailWkdaySettingModelURL + "/" + grp.referenceId);
        }
    }

    zc.$inject = injectParams;

    app.register.controller('eApptMasterOutletController', zc);

});
