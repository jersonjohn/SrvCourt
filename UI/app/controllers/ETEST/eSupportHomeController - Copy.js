'use strict';
//eSupportHomeController
define(['app'], function (app) {

    var injectParams = ['$rootScope','$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', 'zSrv_eSupportMasterData'];

    var zc = function ($rootScope,$scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, zSrv_eSupportMasterData) {

        var vm = this;

        $scope.group = {
            name: 'eSupportHome',
            gridColumnFields: zSrv_InputCustom.formFields({name:'eSupportHome'}),
            gridResourceURL: zSrv_ResourceServer.getURL('eSupportHomeUrl'),//eSupportHomeUrl,
		   
            //TicketDetailsFlow
		   
            gridDetailColumnFields: zSrv_InputCustom.formFields({name:'ticketDetailsFlow'}),
            gridDetailResourceURL: zSrv_ResourceServer.getURL('eSupportTktDetailsUrl'),
            //gridDetailButtons: zSrv_InputCustom.formButtons({ name: 'gridDetailButtons' }),
            editDetailModelURL: 'edittktdetails',
            createDetailModelURL: 'createtktdetails',

            createModelURL: '/createticket',
            editModelURL: '/editticket',
            listModelURL: '/eSupportHome',
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
            resourceURL: zSrv_ResourceServer.getURL('eSupportHomeUrl'), //eSupportHomeUrl,
            modelResource: null,
            cookieGridState: 'listAuditLogCtrl_Grid1',
            dept: 'IT',
            SuppTickTypeOptions: [{ "Name": "Assigned Tickets", "value": "0" }, { "Name": "Own Tickets", "value": "0" }, { "Name": "Department Tickets", "value": "3" }, { "Name": "All Tickets", "value": "3" }],
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'TicketId',
		    //parentReferenceField : 'TicketId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            fileUploadUrl: '/api/TicketFileAttachment',
            indexKey: 'Id',
            newModel: null,
            zData : {}
        }

        $scope.$on("$routeChangeSuccess", function() {
		  
            var routeInit = zSrv_InputCustom.routeChangeSuccess($scope.group);
		  
             
            routeInit.then(function() {
             
                console.log("RouteChangeSuccess zModel : " + JSON.stringify(grp.zModel));
                
                _routeChangeStart();
                if(grp.ngLocation.path().indexOf(grp.createModelURL) >= 0) {
					 
                    grp.zModel.StatusVal = 8;

                    grp.zModel.Status = 0;
				
				    var field = findFieldByName($scope.group.fields, 'Brand');
                    if (field)
                        field.Disabled = false;
				  
                    grp.zModel.AssignedBy = $rootScope.MyProfile.UserName;
					     
                    var field = findFieldByName($scope.group.fields,'Status');
                    if(field)
                        field.Disabled = true;


                    field = findFieldByName($scope.group.fields,'Outlet');
                    if(field)
                        field.Disabled = false;

                    field = findFieldByName($scope.group.fields,'IssueCategory');
                    if(field)
                        field.Disabled = false;

                    field = findFieldByName($scope.group.fields,'Department');
                    if(field)
                        field.Disabled = false;

                    field = findFieldByName($scope.group.fields,'Description');
                    if(field)
                        field.ReadOnly = false;
                } else if (grp.ngLocation.path().indexOf(grp.editModelURL) >= 0) {
					 
                    console.log("zModel : "+JSON.stringify(grp.zModel));

                    var field = findFieldByName($scope.group.fields,'Outlet');
                    if(field)
                        field.Disabled = true;

                    var field = findFieldByName($scope.group.fields, 'Brand');
                    if (field)
                        field.Disabled = true;

                    field = findFieldByName($scope.group.fields,'IssueCategory');
                    if(field)
                        field.Disabled = true;

                    field = findFieldByName($scope.group.fields,'Department');
                    if(field)
                        field.Disabled = true;

                    field = findFieldByName($scope.group.fields,'Description');
                    if(field)
                        field.ReadOnly = true;


                    field = findFieldByName($scope.group.fields,'Status');

                    if(field)
                        field.Disabled = false;	    
                }
               
            });		     		   
        });
	  
        var grp = $scope.group;
	  
        var _routeChangeStart = function () {
		   
		  
            grp.zData = zSrv_eSupportMasterData.getAllData();
		  
            //console.log("Data : "+JSON.stringify(grp.zData));
		  
            grp.zData.DeptUsers = grp.zData.Users;
 
            console.log("URL : "+$location.url());
		  
        }

        grp.BrandOnChange = function() {
		  
            if(!grp.zModel.BrandVal.Id)
                return;
		  
            var rec = findRecordById(grp.zData.Brands, grp.zModel.BrandVal.Id);
		  
            //console.log("Brands : "+JSON.stringify(grp.zData.Brands) +'/n/n/n Selected Brand : '+JSON.stringify(rec));
		  
            grp.zModel.Brand = rec.Company_ID;
		  
            grp.zData.Outlets = findOutletsByBrand(grp.zData.AllOutlets ,rec.Company_ID);
		  
        }
        
        grp.DeptOnChange = function(){
		    
            //grp.zModel.Department = grp.zModel.DepartmentVal.Id;
            var rec = findRecordById(grp.zData.Depts, grp.zModel.DepartmentVal.Id);
		  
            if(rec){ 
		  
                grp.zModel.Department = rec.iBudDeptId;
                grp.zModel.AssignedDept = rec.iBudDeptId;
		  
                if(rec)
                    console.log("Selected Dept : "+console.log(JSON.stringify(rec)));

                var newUsers = findUsersByDept(grp.zData.Users,rec.Name);

                console.log("New Users : "+JSON.stringify(newUsers));

                grp.zData.DeptUsers = newUsers;
		  
            }
          
        }
	    
        grp.StatusOnChange = function(){
            var rec = findRecordById(grp.zData.StatusS, grp.zModel.StatusVal.Id);
            if (rec)
                grp.zModel.Status = rec.SortId;
        }
		
        grp.OutletOnChange = function(){
            var rec = findRecordById(grp.zData.Outlets, grp.zModel.OutletVal.Id);
            if (rec) {
                grp.zModel.OutletID = rec.Id;
                grp.zModel.OutletSNO = rec.SNo;
                grp.zModel.Brand = rec.Company_ID;
            }
        }
		
        grp.IssueCategoryOnChange = function(){
		   
            if(!$scope.group.isEdit) {	
                var rec = findRecordById(grp.zData.Categories, grp.zModel.IssueCategoryVal.Id);
                if (rec) {
                    grp.zModel.IssueCategory = rec.Id;
                    grp.zModel.Priority = rec.PriorityId;
                    grp.zModel.PriorityVal = rec.PriorityId;
                    grp.zModel.DepartmentVal = rec.DepartmentId;
                    grp.zModel.Description = rec.Description;
                }
            }
		
        }
		
        grp.PriorityOnChange = function(){
            var rec = findRecordById(grp.zData.Priorities, grp.zModel.PriorityVal.Id);
            if (rec) {
                grp.zModel.PriorityId = rec.Id;
            }		
        }
		
        // UsersOnChange
		
        grp.AssignedToOnChange = function() {
		  
		  if(grp.zModel.AssignedToVal)
            var rec = findRecordById(grp.zData.Users, grp.zModel.AssignedToVal);
		  
            if (rec) {
                grp.zModel.AssignedTo = rec.UserName;
                //var DeptName = rec.Department;
            }
        }
		
        grp.ListTkts = function(cat) {
		  
            $scope.isLoading = true;
		  
            console.log("GridOptions : "+JSON.stringify(grp.gridOptions.data));
		  
            //console.log("Profile : "+JSON.stringify($rootScope.MyProfile));
		  
            var userName = $rootScope.MyProfile.UserName;
			  
            console.log("Category Listing Type Selected : "+cat);
            var getUrl = '/api/SupportTickets/';
		  
            //'/api/tcktsbyuser/'+userName;
		  
            if(cat==1) {
                getUrl = '/api/tcktsbyuser/'+userName;
            } else if (cat == 2){
                getUrl = '/api/tcktsassignedtouser/'+userName;
            } else if(cat == 3) {
                getUrl = '/api/tcktsassignedbyuser/'+userName;
            }
		  
            var apiqueue0 = $q.defer();
		  
            var process0 = apiqueue0.promise;
		  
		  
			  
            zSrv_InputCustom.httpGet(getUrl, {}).then(function (respTcktsList) {
               
                console.log("Splice the existing data");
                //grp.gridOptions.splice();
                grp.gridOptions.data = respTcktsList;
			
                console.log("Assign the new data");
			
                apiqueue0.resolve();
            }, function (err) {
                apiqueue0.reject("Error");
                grp.alerts.push({ type: "danger", msg: err });
            });
		  
            $q.all([process0]).then(function(){
		  
                $scope.isLoading = false;
			
            });
		  
        }
		
        grp.SerachTickets = function() { 
		   
            alert("Search Clicked");
		  
        }
		
        /**** Custome Function to serach from Arrays ***/
		
        var findFieldByName = function (options, Name) {
            for (i in options) {
                if (options[i].Name == Name)
                    return options[i];
            }
            return null;
        }

		
        var findRecordBySNO = function (options,FieldValue) {
            for (i in options) {
                if (options[i].SNO == FieldValue)
                    return options[i];
            }
            return null;
        }
		
        var findRecordByUserName = function (options,FieldValue) {
            for (i in options) {
                if (options[i].UserName == FieldValue)
                    return options[i];
            }
            return null;
        }

        var findRecordByCID = function (options, FieldValue) {
            for (i in options) {
                if (options[i].Company_ID == FieldValue)
                    return options[i];
            }
            return null;
        }
		
        var findUsersByDept = function (options, Dept) {
            var newUsers = [];
            for (i in options) {
                if (options[i].Department == Dept) {
                    //options[i];
                    newUsers.push(options[i]);
                }
            }
		    
            return newUsers;
        }
		
        var findOutletsByBrand = function (options, Company_ID) {
            var newOutlets = [];
            for (i in options) {
                if (options[i].Company_ID == Company_ID) {
                    //options[i];
                    newOutlets.push(options[i]);
                }
            }
		    
            return newOutlets;
        }
		
        var findRecordById = function (options, id) {
            for (i in options) {
                if (options[i].Id == id)
                    return options[i];
            }
            return null;
        }
		

        var findRecordByCustomeFieldValue = function(options,Field,Value) {
            
            for (i in options) {
                if(eval('options[i].'+Field+'=='+Value)) 
                    return options[i];
            }
            return null;
        }

        /**** End Custome Function to serach from Arrays ***/
		
        grp.newDetailModel = function() {


            grp.ngLocation.path(grp.createDetailModelURL + "/" + grp.referenceId);


        }
		
        grp.getModelAfterSuccess = function() {
		  
            if (grp.ngLocation.path().indexOf(grp.editModelURL) >= 0) {
			  
			    var queue0 = $q.defer();
                var process0 = queue0.promise;
			  
			    var queue1 = $q.defer();
                var process1 = queue1.promise;
			  
			    zSrv_InputCustom.httpGet('/api/getFilesBySupportId/'+grp.zModel.Id, {}).then(function (respFiles) {
                   
				   grp.zData.Files = respFiles;
                   queue0.resolve();
				  
                });
			  
			    zSrv_InputCustom.httpGet('/api/TicketDetailsFlows/?referId='+grp.zModel.Id, {}).then(function (respFiles) {
                   
				   grp.zData.TcktsDetails = respFiles;
                   queue1.resolve();
				  
                });
			    
                $q.all([process0,process1]).then(function(){
					  var rec = findRecordById(grp.zData.Status, grp.zModel.Status);
					  if (rec)
						  grp.zModel.StatusVal = rec.Id;

					  grp.zModel.PriorityVal = grp.zModel.Priority;
					  //grp.zModel.StatusVal = grp.zModel.Status;

					  var rec = findRecordByCID(grp.zData.Brands, grp.zModel.Brand);
					  if (rec)
						  grp.zModel.BrandVal = rec.Id;
					  //Brands
                      
				      console.log("DEPT USERS : "+JSON.stringify(grp.zData.DeptUsers));
				     				      
					  rec = findRecordByUserName(grp.zData.Users, grp.zModel.AssignedTo);

					  if (rec)
						  grp.zModel.AssignedToVal = rec.Id;
				      
					  grp.zModel.IssueCategoryVal = grp.zModel.IssueCategory;

					  grp.zModel.OutletVal = grp.zModel.OutletID;


					  rec = findRecordByCustomeFieldValue(grp.zData.Depts,'iBudDeptId',grp.zModel.Department);

					  if(rec)
						  grp.zModel.DepartmentVal = rec.Id;

					  rec = findRecordByCustomeFieldValue(grp.zData.Status, 'SortId', grp.zModel.Status);

					  if (rec)
						  grp.zModel.StatusVal = rec.Id;
			   });

            }
           
        }

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        grp.newFileUpload = function (ev) {
            mg.modalHeader = 'Upload File';
            //zMV_eSupportFileUpload.html
            var view = "/Scripts/app/views/eSupport/zMV_eSupportFileUpload.html";
            mg.files = {};
            mg.showModal($scope, ev, view, false).then(function () {
            }, function () { });
        }

        mg.onFileUploadSuccess = function () {
            console.log("Inside the onFileUploadSuccess");
            var data = mg.successResult.data;
		     zSrv_InputCustom.httpGet('/api/getFilesBySupportId/'+grp.zModel.Id, {}).then(function (respFiles) {
                   
				   grp.zData.Files = respFiles;
                   				  
                });
            //mg.zModalAttachment.unshift(data);
            grp.ImageCount = Number(grp.ImageCount) + 1;
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);


    }

    zc.$inject = injectParams;

    app.register.controller('eSupportHomeController', zc);

});
