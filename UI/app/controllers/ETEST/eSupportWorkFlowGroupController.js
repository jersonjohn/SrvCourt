'use strict';
//eSupportWorkFlowGroupController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

         $scope.group = {
            name: 'eSupportWorkFlowGroup',
            gridColumnFields: zSrv_InputCustom.formFields({name:'eSupportWorkFlowGroup'}),
            gridResourceURL: zSrv_ResourceServer.getURL('eSupportWFGroupUrl'),
		   
            //Detail 1
		   
            gridDetailColumnFields: zSrv_InputCustom.formFields({name:'eSupportPriorityDetails'}),
            gridDetailResourceURL: zSrv_ResourceServer.getURL('eSupportPriorityDetailsUrl'),
            editDetailModelURL: 'editPriorityDetails',
            createDetailModelURL: 'createPriorityDetails',
		   
		    //Detail 2
		   
		    gridDetailColumnFields2 : zSrv_InputCustom.formFields({name:'eSupportStatusDetails'}),
            gridDetailResourceURL2 : zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl'),
            editDetailModelURL2 : 'editeSuppStatusDetails',
            createDetailModelURL2 : 'createeSuppStatusDetails',
		   
		    //Detail 3
		   
		    gridDetailColumnFields3 : zSrv_InputCustom.formFields({name:'eSupportIssueCategory'}),
            gridDetailResourceURL3 : zSrv_ResourceServer.getURL('eSupportIssueCategoryUrl'),
            editDetailModelURL3 : 'editeeSupportIssueCategory',
            createDetailModelURL3 : 'createeSupportIssueCategory',
		   
		    //Detail 4
		   
		    gridDetailColumnFields4 : zSrv_InputCustom.formFields({name:'eSupportDepts'}),
            gridDetailResourceURL4 : zSrv_ResourceServer.getURL('eSupportDeptsUrl'),
            editDetailModelURL4 : 'editeeSupportDepts',
            createDetailModelURL4 : 'createeSupportDepts',
		   
		    //Detail 5
		   
		    gridDetailColumnFields5 : zSrv_InputCustom.formFields({name:'eSupportOutlets'}),
            gridDetailResourceURL5 : zSrv_ResourceServer.getURL('eSupportOutletsUrl'),
            editDetailModelURL5 : 'editeeSupportDepts',
            createDetailModelURL5 : 'createeSupportDepts',
		   
		    //Detail 6
		   
		    gridDetailColumnFields6 : zSrv_InputCustom.formFields({name:'eSupportBrands'}),
            gridDetailResourceURL6 : zSrv_ResourceServer.getURL('eSupportBrandsUrl'),
            editDetailModelURL6 : '',
            createDetailModelURL6 : '',

            createModelURL: '/createWorkFlowGroup',
            editModelURL: '/editWorkFlowGroup',
            listModelURL: '/listWorkFlowGroup',
            gridClickKey: 'row.entity.Id',
		   
		    
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'eSupport System',
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
            resourceURL: zSrv_ResourceServer.getURL('eSupportWFGroupUrl'), 
            modelResource: null,
            cookieGridState: 'listAuditLogCtrl_Grid1',
            dept: 'IT',
            SuppTickTypeOptions: [{ "Name": "Assigned Tickets", "value": "0" }, { "Name": "Own Tickets", "value": "0" }, { "Name": "Department Tickets", "value": "3" }, { "Name": "All Tickets", "value": "3" }],
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'GroupId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
		    zData : {}
        }

        $scope.$on("$routeChangeSuccess", function() {
            zSrv_InputCustom.routeChangeSuccess($scope.group);
            //console.log("Fields : " + JSON.stringify($scope.group.fields));
		  
		    //zSrv_InputCustom.get()
		    //?referId='+grp.zModel.GroupId
		  
        });

        var grp = $scope.group;
	  
	    grp.LatestDeptsFromiBudget = function(){
		    grp.isLoading = true;
		   
			        
			        zSrv_InputCustom.httpPost('/api/updateDeptsFromiBudget', grp.zData.Depts).then(function (respDepts) {
					   
					   grp.zData.Depts = respDepts;
					   
					   grp.gridOptions5.data = respDepts;
					   grp.isLoading = false;
					  
					});
			 
		
		}
		
		grp.LatesOutletsFromAES = function(){
		  
		            grp.isLoading = true;
			        zSrv_InputCustom.httpPost('/api/syncfromaesoutlets', grp.zData.Depts).then(function (respOutlets) {
					  grp.zData.Outlets = respOutlets;
					  grp.gridOptions5.data = respOutlets;
					  grp.isLoading = false;
					   
					});			        
                    //zSrv_OAuth2.storeInMemory('Depts', grp.zData.Depts);
		
		}
		
		grp.LatesBrandsFromAES = function(){
		  
		          grp.isLoading = true;
			        zSrv_InputCustom.httpPost('api/syncfromaesbrands', grp.zData.Depts).then(function (respBrands) {
					  
					  grp.zData.Brands = respBrands;
					  grp.gridOptions6.data = respBrands;
					  grp.isLoading = false;
					   
					});			        
                    //zSrv_OAuth2.storeInMemory('Depts', grp.zData.Depts);
		
		}

        grp.newDetailModel = function() {
            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
        }
		
		grp.newDetailModel2 = function() {
            grp.ngLocation.path(grp.createDetailModelURL2 + "/" + grp.referenceId);
        }
		
		grp.newDetailModel3 = function() {
            grp.ngLocation.path(grp.createDetailModelURL3 + "/" + grp.referenceId);
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);


    }

    zc.$inject = injectParams;

    app.register.controller('eSupportWorkFlowGroupController', zc);

});
