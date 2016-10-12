'use strict';
//eSupportStatusDetailsController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

         $scope.group = {
            name: 'eSupportStatusDetails',
            gridColumnFields: zSrv_InputCustom.formFields({name:'eSupportStatusDetails'}),
            gridResourceURL: zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl'),//eSupportHomeUrl,
		   
		    parentReferenceField: 'GroupId',
		   
            createModelURL: '/createeSuppStatusDetails',
            editModelURL: '/editeSuppStatusDetails',
            listModelURL: '/listeSuppStatusDetails',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'eSupport Status Details',
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
            resourceURL: zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl'), //eSupportHomeUrl,
            modelResource: null,
            cookieGridState: 'listAuditLogCtrl_Grid1',
            dept: 'IT',
            SuppTickTypeOptions: [{ "Name": "Assigned Tickets", "value": "0" }, { "Name": "Own Tickets", "value": "0" }, { "Name": "Department Tickets", "value": "3" }, { "Name": "All Tickets", "value": "3" }],
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            //currentModelReferenceId: 'TicketId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
		    zData:{},
		    priorityOptionsCollection:[
										{
										  "id": "0",
										  "label": "p1"
										},
										{
										  "id": "1",
										  "label": "p2"
										}
									  ]
        }

        $scope.$on("$routeChangeSuccess", function() {
		  
            var promise = zSrv_InputCustom.routeChangeSuccess($scope.group);
		    
		    promise.then(function() {
			  
			  _routeChangeStart();
			  
			});
		    
            console.log("Fields : " + JSON.stringify($scope.group.fields));
		  
        });
	  
	    var grp = $scope.group;
	  
	    var _routeChangeStart = function () {
		   if (zSrv_OAuth2.isExistInMemory('priorityOptions'))
                grp.zData.priorityOptions = zSrv_OAuth2.restoreInMemory('priorityOptions');
            else {
               var promise1 = zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl')+'?referId='+grp.zModel.GroupId, {}).then(function (respPriorities) {
                    grp.zData.priorityOptions = respPriorities;
                    zSrv_OAuth2.storeInMemory('priorityOptions', grp.zData.priorityOptions);
				   });
			  
			    promise1.then(function() {
							console.log("zData : "+JSON.stringify($scope.group.zData.priorityOptions));
							console.log("Before Loop the :"+JSON.stringify($scope.group.priorityOptionsCollection));
							for(var n in $scope.group.zData.priorityOptions){

							  var nitem = {};
							  nitem.id = $scope.group.zData.priorityOptions[n].Id;
							  nitem.label = $scope.group.zData.priorityOptions[n].StatusText;
							  $scope.group.priorityOptionsCollection.push(nitem);
							}
							console.log("After Loop the :"+JSON.stringify($scope.group.priorityOptionsCollection));
			    });
			} 
		}
 
        grp.newDetailModel = function() {
            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);
    }

    zc.$inject = injectParams;

    app.register.controller('eSupportStatusDetailsController', zc);

});
