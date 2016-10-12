'use strict';
//eApptMasterBrandController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


         $scope.group = {
            name: 'eApptMasterBrand',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterBrand' }),
            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrBrandUrl'),


            gridDetailOutletColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterOutlet' }),
            gridDetailOutletResourceURL: zSrv_ResourceServer.getURL('eApptMtrOutletUrl'),
            
            editDetailOutletModelURL: 'editeApptOutlet',
            createDetailOutletModelURL: 'createeApptOutlet',
		   
            gridDetailVipCategoryColumnFields: zSrv_InputCustom.formFields({ name: 'eApptVipCategory' }),
            gridDetailVipCategoryResourceURL: zSrv_ResourceServer.getURL('eApptMtrVipCategoryUrl'),

            editDetailVipCategoryModelURL: 'eApptMtrVipCategoryUrl',
            createDetailVipCategoryModelURL: 'createeApptVipCategory',
		    
            
            gridDetailStatusColumnFields: zSrv_InputCustom.formFields({ name: 'eApptStatus' }),
            gridDetailStatusResourceURL: zSrv_ResourceServer.getURL('eApptMtrApptStatusUrl'),
            
            editDetailStatusModelURL: 'editeApptStatus',
            createDetailStatusModelURL: 'createeApptStatus',


		   
            gridDetailReminderTypeColumnFields: zSrv_InputCustom.formFields({ name: 'eApptReminderType' }),
            gridDetailReminderTypeResourceURL: zSrv_ResourceServer.getURL('eApptMtrReminderTypeUrl'),
           
            editDetailReminderTypeModelURL: 'editeApptReminderType',
            createDetailReminderTypeModelURL: 'createeApptReminderType',



		   
		   
            parentReferenceField: 'BrandId',

            createModelURL: '/createeApptBrand',
            editModelURL: '/editeApptBrand',
            listModelURL: '/listeApptBrand',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Brand Master',
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
		    resourceURL: zSrv_ResourceServer.getURL('eApptMtrBrandUrl'),
            modelResource: null,
            cookieGridState: 'listBrandCtrl_Grid1',
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

		grp.newDetailOutletModel = function () {
            grp.ngLocation.path(grp.createDetailOutletModelURL + "/" + grp.referenceId);
        }
		
        grp.newDetailVipCategoryModel = function () {
            grp.ngLocation.path(grp.createDetailVipCategoryModelURL + "/" + grp.referenceId);
        }
		
        grp.newDetailStatusModel = function () {
            grp.ngLocation.path(grp.createDetailStatusModelURL + "/" + grp.referenceId);
        }
		
		 grp.newDetailReminderTypeModel = function () {
            grp.ngLocation.path(grp.createDetailReminderTypeModelURL + "/" + grp.referenceId);
        }

    }

    zc.$inject = injectParams;

    app.register.controller('eApptMasterBrandController', zc);

});
