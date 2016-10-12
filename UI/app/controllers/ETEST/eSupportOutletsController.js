'use strict';
//eSupportOutletsController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

         $scope.group = {
            name: 'eSupportDepts',
            gridColumnFields: zSrv_InputCustom.formFields({name:'eSupportOutlets'}),
            gridResourceURL: zSrv_ResourceServer.getURL('eSupportOutletsUrl'),
		   
            createModelURL: '',
            editModelURL: '',
            listModelURL: '/listeSupportOutlets',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'eSupport Outlets',
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
		    ngScope : $scope,
            resourceURL: zSrv_ResourceServer.getURL('eSupportOutletsUrl'),
            modelResource: null,
            cookieGridState: 'listAuditLogCtrl_Grid1',
            dept: 'IT',
            SuppTickTypeOptions: [{ "Name": "Assigned Tickets", "value": "0" }, { "Name": "Own Tickets", "value": "0" }, { "Name": "Department Tickets", "value": "3" }, { "Name": "All Tickets", "value": "3" }],
            referenceModelResource: null,
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null
        }

        $scope.$on("$routeChangeSuccess", function() {
            zSrv_InputCustom.routeChangeSuccess($scope.group);
            console.log("Fields : " + JSON.stringify($scope.group.fields));
        });

        var grp = $scope.group;

        grp.newDetailModel = function() {
            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);


    }

    zc.$inject = injectParams;

    app.register.controller('eSupportOutletsController', zc);

});
