'use strict';

//PageCommissionController 

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp) {
        var vm = this;
        $scope.group = {
            name: 'cpCandidate',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'Commission' }),
        
            gridResourceURL: zSrv_ResourceServer.getURL('CommissionUrl'),   // only apply to externalPaginationGrid
            parentReferenceField: 'Id',
            createModelURL: '/createCommission',
            editModelURL: '/editCommission',
            listModelURL: '/listCommission',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Commission ',
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
            resourceURL: zSrv_ResourceServer.getURL('CommissionUrl'),
            modelResource: null,
            cookieGridState: 'listcpCandidateCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'Candidate_Id',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            zData: {}
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);
        var grp = $scope.group;
        grp.routeChangeCompleted = function () {
        };

        $scope.$on("$routeChangeSuccess", function () {
            var promise = zSrv_InputCustom.routeChangeSuccess($scope.group);
            promise.then(function () {
                _routeChangeStart();
            });
        });


        var _routeChangeStart = function () {


          
        }
      
      
    };

    zc.$inject = injectParams;

    app.register.controller('CommissionController', zc);


});

