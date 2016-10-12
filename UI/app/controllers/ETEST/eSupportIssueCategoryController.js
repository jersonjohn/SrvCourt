'use strict';
//eSupportIssueCategoryController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;

         $scope.group = {
            name: 'eSupportIssueCategory',
            gridColumnFields: zSrv_InputCustom.formFields({name:'eSupportIssueCategory'}),
            gridResourceURL: zSrv_ResourceServer.getURL('eSupportIssueCategoryUrl'),
		    
		    parentReferenceField: 'GroupId',
		   
            createModelURL: '/createeSupportIssueCategory',
            editModelURL: '/editeeSupportIssueCategory',
            listModelURL: '/listeSupportIssueCategory',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'eSupport Issue Category',
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
            resourceURL: zSrv_ResourceServer.getURL('eSupportIssueCategoryUrl'),
            modelResource: null,
            cookieGridState: 'listAuditLogCtrl_Grid1',
            dept: 'IT',
            SuppTickTypeOptions: [{ "Name": "Assigned Tickets", "value": "0" }, { "Name": "Own Tickets", "value": "0" }, { "Name": "Department Tickets", "value": "3" }, { "Name": "All Tickets", "value": "3" }],
            referenceModelResource: null,
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
		    zData : {}
        }
		 
		var grp = $scope.group; 

        $scope.$on("$routeChangeSuccess", function() {
		  
		  
		     if (zSrv_OAuth2.isExistInMemory('eSupportDept'))
                grp.zData.DepartmentOptions = zSrv_OAuth2.restoreInMemory('eSupportDept');
            else
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportDeptsUrl'), {}).then(function (respDept) {
                    grp.zData.DepartmentOptions = respDept;
                    zSrv_OAuth2.storeInMemory('eSupportDept', grp.zData.DepartmentOptions);
                });
		  
		     if (zSrv_OAuth2.isExistInMemory('Priorities'))
                grp.zData.Priorities = zSrv_OAuth2.restoreInMemory('Priorities');
            else {
                
			    //+$scope.group.zModel.GroupId
			    console.log("grp.zModel.GroupId : "+$scope.group.zModel.GroupId);
			    zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportPriorityDetailsUrl')+'?referId=1', {}).then(function (respPriorities) {
                    grp.zData.Priorities = respPriorities;
                    zSrv_OAuth2.storeInMemory('Priorities', grp.zData.Priorities);
                });
			}
		  
		    //console.log("Departments : "+ JSON.stringify(grp.zData.DepartmentOptions));
		  
            zSrv_InputCustom.routeChangeSuccess($scope.group);
		    
            
        });

        

        grp.newDetailModel = function() {
            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);
        }
		
		grp.PriorityOnChange = function(){
		    //PriorityId
		  var rec = findRecordById(grp.zData.Priorities, grp.zModel.Priority.Id);
            if (rec) {
                grp.zModel.PriorityId = rec.Id;
			}
		
		}
		
		grp.DeptOnChange = function(){
		    //PriorityId
		  var rec = findRecordById(grp.zData.DepartmentOptions, grp.zModel.Department.Id);
            if (rec) {
                grp.zModel.DepartmentId = rec.Id;
			}
		
		}
		
		var findRecordById = function (options, id) {
            for (i in options) {
                if (options[i].Id == id)
                    return options[i];
            }
            return null;
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);


    }

    zc.$inject = injectParams;

    app.register.controller('eSupportIssueCategoryController', zc);

});
