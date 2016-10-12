'use strict';
//dependenciesController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'dependencies',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'dependencies' }),
            gridResourceURL: zSrv_ResourceServer.getURL('dependenciesURL'),
            createModelURL: '/createoauthdependencies',
            editModelURL: '/editoauthdependencies',
            listModelURL: '/listoauthdependencies',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Dependencies Modules',
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
            resourceURL: zSrv_ResourceServer.getURL('dependenciesURL'),
            modelResource: null,
            cookieGridState: 'listDependenciesCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
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
	  
	    var _uploadCode = function (source) {
	        zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('adminCodeURL'), {
	            'ctrl': source,
	            'path': 'dependencies',
	        }).then(function () {
	            grp.alerts.push({ type: 'success', msg: 'Saved successfully.' });
	            grp.isLoading = false;
	            zSrv_zNotify.note('success', 'Dependency Deployed', 'This dependency module is released to production successfully.');
	        }, function (err) {
	            grp.alerts.push({ type: "danger", msg: err });
	            grp.isLoading = false;
	        });
	    }

	    grp.DeployModel = function (ev) {

	        zSrv_MagnificPopUp.showConfirm(null, 'Deploy Confirmation', 'Do you want to deploy this dependency to production now?').then(function () {

	            _uploadCode(grp.zModel);
	          
	        }, function () {
	        });

	    }
	  	
	    grp.CompressDeployModel = function (ev) {

	        zSrv_MagnificPopUp.showConfirm(null, 'Deploy Confirmation', 'Do you want to deploy this dependency to production now?').then(function () {

	            var c = angular.copy(grp.zModel);
	            var ast = UglifyJS.parse(c.Code);

	            // compressor needs figure_out_scope too
	            ast.figure_out_scope();
	            var compressor = UglifyJS.Compressor()
	            ast = ast.transform(compressor);

	            // need to figure out scope again so mangler works optimally
	            ast.figure_out_scope();
	            ast.compute_char_frequency();
	            ast.mangle_names();

	            // get Ugly code back :)
	            c.Code = ast.print_to_string();

	            _uploadCode(c);
            }, function () {
            });

        }



    }

    zc.$inject = injectParams;

    app.register.controller('dependenciesController', zc);

});
