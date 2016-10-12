'use strict';
//eApptMasterAppointmentController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$rootScope', 'zSrv_UtilService','zSrv_MasterData'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify,$rootScope,zSrv_UtilService,zSrv_MasterData) {

        var vm = this;
        //last updated on 26/7/2016
        
         $scope.group = {
            name: 'eApptMasterAppointment',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterAppointment' }),

            gridResourceURL:  zSrv_ResourceServer.getURL('eApptAppointmentUrl'),

            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'eApptMasterOutlet' }),
            //gridDetailResourceURL: eApptMtrOutletUrl,

            //editDetailModelURL: 'editOutlet',
            //createDetailModelURL: 'createOutlet',
            parentReferenceField: 'AssignToConsultantId',

            createModelURL: '/createeApptAppointment',
            editModelURL: '/editeApptAppointment',
            listModelURL: '/listeApptAppointment',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Master Appointment',
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
            resourceURL: zSrv_ResourceServer.getURL('eApptAppointmentUrl'),
            modelResource: null,
            cookieGridState: 'listAppointmentCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: '',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            zData: {}
        }

        var grp = $scope.group;
	  
	    grp.OnChangeText=function(){
		  
	        var Customer_AesId = grp.zModel.CustomerId_AES;

	        if (Customer_AesId == null || Customer_AesId == "" || Customer_AesId == "undefined" || typeof Customer_AesId == undefined){
	            return;
	        }
	        var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
		  zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getCustomerByAesId/' + Customer_AesId).then(function (respCustomer) {
                    grp.zData.CustomerDetails = respCustomer; 
			
			       if( grp.zData.CustomerDetails != null  &&  grp.zData.CustomerDetails.length > 0)
				   {
					      grp.zModel.CustomerId = grp.zData.CustomerDetails[0].Id;
					      grp.zModel.CustomerName = grp.zData.CustomerDetails[0].Name;
					      grp.zModel.TelNo =  grp.zData.CustomerDetails[0].TelNo;
					      grp.zModel.MobileNo =  grp.zData.CustomerDetails[0].MobileNo;
					      grp.zModel.Origin_ConsultantId =  grp.zData.CustomerDetails[0].ConsultantId;
					      grp.zModel.ConsultantName = grp.zData.CustomerDetails[0].ConsultantName;
					       
			              //grp.alerts.push({ type: "danger", msg: grp.zData.CustomerDetails.Name });
				   }
			       //else
				   //{
				   //  grp.alerts.push({ type: "danger", msg: 'Invalid Customer Id' });
				   //}
                });
		  
		  
	    }

	    grp.OnChangeTime = function() {
	        var BookTime = grp.zModel.BookTime;

	        var time = zSrv_UtilService.convertTimeTo24Hour(BookTime);
	        grp.zModel.Slot = time.substr(0,2)+ ":00"

	    }

	  

        $scope.$on("$routeChangeSuccess", function () {
      
            var routeChangeSuccess = zSrv_InputCustom.routeChangeSuccess($scope.group);
           
            routeChangeSuccess.then(function () {
                $scope.apptData = zSrv_MasterData.getApptData();

                $scope.masterData = zSrv_MasterData.getMasterData();

                $scope.outlets = $scope.masterData.Outlets;
                grp.zData.ConsultantOptions = $scope.apptData.Consultants;
                grp.zData.StatusOptions = $scope.masterData.status;
                grp.zData.ReminderTypeOptions = $scope.masterData.ReminderTypes
                grp.zData.OutletDetails = getOutletData($rootScope.outletId);

                var beds = [];
                var bedAvailble = grp.zData.OutletDetails.Beds;
                for (var count = 0; count <= bedAvailble; count++) {
                    var bedNo = { "Id": count, "Name": count };
                    beds.push(bedNo);
                }
                grp.zData.BedsOptions = beds;


                if (grp.ngLocation.path().indexOf(grp.createModelURL) >= 0) {
                   

                    var field = findFieldByName($scope.group.fields, 'CustomerId_AES');
                    if (field) {
                        field.Focus = true;
                    }

                 

                   

                    grp.zModel.BookDate = getDate(new Date());
                    grp.zModel.Status = 0;
                    grp.zModel.BedNo = 0;
                   
                }
                else if (grp.ngLocation.path().indexOf(grp.editModelURL) >= 0) {
                    $scope.previosSlot = grp.zModel.Slot;
                }
            });
            
		   
        });

        var getDate = function (d) {
            var date = new Date(d);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (day.length < 2) day = "0" + day;
            if (month.length < 2) month = "0" + month;
            return month + "-" + day + "-" + year;
        }

        var findFieldById = function (options, Id) {
            for (i in options) {
                if (options[i].Id == Id)
                    return options[i];
            }
            return null;
        }
        var findFieldByName = function (options, Name) {
            for (i in options) {
                if (options[i].Name == Name)
                    return options[i];
            }
            return null;
        }

          var findFieldByNameInTab = function (options, Name) {
            for (i in options) {
                if (options[i].Name.indexOf("divTab") > -1) {

                    for (var j in options[i].Value) {
                        if (options[i].Value[j].Name == Name) {
                            return options[i].Value[j];
                        }
                    }
                    return null;
                }
            }
            return null;
        }

        var getOutletData = function (outletId) {

            for (i in $scope.outlets) {
                if ($scope.outlets[i].Id == outletId) {
                    return $scope.outlets[i]
                }
            }

        }

        



        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

      
        grp.createAppointment = function () {

            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.zModal = {};

            var ev = null;

            if (grp.ngLocation.path().indexOf(grp.createModelURL) >= 0) {
                grp.zModel.AssignedBy_ConsultantId = $rootScope.consultantId;
                grp.zModel.OutletId = $rootScope.outletId;

                var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');

                zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentSlotStatus', { "sdate": grp.zModel.BookDate, "outletId": grp.zModel.OutletId, "slot": grp.zModel.Slot, "consultantId": grp.zModel.AssignToConsultantId }).then(function (reply) {

                    if (reply != "") {
                        mg.showConfirm(ev, reply, 'Do u want to save as  Waiting list??').then(function () {

                            grp.zModel.Status = 3;
                            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), grp.zModel).then(function (appointment) {

                                grp.zModel = appointment[0];
                                zSrv_zNotify.note('success', 'Record Added', 'Success save Appointment.');



                            }, function (err) {

                                grp.isLoading = false;
                            });


                        }, function () {
                           

                        });
                    }
                    else
                    {
                        grp.zModel.Status = 2;
                        zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), grp.zModel).then(function (appointment) {
                            grp.zModel = appointment[0];
                            zSrv_zNotify.note('success', 'Record Added', 'Success save Appointment.');



                        }, function (err) {

                            grp.isLoading = false;
                        });
                    }
                });
                
            }
            else if (grp.ngLocation.path().indexOf(grp.editModelURL) >= 0) {

                if (grp.zModel.Slot == $scope.previosSlot) {
                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + grp.zModel.Id, grp.zModel).then(function (appointment) {
                        grp.zModel = appointment[0];
                        zSrv_zNotify.note('success', 'Record Updated', 'Success Updated Appointment.');



                    }, function (err) {

                        grp.isLoading = false;
                    });
                }
                else {

                    var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
                    zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentSlotStatus', { "sdate": grp.zModel.BookDate, "outletId": grp.zModel.OutletId, "slot": grp.zModel.Slot, "consultantId": grp.zModel.AssignToConsultantId }).then(function (reply) {

                        if (reply != "") {
                            mg.showConfirm(ev, reply, 'Do u want to save as  Waiting list??').then(function () {

                                grp.zModel.Status = 3;
                                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + grp.zModel.Id, grp.zModel).then(function (appointment) {
                                    grp.zModel = appointment[0];
                                    zSrv_zNotify.note('success', 'Record Added', 'Success save Appointment.');



                                }, function (err) {

                                    grp.isLoading = false;
                                });


                            }, function () {


                            });
                        }
                        else {
                            grp.zModel.Status = 2;
                            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), grp.zModel).then(function (appointment) {
                                grp.zModel = appointment[0];
                                zSrv_zNotify.note('success', 'Record Added', 'Success save Appointment.');



                            }, function (err) {

                                grp.isLoading = false;
                            });
                        }
                    });

                }
            }

        }

        grp.closePage = function () {
          
            grp.ngLocation.path(grp.listModelURL);
            //mg.zModal = {};
        }


        grp.getModelAfterSuccess = function (data) {
            
            var Customer_AesId = data.CustomerId_AES;
            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
		   if (Customer_AesId != null && Customer_AesId != "undefined")
		   {
		       zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getCustomerByAesId/' + Customer_AesId).then(function (respCustomer) {
                    grp.zData.CustomerDetails = respCustomer; 
			
			       if( grp.zData.CustomerDetails != null  &&  grp.zData.CustomerDetails.length > 0)
				   {
					      //grp.zModel.CustomerId = grp.zData.CustomerDetails[0].Id;
					      grp.zModel.CustomerName = grp.zData.CustomerDetails[0].Name;
					      //grp.zModel.TelNo =  grp.zData.CustomerDetails[0].TelNo;
					      //grp.zModel.MobileNo =  grp.zData.CustomerDetails[0].MobileNo;
					      //grp.zModel.Origin_ConsultantId =  grp.zData.CustomerDetails[0].ConsultantId;
					      grp.zModel.ConsultantName = grp.zData.CustomerDetails[0].ConsultantName;
					       
			              //grp.alerts.push({ type: "danger", msg: grp.zData.CustomerDetails.Name });
				   }
			       //else
				   //{
				   //  grp.alerts.push({ type: "danger", msg: 'Invalid Customer Id' });
				   //}
                });
		   } 
		  
	
        }
		
    }

    zc.$inject = injectParams;

    app.register.controller('eApptMasterAppointmentController', zc);

});
