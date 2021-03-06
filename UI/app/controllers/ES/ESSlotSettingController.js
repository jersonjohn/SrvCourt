'use strict';
//eApptSlotSettingController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'eApptSlotSetting',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptSlotSetting' }),

            gridResourceURL: zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'),

            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterOutlet' }),
            //gridDetailResourceURL: eApptMtrOutletUrl,

            //editDetailModelURL: 'editOutlet',
            //createDetailModelURL: 'createOutlet',
            parentReferenceField: 'OutletId',

            createModelURL: '/createeApptSlotSetting',
            editModelURL: '/editeApptSlotSetting',
            listModelURL: '/listeApptSlotSetting',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Master Setting',
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
		    resourceURL: zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'),
            modelResource: null,
            cookieGridState: 'listSettingCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: '',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null
        }

        var grp = $scope.group;

        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);
           
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);


        /*
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

    app.register.controller('eApptSlotSettingController', zc);

});
