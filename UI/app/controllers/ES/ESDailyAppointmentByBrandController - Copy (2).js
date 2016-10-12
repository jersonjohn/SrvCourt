'use strict';
//eApptDailyAppointmentByBrandController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', '$rootScope', 'dataService', 'zSrv_MasterData', 'zSrv_utilService','$timeout'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, $rootScope, dataService, zSrv_MasterData, zSrv_utilService,$timeout) {

        var vm = this;

        $scope.consultantId = 0;
        $scope.outletId = 0;
        $scope.consultantName = "";

        $scope.block = false;
        $scope.blockText = "Block";
        $scope.messages = "";
        $scope.showCancel = false;
        $scope.showCancelText = "Show Cancel";
        $scope.showName = false;
        $scope.showNameText = "Show Name";
        $scope.loadMasterData = false;
        $scope.generalslotsetting = [];
        $scope.weekdayslotSetting = [];
        $scope.preferslotSetting = [];
        $scope.vipCategory = [];
        $scope.vipCustomer = [];
        $scope.gridData = null;
        $scope.gridDataModel = [];
        $scope.rowHeaderData = [];
        $scope.rowHeaderDisplay = [];

        $scope.blockslot = [];
        $scope.blockEnabled = false;

        $scope.historyClickEnabled = false;

        $scope.consultanttotal = [];
        $scope.slottotal = [];

        var STATUS_CONFIRMED = 2;
        var STATUS_WAITING = 3;
        var STATUS_CANCELED = 4;
        var STATUS_CHECKIN = 6;
        var STATUS_NOSHOW =5


        $scope.specialdates = [];
        var defer_appdata = null;

        $scope.showCancelItems = function ($event) {
            var checkbox = $event.target;
            $scope.showCancel = checkbox.checked ? true : false;

        }

        $scope.showCustomerName = function ($event) {
            var checkbox = $event.target;
            $scope.showName = checkbox.checked ? true : false;

        }

        //$scope.$watch("outletId", function (newValue, oldValue) {
              
        //        scope.sdate = scope.dt;
        //        scope.isLoading = true;
        //        scope.block = false;
        //        element.empty();
        //        $compile(element.contents())(scope);
        //        generateGrid();
               
        //    });

        $scope.group = {

            formHeader: 'Outlet Daily Schedule-GM',

            name: 'eApptDailyAppointment',


            gridResourceURL: zSrv_ResourceServer.getURL('eApptDailyApptUrl'),
            createModelURL: '/createeApptAppointment',
            listModelURL: '/listeApptDailyAppointment',

            zModel: {},
            zData: {},
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,
        }

        var grp = $scope.group;

        var getDate = function (d) {
            var date = new Date(d);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (day.length < 2) day = "0" + day;
            if (month.length < 2) month = "0" + month;
            return month + "-" + day + "-" + year;
        }


        var getDateMMDDYYYY = function (d) {
            var date = new Date(d);
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString();
            var day = date.getDate().toString();

            if (day.length < 2) day = "0" + day;
            if (month.length < 2) month = "0" + month;
            return month + "/" + day + "/" + year;
        }


        var getAppointmentData = function () {
         

          

               return  zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                    $scope.apptData = zSrv_MasterData.getApptData();


                    $scope.columnHeader = $scope.apptData.Consultants;
                    $scope.gridData = $scope.apptData.Appointments;
                    $scope.blockslot = $scope.apptData.BlockSlot
                    $scope.c1Appointment = $scope.apptData.C1Appointment;


                    $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                    $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting

                    console.log('return appointment promise');


                });

          
        }

        $scope.$on("$routeChangeSuccess", function () {
            $scope.loadMasterData = false;

            zSrv_MasterData.loadLoginData().then(function () {

                $scope.consultantDetails = zSrv_MasterData.getLoginData();
               
              

                //get login consultant's brand and outlet
                $scope.consultantId = $scope.consultantDetails[0].ConsultantId;
                $scope.consultantName = $scope.consultantDetails[0].ConsultantName;
                $scope.outletId = $scope.consultantDetails[0].OutletId;
                $scope.outletName = $scope.consultantDetails[0].OutletName;

                $scope.brandId = $scope.consultantDetails[0].BrandId;
                $scope.brandName = $scope.consultantDetails[0].BrandName;
                $scope.brandShortName = $scope.consultantDetails[0].BrandShortName;

                $rootScope.brandId = $scope.brandId;
                $rootScope.outletId = $scope.outletId;
                $rootScope.consultantId = $scope.consultantId;

                //get master data from consultant's brand cand outlet
                $scope.masterData = zSrv_MasterData.getMasterData();
                $scope.outlets = $scope.masterData.Outlets;
                //$scope.outletData = $scope.masterData.OutletData;
                $scope.outletData = getOutletData($scope.outletId);
                $scope.displayData = $scope.masterData.DisplaySetting;
                $scope.vipCategory = $scope.masterData.VipCategory;
                $scope.brandSetting = $scope.masterData.BrandSettting;
                $scope.outletSetting = $scope.masterData.OutletSetting;
                $scope.generalslotsetting = $scope.masterData.GeneralSlotSetting;
                $scope.brand = $scope.masterData.brand;
                $scope.holidays = $scope.masterData.Holiday;
                $scope.accessSetting = $scope.masterData.AccessSetting;
                //$scope.userOutlets = getUserOutlets($rootScope.Profile.Name);

                $scope.specialdates = [];
                for(i in $scope.holidays){
                    $scope.specialdates.push(getDateMMDDYYYY($scope.holidays[i].Date));
                }
               

                //defer_appdata = $q.defer();
                var date = new Date();
                $scope.dt = date;
                $scope.sdate = getDate(date);

                zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                    $scope.apptData = zSrv_MasterData.getApptData();


                    $scope.columnHeader = $scope.apptData.Consultants;
                    $scope.gridData = $scope.apptData.Appointments;
                    $scope.blockslot = $scope.apptData.BlockSlot
                    $scope.c1Appointment = $scope.apptData.C1Appointment;


                    $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                    $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting

                    console.log('return appointment promise');


                });

                //$scope.today;
               
            });

        });


        
       
        //var getUserOutlets = function (name) {

        //    var userOutlets = [];
        //    for (i in $scope.accessSetting) {
        //        var rites = {};
        //        if ($scope.accessSetting[i].Name == name) {
        //            rites.Name = 
        //            rites.OutletId = $scope.accessSetting[i].OutletId;
        //            userOutlets.push(rites)
        //        }
        //    }
        //}


        
        var getOutletData = function (outletId) {

            for (i in $scope.outlets){
                if ($scope.outlets[i].Id == outletId) {
                    return  $scope.outlets[i]
                }
            }

        }

        //if block is enabled but user move to others
        $scope.cancelBlock = function () {
            if ($scope.block) {
                $scope.block = false;
                $scope.blockText = "Block";
            }
        }
     
       


        $scope.today = function () {

         
            $scope.cancelBlock();
            var date = new Date();
            $scope.dt = date;
            $scope.sdate = getDate(date);
            $scope.loadMasterData = false;
            zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                $scope.apptData = zSrv_MasterData.getApptData();

                
                $scope.columnHeader = $scope.apptData.Consultants;
                $scope.gridData = $scope.apptData.Appointments;
                $scope.blockslot = $scope.apptData.BlockSlot
                $scope.c1Appointment = $scope.apptData.C1Appointment;
             
             
                $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting

                

                $scope.loadMasterData = true;
            });
          
           
        }

       

        $scope.nextDay = function () {
            $timeout(function () {
            $scope.cancelBlock();
            var newDate = new Date($scope.dt);
            newDate.setDate(newDate.getDate() + 1);
            $scope.dt = newDate;
            $scope.sdate = getDate(newDate);
            $scope.loadMasterData = false;
            zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                $scope.apptData = zSrv_MasterData.getApptData();


                $scope.columnHeader = $scope.apptData.Consultants;
                $scope.gridData = $scope.apptData.Appointments;
                $scope.blockslot = $scope.apptData.BlockSlot
                $scope.c1Appointment = $scope.apptData.C1Appointment;


                $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting
                $scope.loadMasterData = true;
            });
            }, 500);
        }


        $scope.prevDay = function () {
            $timeout(function () {

                $scope.cancelBlock();
                var newDate = new Date($scope.dt);
                newDate.setDate(newDate.getDate() - 1);
                $scope.dt = newDate;
                $scope.sdate = getDate(newDate);
                $scope.loadMasterData = false;
                zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                    $scope.apptData = zSrv_MasterData.getApptData();


                    $scope.columnHeader = $scope.apptData.Consultants;
                    $scope.gridData = $scope.apptData.Appointments;
                    $scope.blockslot = $scope.apptData.BlockSlot
                    $scope.c1Appointment = $scope.apptData.C1Appointment;


                    $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                    $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting
                    $scope.loadMasterData = true;
                });
            }, 500);
        };

       
        

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

       
       
        $scope.OnChangeDate = function () {
            $scope.loadMasterData = false;
            
            var newDate = new Date($scope.dt);
            
            $scope.sdate = getDate(newDate);
            zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                $scope.apptData = zSrv_MasterData.getApptData();


                $scope.columnHeader = $scope.apptData.Consultants;
                $scope.gridData = $scope.apptData.Appointments;
                $scope.blockslot = $scope.apptData.BlockSlot
                $scope.c1Appointment = $scope.apptData.C1Appointment;


                $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting
                $scope.loadMasterData = true;
            });

        };


        $scope.blockSlot = function () {
            $scope.block = !$scope.block;

            if ($scope.block) {
                $scope.blockText = "Save Block";

            }
            else {
                $scope.blockText = "Block";
                $scope.saveBlock();
            }

        };

        $scope.showIdOrName = function () {
            $scope.showName = !$scope.showName;

            if ($scope.showName) {
                $scope.showNameText = "Show ID";
            }
            else {
                $scope.showNameText = "Show Name";
            }
        }

        $scope.showCancelAppt = function () {
            $scope.showCancel = !$scope.showCancel;

            if ($scope.showCancel) {
                $scope.showCancelText = "No Show Cancel";
            }
            else {
                $scope.showCancelText = "Show Cancel";
            }
        }


        $scope.OnChangeOutlet = function () {
            $scope.cancelBlock();

           
            $rootScope.outletId = $scope.outletId;

            $scope.loadMasterData = false;
            $scope.outletData = getOutletData($scope.outletId);
                //$scope.outletId = $scope.selectedOutlet.Id;
                $scope.outletName = $scope.outletData.Name;

                var newDate = new Date($scope.dt);
              
                $scope.sdate = getDate(newDate);
                zSrv_MasterData.loadApptData($scope.sdate, $scope.brandId, $scope.outletId, $scope.outletName).then(function () {
                    $scope.apptData = zSrv_MasterData.getApptData();


                    $scope.columnHeader = $scope.apptData.Consultants;
                    $scope.gridData = $scope.apptData.Appointments;
                    $scope.blockslot = $scope.apptData.BlockSlot
                    $scope.c1Appointment = $scope.apptData.C1Appointment;


                    $scope.weekdayslotSetting = $scope.apptData.WeekdaySlotSetting
                    $scope.preferslotSetting = $scope.apptData.PreferredSlotSetting
                    $scope.loadMasterData = true;
                });
            
        }

        $scope.OnChangeCustomerId = function () {

            $scope.message = "";
            $scope.modalGroup.zModal.CustomerName = "";
            var Customer_AesId = $scope.modalGroup.zModal.CustomerId_AES;

            if (Customer_AesId == "" || typeof Customer_AesId == "undefined") {
                return;
            }

           

            var ev = null;
            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getCustomerByAesId/' + Customer_AesId).then(function (respCustomer) {
                $scope.CustomerDetails = respCustomer;

                if ($scope.CustomerDetails != null && $scope.CustomerDetails.length > 0) {



                    if ($scope.CustomerDetails[0].ConsultantId != $scope.modalGroup.zModal.AssignToConsultantId) {

                        $scope.message = "Customer belongs to another Consultant";
                    }

                    if ($scope.CustomerDetails[0].OutletId != $scope.outletId) {

                        $scope.message = "Customer belongs to another Outlet";
                    }

                    $scope.modalGroup.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                    $scope.modalGroup.zModal.CustomerId = $scope.CustomerDetails[0].Id;
                    $scope.modalGroup.zModal.Origin_ConsultantId = $scope.CustomerDetails[0].ConsultantId;
                    $scope.modalGroup.zModal.Origin_ConsultantName = $scope.CustomerDetails[0].ConsultantName;



                }
                else {
                    //$scope.brand.ShortName = "YN";
                    //$scope.brand.Aes_Company_Id = "SG03";
                    var AesWebApi = zSrv_ResourceServer.getURL('eApptAesCustomerUrl') + "api/" + $scope.brandShortName + "/Customer/fnGetCustomerDetails";
                    AesWebApi = AesWebApi.replace(resourceServerUrl,'');

                    var customer = {};
                    customer.CustomerID = Customer_AesId;
                    customer.CompanyID = $scope.brand.Aes_Company_Id;

                    zSrv_InputCustom.httpPost(AesWebApi, customer).then(function (respAesCustomer) {
                        $scope.AesCustomerDetails = respAesCustomer;

                        if ($scope.AesCustomerDetails.isExist == false) {
                            $scope.message = "Customer not exists in AES";

                            return;
                        }
                        else {
                            var customerBranch = $scope.AesCustomerDetails.customer.objbeCustomerBranch.Branch_ID;


                            if ($scope.AesCustomerDetails.customer.objbeCustomerConsultant.Staff_ID != $scope.modalGroup.zModal.AssignToConsultantId) {
                                $scope.message = "Customer belongs to another Consultant";
                            }

                            if ($scope.outletName != customerBranch) {
                                $scope.message = "Customer belongs to another Outlet";
                            }

                            var ConsultantId_AES = $scope.AesCustomerDetails.customer.objbeCustomerConsultant.Staff_ID;

                            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'),{"ConsultantId_AES" : ConsultantId_AES}).then(function (consultant) {

                                if(consultant[0].Id != null || consultant[0].Id != "" || typeof consultant[0].Id == "undefined") {
                                    $scope.modalGroup.zModal.CustomerName = $scope.AesCustomerDetails.customer.Customer_Name;
                                    $scope.modalGroup.zModal.CustomerId = $scope.AesCustomerDetails.customer.Customer_ID;
                                    $scope.modalGroup.zModal.Origin_ConsultantId = consultant[0].Id;
                                    $scope.modalGroup.zModal.Origin_ConsultantName = $scope.AesCustomerDetails.customer.objbeCustomerConsultant.Staff_Name;
                                    $scope.message = "";

                                    var customer = {};
                                    customer.CustomerId_AES = $scope.AesCustomerDetails.customer.Customer_ID;
                                    customer.Name = $scope.AesCustomerDetails.customer.Customer_Name;
                                    customer.ConsultantId = consultant[0].Id; //$rootScope.consultantId;
                                    customer.Gender = $scope.AesCustomerDetails.customer.Gender;
                                    customer.MobileNo = $scope.AesCustomerDetails.customer.HP_No;
                                    customer.TelNo = $scope.AesCustomerDetails.customer.Home_No;
                                    customer.ReminderType = "SMS";
                                    customer.NextAppointment = new Date(1998, 12, 31);
                                    customer.LastVisit = new Date(1998, 12, 31);
                                    customer.TransactionAmount = 0;

                                    zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptMtrCustomerUrl'), customer).then(function (newValue) {

                                        //alert("customer updated in eAppt");
                                    });
                                }
                            });

                        }

                    }, function () {
                        return;
                    });

                }
            });
        }




        $scope.getConsultantDetails = function (Id) {
            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');

            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/eApptMtrConsultantUrl/' + Id).then(function (respConsultant) {
                $scope.ConsultantDetails = respConsultant;

            });
        }

      


        $scope.OnChangeBookDate = function () {
           

            //var max_book_days = getMaxBookDays();

            //var currDate = new Date();
            //var bookDate = $scope.modalGroup.zModal.BookDate;

            //var days = ((bookDate - currDate) / 24 / 3600000);

            //if (days > max_book_days) {
            //    alert("cannot book more than 30 days advance");
            //}

            var outletId = $scope.outletId;
            var consultantId = $scope.modalGroup.zModal.AssignToConsultantId;
            var bookDate = $scope.modalGroup.zModal.BookDate;
            var bookTime = $scope.modalGroup.zModal.BookTime;

            var sdate = getDate(new Date(bookDate));
            var slot = zSrv_utilService.convertTimeTo24Hour(bookTime);


            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), { "sdate": sdate, "outletId": outletId, "slot": slot, "consultantId": consultantId }).then(function (respSlot) {

                if (respSlot.length > 0) {
                    $scope.message = "Slot not Available.Blocked"
                    $scope.F1.$invalid = true;
                    return;
                }

            });


        }

        $scope.OnChangeBookTime = function () {

            $scope.message = "";

            var outletId = $scope.outletId;
            var consultantId = $scope.modalGroup.zModal.AssignToConsultantId;
            var bookDate = $scope.modalGroup.zModal.BookDate;
            var bookTime = $scope.modalGroup.zModal.BookTime;

            var sdate = getDate(new Date(bookDate));
            var slot = zSrv_utilService.convertTimeTo24Hour(bookTime);


            var slotStart = $scope.rowHeader[0].OperatingFromHHMM.toString();
            var slotStop = $scope.rowHeader[0].OperatingToHHMM.toString();
            var interval = $scope.rowHeader[0].SlotInterval_Min;

            if (slotStart.length < 4) slotStart = "0" + slotStart;
            if (slotStop.length < 4) slotStop = "0" + slotStop;

            var d = new Date(bookDate);
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();



            var startTime = new Date(year, month, day);
            startTime.setHours(slotStart.substr(0, 2), slotStart.substr(2, 2), 0);

            var stopTime = new Date(year, month, day);
            stopTime.setHours(slotStop.substr(0, 2), slotStop.substr(2, 2), 0);


            var selTime = new Date(year, month, day);
            selTime.setHours(slot.substr(0, 2), slotStop.substr(2, 2), 0);

            if (selTime >= startTime && selTime < stopTime) {
                //$scope.F1.$invalid = false;
                $scope.modalGroup.invalidTime = false;

                //no need check block slot
                //zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptBlockSlotUrl') ,{"sdate" : sdate, "outletId":outletId,"slot" :slot ,"consultantId" : consultantId}).then(function (respSlot) {

                //    if (respSlot.length > 0) {
                //        $scope.message = "Slot not Available.Blocked"
                //        $scope.F1.$invalid = true;
                //        return;
                //    }

                //});
            }
            else {
                $scope.message = "Operating hours is " + slotStart + " - " + slotStop;
                //$scope.F1.$invalid = true;
                $scope.modalGroup.invalidTime = true;
            }

        }


        //check max book days
        var getMaxBookDays = function () {
            for (i in $rootScope.brandSetting) {
                if ($rootScope.brandSetting[i].Name == "APPT_NOT_BOOK_ABOVE_DAYS") {
                    return $rootScope.brandSetting[i].Value;
                }
            }

            return null;
        }

        

       
        //is slot available
        $scope.canAddAppointment = function (bookDate, BookTime, consultantId,calDate) {

            var c = new Date(calDate);
            var b = new Date(bookDate);

            var cyear = c.getFullYear();
            var cmonth = c.getMonth() +1;
            var cday = c.getDate();

            var byear = b.getFullYear();
            var bmonth = b.getMonth() +1;
            var bday = b.getDate();

            //check calendar date and  bookdate same then calculate all from the grid ..
            if (cyear == byear && cmonth == bmonth && cday == bday) {
                var row = $scope.getRefreshRow(BookTime);
                var col = $scope.getRefreshCol(consultantId);

                var slotBlocked = $scope.IsSlotBlocked(row, col);
                var bedAvailable = $scope.IsBedAvailable(row);
                var capacityAvailable = $scope.IsCapacityAvailable(row, col);

                var message = "";
                if (slotBlocked == true) {message = "Sloc Blocked!"; return message;}
                if (bedAvailable == false) {message = "Bed Not Available"; return message;}
                if (capacityAvailable == false){ message = "Capacity Exceed the Limit"; return message;}
                return message;
            }
            else {//else get all from database..

                var slot =  zSrv_utilService.convertTimeTo24Hour(BookTime); 
                var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
                zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentSlotStatus', { "sdate": bookDate, "outletId": $scope.outletId, "slot": slot, "consultantId": consultantId }).then(function (reply) {
                    return reply;

                }), function () {
                    return false;
                }

                
            }

           
           
        }

        $scope.refreshGrid = function (calDate, bookDate, row, col, rrow, rcol) {
            var refreshfromcell = row + "-" + col;
            var refreshtocell = rrow + "-" + rcol;
            var c = new Date(calDate);
            var b = new Date(bookDate);

            var cyear = c.getFullYear();
            var cmonth = c.getMonth() +1;
            var cday = c.getDate();

            var byear = b.getFullYear();
            var bmonth = b.getMonth() +1;
            var bday = b.getDate();

            if (cyear == byear && cmonth == bmonth && cday == bday) {
                if (refreshfromcell != refreshtocell) {
                    $scope.refreshGridCell(refreshfromcell);
                    $scope.refreshGridCell(refreshtocell);
                }
                else
                {
                    $scope.refreshGridCell(refreshfromcell);
                }
            }
            else {
                $scope.refreshGridCell(refreshfromcell);
            }
        }


        //call update view
        $scope.callUpdateAppointmentPopup = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {

           

            console.log('popup update called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
          
            mg.customerId = customerId;
            mg.customerName = customerName;
           

            mg.showCheckin = false;
            mg.showNoshow = false;

            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

            mg.zModal = {};

            
            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');


            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentDetails/' + appid).then(function (appointment) {

                mg.zModal = appointment[0];

               
                mg.consultants = $scope.apptData.Consultants;

                mg.beds = getBeds(date, time, row, col);
                var selBedNo = appointment[0].BedNo;
                if (selBedNo != 0) {
                    mg.beds.push({ "Id": selBedNo, "Name": selBedNo.toString() });
                }
                
                if (mg.zModal.Status == 3) {
                    mg.showCheckin = true;  //disable
                    mg.showNoshow = true;
                }

              


                //if confirmed appt, check original and assigned consultant
                if (appointment[0].AssignToConsultantId != appointment[0].Origin_ConsultantId && appointment[0].Status == 2)
                {
                    mg.zModal.StatusCode = "Assigned";
                }

                mg.showModal($scope, ev, view, false).then(function (answer) {

                    var OriginalStatus = mg.zModal.Status;

                    if (answer == 'OK') {

                      
                        if (OriginalStatus == STATUS_WAITING) {
                            mg.zModal.Status = STATUS_WAITING;
                        }
                        else if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                        else if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                        else {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                    
                    }

                    if (answer == 'Cancel') {
                        mg.zModal.Status = STATUS_CANCELED;
                    }
                    if (answer == 'NoShow') {
                        if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                    }

                    if (answer == 'CheckIn') {
                        if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                    }



                    mg.zModal.Slot = zSrv_utilService.convertTimeTo24Hour(appointment[0].BookTime); 

                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                        grp.isLoading = false;
                        zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                        var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                        var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);
                        var refreshcell = rrow + "-" + rcol;
                        var refreshfromcell = row + "-" + col;

                        var bookDate = newValue[0].BookDate;
                        bookDate.setHours(0, 0, 0, 0);

                        var calDate = new Date(date);
                        calDate.setHours(0, 0, 0, 0);

                        //if (new Date(date).getDate() == bookDate.getDate()) {


                        switch (mg.zModal.Status) {
                            case STATUS_CONFIRMED:
                                if (OriginalStatus == STATUS_CONFIRMED ) {
                                    $scope.refreshUpdateAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING){
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN){
                                    $scope.refreshConfirmCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                 }

                                break;

                            case STATUS_WAITING:
                                if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CANCELED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCancelAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshCancelhWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshCancelCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_NOSHOW :
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW)
                                {
                                    $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }

                                break;

                            case STATUS_CHECKIN:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN)
                                {
                                    $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                               
                                break;
                                
                        }
                            



                    }, function (err) {

                        grp.isLoading = false;
                    });




                }, function () {
                    console.log("error show update view");
                });

            }, function (err) {
                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                grp.isLoading = false;
            });



        }

        var getConsultantName = function (Id) {
            var ConsultantName = "";
            for (i in grp.zData.ConsultantOptions) {
                if (grp.zData.ConsultantOptions[i].Id == Id) {
                    ConsultantName = grp.zData.ConsultantOptions[i].Name;
                    break;
                }
            }
            return ConsultantName;
        }



        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }


        //list beds from 1 - total beds for the outlet
        var getBeds = function (date, time, row, col) {
            var beds = [];
            //var takenBeds = $scope.getTakenBeds(row, col);

            for (i = 0; i <= $scope.outletData.Beds; i++) {

                //if (!isInArray(i, takenBeds)) {


                    beds.push({ "Id": i, "Name": i.toString() });
                //}
            }
            return beds;
        }


        //popup add view
        $scope.callAddAppointmentPopup = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {



            console.log('popup add called');
            $scope.message = "";
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;


            var view = "scripts/app/views/eAppointment/zDailyApptNewView.html";

            mg.zModal = {};
            mg.consultants = {};

            mg.zModal.BookDate = date;
            mg.zModal.BookTime = time;
            mg.zModal.Customer_AES = "";

            mg.zModal.Remark = "";
            mg.zModal.ReminderType = 1;
            mg.zModal.IsScan = false;


            mg.zModal.AssignToConsultantId = consultantId;

            mg.showModal($scope, ev, view, false).then(function (answer) {

                if (answer == "Cancel") {
                    return;
                }
                
                mg.zModal.Id = 0;
                mg.zModal.Origin_ConsultantId = $scope.modalGroup.zModal.Origin_ConsultantId;;
                mg.zModal.OutletId = $scope.outletId;
                mg.zModal.AssignedBy_ConsultantId = $scope.consultantId;
                mg.zModal.Purpose = 1;
                mg.zModal.Status = 1;
                mg.zModal.BedNo = 0;
                mg.zModal.TelNo = "";
                mg.zModal.MobileNo = "";
                mg.zModal.IsScan = false;
                mg.zModal.AssignToConsultantId = consultantId;


                if (mg.zModal.CustomerId_AES == "" || typeof mg.zModal.CustomerId_AES == "undefined" || mg.zModal.CustomerName == "" || typeof mg.zModal.CustomerName == "undefined") {
                    return;
                }

                mg.zModal.CustomerId_AES = mg.zModal.CustomerId_AES.toUpperCase();




                if (answer == "OK") {


                    if (!$scope.isAvailable(mg.zModal.BookDate, mg.zModal.BookTime, consultantId)) {


                        mg.showConfirm(ev, 'Slot Not available', 'Do u want to save as  Waiting list??').then(function () {
                            console.log("Clicked Yes");
                            mg.zModal.Status = 3;
                            mg.zModal.StatusCode = "Waiting";

                            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (appointment) {

                                grp.isLoading = false;
                                var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";
                                var appid = appointment.Id;
                                mg.zModal = appointment;



                                var OriginalStatus = mg.zModal.Status;

                                mg.zModal.StatusCode = "Waiting";
                                mg.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                                mg.zModal.TelNo = $scope.CustomerDetails[0].TelNo;
                                mg.zModal.MobileNo = $scope.CustomerDetails[0].MobileNo;
                                mg.zModal.ConsultantName = $scope.CustomerDetails[0].ConsultantName;


                                //mg.consultants = grp.zData.ConsultantOptions;
                                mg.consultants = $scope.apptData.Consultants;

                                mg.beds = getBeds(date, time, row, col);

                                mg.showCheckin = false; //show
                                mg.showNoshow = false;

                                mg.showModal($scope, ev, view, false).then(function (answer) {

                                    $scope.message = "";

                                    if (answer == 'OK') {
                                        mg.zModal.Status = STATUS_WAITING;
                                    }
                                    if (answer == 'Cancel') {
                                        mg.zModal.Status = STATUS_CANCELED;
                                    }
                                    if (answer == 'NoShow') {
                                        mg.zModal.Status = STATUS_NOSHOW;
                                    }

                                    if (answer == 'CheckIn') {
                                        mg.zModal.Status = STATUS_CHECKIN;
                                    }



                                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                                        grp.isLoading = false;
                                        //zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                                        var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                                        var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);

                                        

                                        var refreshcell = rrow + "-" + rcol;
                                        var refreshfromcell = row + "-" + col;

                                        var bookDate = newValue[0].BookDate;
                                        bookDate.setHours(0, 0, 0, 0);

                                        var calDate = new Date(date);
                                        calDate.setHours(0, 0, 0, 0);

                                    if (mg.zModal.Status == STATUS_CONFIRMED) {


                                        $scope.refreshNewAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                        $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);

                                    }

                                        else if (mg.zModal.Status == STATUS_WAITING) {
                                                
                                               
                                            $scope.refreshWaitAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);

                                            }

                                        else if (mg.zModal.Status == STATUS_CANCELED) {
                                            if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                                    $scope.refreshCancelAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                                    $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                                }

                                            }

                                        else if (mg.zModal.Status == STATUS_CHECKIN) {
                                                if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                                    $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                                     $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                                }

                                            }
                                            else if (mg.zModal.Status == STATUS_NOSHOW) {
                                                if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                                    $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                                     $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                                }

                                            }
                                        



                                    }, function (err) {

                                        grp.isLoading = false;
                                    });




                                }, function () {
                                });



                            }, function (err) {

                                grp.isLoading = false;
                            });


                        }, function () {


                            console.log("Clicked NO");
                            return;
                           
                        });





                    }
                    else {

                        mg.zModal.Status = 2;
                        mg.zModal.StatusCode = "Confirmed";



                        zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (appointment) {

                            grp.isLoading = false;
                            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";
                            var appid = appointment.Id;
                            mg.zModal = appointment;



                            var OriginalStatus = mg.zModal.Status;

                            mg.zModal.StatusCode = "Confirmed";
                            mg.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                            mg.zModal.TelNo = $scope.CustomerDetails[0].TelNo;
                            mg.zModal.MobileNo = $scope.CustomerDetails[0].MobileNo;
                            mg.zModal.ConsultantName = $scope.CustomerDetails[0].ConsultantName;


                            //mg.consultants = grp.zData.ConsultantOptions;
                            mg.consultants = $scope.apptData.Consultants;
                            mg.beds = getBeds(date, time, row, col);

                            mg.showCheckin = true;
                            mg.showNoshow = true;

                            mg.showModal($scope, ev, view, false /*, "popup-basic bg-none mfp-with-anim mfp-hide" */).then(function (answer) {

                                if (answer == 'OK') {
                                    mg.zModal.Status = STATUS_CONFIRMED;
                                }
                                if (answer == 'Cancel') {
                                    mg.zModal.Status = STATUS_CANCELED;
                                }
                                if (answer == 'NoShow') {
                                    mg.zModal.Status = STATUS_NOSHOW;
                                }

                                if (answer == 'CheckIn') {
                                    mg.zModal.Status = STATUS_CHECKIN;
                                }



                                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                                    grp.isLoading = false;
                                    zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                                    var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                                    var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);

                                   

                                  

                                    var refreshcell = rrow + "-" + rcol;
                                    var refreshfromcell = row + "-" + col;

                                    var bookDate = newValue[0].BookDate;
                                    bookDate.setHours(0, 0, 0, 0);

                                    var calDate = new Date(date);
                                    calDate.setHours(0, 0, 0, 0);

                                    if (mg.zModal.Status == STATUS_CONFIRMED) {


                                        $scope.refreshNewAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                        $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);

                                    }
                                    else if (mg.zModal.Status == STATUS_WAITING) {
                                                
                                               
                                        $scope.refreshWaitAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                        $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);

                                    }

                                    else if (mg.zModal.Status == STATUS_CANCELED) {
                                        if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                            $scope.refreshCancelAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                        }

                                    }

                                    else if (mg.zModal.Status == STATUS_CHECKIN) {
                                        if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                            $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                        }

                                    }
                                    else if (mg.zModal.Status == STATUS_NOSHOW) {
                                        if (OriginalStatus == STATUS_CONFIRMED) {

                                                    
                                            $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid,refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate,row, col, rrow, rcol);
                                        }

                                    }



                                }, function (err) {

                                    grp.isLoading = false;
                                });




                            }, function () {
                            });



                        }, function (err) {

                            grp.isLoading = false;
                        });

                        // appointment

                    }
                }





            }, function () {
            });

        }


        //remove updateview after add view
        $scope.callAddAppointmentPopupNew = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {



            console.log('popup add called');
            $scope.message = "";
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;


            var view = "scripts/app/views/eAppointment/zDailyApptNewView.html";

            mg.zModal = {};
            mg.consultants = {};

            mg.zModal.BookDate = date;
            mg.zModal.BookTime = time;
            mg.zModal.Customer_AES = "";

            mg.zModal.Remark = "";
            mg.zModal.ReminderType = 1;
            mg.zModal.IsScan = false;


            mg.zModal.AssignToConsultantId = consultantId;
            mg.showModal($scope, ev, view, false, '', "customeridaes").then(function (answer) {

                if (answer == "Cancel") {
                    return;
                }

                mg.zModal.Id = 0;
                mg.zModal.Origin_ConsultantId = $scope.modalGroup.zModal.Origin_ConsultantId;;
                mg.zModal.OutletId = $scope.outletId;
                mg.zModal.AssignedBy_ConsultantId = $scope.consultantId;
                mg.zModal.Purpose = 1;
                mg.zModal.Status = 1;
                mg.zModal.BedNo = 0;
                mg.zModal.TelNo = "";
                mg.zModal.MobileNo = "";
                mg.zModal.IsScan = false;
                mg.zModal.AssignToConsultantId = consultantId;
                mg.zModal.Slot = zSrv_utilService.convertTimeTo24Hour(time);

                if (mg.zModal.CustomerId_AES == "" || typeof mg.zModal.CustomerId_AES == "undefined" || mg.zModal.CustomerName == "" || typeof mg.zModal.CustomerName == "undefined") {
                    return;
                }

                mg.zModal.CustomerId_AES = mg.zModal.CustomerId_AES.toUpperCase();




                if (answer == "OK") {


                    var slot = zSrv_utilService.convertTimeTo24Hour(mg.zModal.BookTime);
                    var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');

                    zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentSlotStatus', { "sdate": mg.zModal.BookDate, "outletId": $scope.outletId, "slot": slot, "consultantId": consultantId }).then(function (reply) {

                        if (reply != "") {
                            mg.showConfirm(ev, reply, 'Do u want to save as  Waiting list??').then(function () {
                                console.log("Clicked Yes");
                                mg.zModal.Status = 3;
                                mg.zModal.StatusCode = "Waiting";

                                mg.zModal.StatusCode = "Waiting";
                                mg.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                                mg.zModal.TelNo = $scope.CustomerDetails[0].TelNo;
                                mg.zModal.MobileNo = $scope.CustomerDetails[0].MobileNo;
                                mg.zModal.ConsultantName = $scope.CustomerDetails[0].ConsultantName;

                                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (appointment) {

                                    var rrow = $scope.getRefreshRow(appointment[0].BookTime);
                                    var rcol = $scope.getRefreshCol(appointment[0].AssignToConsultantId);

                                    var refreshcell = rrow + "-" + rcol;
                                    var refreshfromcell = row + "-" + col;

                                    var bookDate = appointment[0].BookDate;
                                    bookDate.setHours(0, 0, 0, 0);

                                    var calDate = new Date(date);
                                    calDate.setHours(0, 0, 0, 0);

                                    $scope.refreshWaitAppointment(appointment[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);



                                }, function () {
                                });



                            }, function (err) {

                                grp.isLoading = false;
                            });

                        }
                        else {

                            mg.zModal.Status = 2;
                            mg.zModal.StatusCode = "Confirmed";

                            mg.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                            mg.zModal.TelNo = $scope.CustomerDetails[0].TelNo;
                            mg.zModal.MobileNo = $scope.CustomerDetails[0].MobileNo;
                            mg.zModal.ConsultantName = $scope.CustomerDetails[0].ConsultantName;

                            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (appointment) {

                                var rrow = $scope.getRefreshRow(appointment[0].BookTime);
                                var rcol = $scope.getRefreshCol(appointment[0].AssignToConsultantId);

                                var refreshcell = rrow + "-" + rcol;
                                var refreshfromcell = row + "-" + col;

                                var bookDate = appointment[0].BookDate;
                                bookDate.setHours(0, 0, 0, 0);

                                var calDate = new Date(date);
                                calDate.setHours(0, 0, 0, 0);

                                $scope.refreshNewAppointment(appointment[0], refreshcell, appid, refreshfromcell);
                                $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);



                            }, function (err) {

                                grp.isLoading = false;
                            });



                        }
                    });



                }//OK

            });
        }


        $scope.callUpdateAppointmentPopupNew = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {



            console.log('popup update called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.customerId = customerId;
            mg.customerName = customerName;


            mg.showCheckin = false;
            mg.showNoshow = false;

            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

            mg.zModal = {};


            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');


            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentDetails/' + appid).then(function (appointment) {

                mg.zModal = appointment[0];


                mg.consultants = $scope.apptData.Consultants;

                mg.beds = getBeds(date, time, row, col);
                var selBedNo = appointment[0].BedNo;
                if (selBedNo != 0) {
                    mg.beds.push({ "Id": selBedNo, "Name": selBedNo.toString() });
                }

                if (mg.zModal.Status == 3) {
                    mg.showCheckin = true;  //disable
                    mg.showNoshow = true;
                }


                //if confirmed appt, check original and assigned consultant
                if (appointment[0].AssignToConsultantId != appointment[0].Origin_ConsultantId && appointment[0].Status == 2) {
                    mg.zModal.StatusCode = "Assigned";
                }




                mg.showModal($scope, ev, view, false).then(function (answer) {

                    var OriginalStatus = mg.zModal.Status;
                    var newStatus = mg.zModal.Status;


                    if (answer == 'OK') {

                        //if (OriginalStatus == STATUS_WAITING) {
                        //    mg.zModal.Status = STATUS_WAITING;
                        //}
                        //else if (OriginalStatus == STATUS_CHECKIN) {
                        //    mg.zModal.Status = STATUS_CHECKIN;
                        //}
                        //else if (OriginalStatus == STATUS_NOSHOW) {
                        //    mg.zModal.Status = STATUS_NOSHOW;
                        //}
                        //else {
                        //    mg.zModal.Status = STATUS_CONFIRMED;
                        //}
                    }

                    if (answer == 'Cancel') {
                        mg.zModal.Status = STATUS_CANCELED;
                    }

                    if (answer == 'NoShow') {
                        if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                        else {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                    }

                    if (answer == 'CheckIn') {
                        if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                        else {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                    }



                    mg.zModal.Slot = zSrv_utilService.convertTimeTo24Hour(appointment[0].BookTime);

                    var slot = mg.zModal.Slot;
                    var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');

                    zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentSlotStatus', { "sdate": mg.zModal.BookDate, "outletId": $scope.outletId, "slot": slot, "consultantId": consultantId }).then(function (reply) {

                        if (reply != "" && ((OriginalStatus == STATUS_WAITING && mg.zModal.Status == STATUS_CONFIRMED) || (OriginalStatus == STATUS_WAITING && mg.zModal.Status == STATUS_CHECKIN) ||
                            (OriginalStatus == STATUS_NOSHOW && mg.zModal.Status == STATUS_CONFIRMED ) || (OriginalStatus == STATUS_NOSHOW && mg.zModal.Status == STATUS_CHECKIN))) {
                            mg.showConfirm(ev, reply, 'Do u want to save as  Waiting list??').then(function () {
                                console.log("Clicked Yes");
                                mg.zModal.Status = 3;
                                mg.zModal.StatusCode = "Waiting";




                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                        grp.isLoading = false;
                        zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                        var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                        var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);
                        var refreshcell = rrow + "-" + rcol;
                        var refreshfromcell = row + "-" + col;

                        var bookDate = newValue[0].BookDate;
                        bookDate.setHours(0, 0, 0, 0);

                        var calDate = new Date(date);
                        calDate.setHours(0, 0, 0, 0);

                        //if (new Date(date).getDate() == bookDate.getDate()) {


                        switch (mg.zModal.Status) {
                            case STATUS_CONFIRMED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshUpdateAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) { //checkin -> confirm
                                    $scope.refreshConfirmCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) { //noshow -> confirm
                                    $scope.refreshConfirmNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }

                                break;

                            case STATUS_WAITING:
                                if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshWaitConfirmAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshWaitCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) {
                                    $scope.refreshWaitNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CANCELED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCancelAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshCancelhWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshCancelCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_NOSHOW:
                                if (OriginalStatus == STATUS_CONFIRMED) { // confirm -> noshow
                                    $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) { //
                                    $scope.refreshUpdateNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) { //
                                    $scope.refreshCheckInNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CHECKIN:
                                if (OriginalStatus == STATUS_CONFIRMED) { //confirm -> checkin
                                    $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) {
                                    $scope.refreshNoShowCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                        }




                    }, function (err) {

                        grp.isLoading = false;
                    });


                  }); // waiting list 

               }  //reply
               else {

                            zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                                grp.isLoading = false;
                                zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                                var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                                var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);
                                var refreshcell = rrow + "-" + rcol;
                                var refreshfromcell = row + "-" + col;

                                var bookDate = newValue[0].BookDate;
                                bookDate.setHours(0, 0, 0, 0);

                                var calDate = new Date(date);
                                calDate.setHours(0, 0, 0, 0);

                                //if (new Date(date).getDate() == bookDate.getDate()) {


                                switch (mg.zModal.Status) {
                                    case STATUS_CONFIRMED:
                                        if (OriginalStatus == STATUS_CONFIRMED) {
                                            $scope.refreshUpdateAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_WAITING) {
                                            $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_CHECKIN) { //checkin -> confirm
                                            $scope.refreshConfirmCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_NOSHOW) { //noshow -> confirm
                                            $scope.refreshConfirmNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }

                                        break;

                                    case STATUS_WAITING:
                                        if (OriginalStatus == STATUS_WAITING) {
                                            $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        break;

                                    case STATUS_CANCELED:
                                        if (OriginalStatus == STATUS_CONFIRMED) {
                                            $scope.refreshCancelAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_WAITING) {
                                            $scope.refreshCancelhWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_CHECKIN) {
                                            $scope.refreshCancelCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        break;

                                    case STATUS_NOSHOW:
                                        if (OriginalStatus == STATUS_CONFIRMED) { // confirm -> noshow
                                            $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_NOSHOW) { //
                                            $scope.refreshUpdateNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_CHECKIN) { //
                                            $scope.refreshCheckInNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        break;

                                    case STATUS_CHECKIN:
                                        if (OriginalStatus == STATUS_CONFIRMED) { //confirm -> checkin
                                            $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_CHECKIN) {
                                            $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        else if (OriginalStatus == STATUS_NOSHOW) {
                                            $scope.refreshNoShowCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                            $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                        }
                                        break;

                                }




                            }, function (err) {

                                grp.isLoading = false;
                            });

               }

             });//check waiting list



                }, function () {
                    console.log("error show update view");
                });

            }, function (err) {
                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                grp.isLoading = false;
            });



        }

        $scope.callUpdateAppointmentPopupNew20160703 = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {



            console.log('popup update called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.customerId = customerId;
            mg.customerName = customerName;


            mg.showCheckin = false;
            mg.showNoshow = false;

            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

            mg.zModal = {};


            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');


            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentDetails/' + appid).then(function (appointment) {

                mg.zModal = appointment[0];


                mg.consultants = $scope.apptData.Consultants;

                mg.beds = getBeds(date, time, row, col);
                var selBedNo = appointment[0].BedNo;
                if (selBedNo != 0) {
                    mg.beds.push({ "Id": selBedNo, "Name": selBedNo.toString() });
                }

                if (mg.zModal.Status == 3) {
                    mg.showCheckin = true;  //disable
                    mg.showNoshow = true;
                }


                //if confirmed appt, check original and assigned consultant
                if (appointment[0].AssignToConsultantId != appointment[0].Origin_ConsultantId && appointment[0].Status == 2) {
                    mg.zModal.StatusCode = "Assigned";
                }




                mg.showModal($scope, ev, view, false).then(function (answer) {

                    var OriginalStatus = mg.zModal.Status;
                    var newStatus = mg.zModal.Status;


                    if (answer == 'OK') {

                        //if (OriginalStatus == STATUS_WAITING) {
                        //    mg.zModal.Status = STATUS_WAITING;
                        //}
                        //else if (OriginalStatus == STATUS_CHECKIN) {
                        //    mg.zModal.Status = STATUS_CHECKIN;
                        //}
                        //else if (OriginalStatus == STATUS_NOSHOW) {
                        //    mg.zModal.Status = STATUS_NOSHOW;
                        //}
                        //else {
                        //    mg.zModal.Status = STATUS_CONFIRMED;
                        //}
                    }

                    if (answer == 'Cancel') {
                        mg.zModal.Status = STATUS_CANCELED;
                    }

                    if (answer == 'NoShow') {
                        if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                        else {
                            mg.zModal.Status = STATUS_NOSHOW;
                        }
                    }

                    if (answer == 'CheckIn') {
                        if (OriginalStatus == STATUS_CHECKIN) {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }
                        else if (OriginalStatus == STATUS_NOSHOW) {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                        else {
                            mg.zModal.Status = STATUS_CHECKIN;
                        }
                    }



                    mg.zModal.Slot = zSrv_utilService.convertTimeTo24Hour(appointment[0].BookTime);




                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                        grp.isLoading = false;
                        zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                        var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                        var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);
                        var refreshcell = rrow + "-" + rcol;
                        var refreshfromcell = row + "-" + col;

                        var bookDate = newValue[0].BookDate;
                        bookDate.setHours(0, 0, 0, 0);

                        var calDate = new Date(date);
                        calDate.setHours(0, 0, 0, 0);

                        //if (new Date(date).getDate() == bookDate.getDate()) {


                        switch (mg.zModal.Status) {
                            case STATUS_CONFIRMED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshUpdateAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) { //checkin -> confirm
                                    $scope.refreshConfirmCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) { //noshow -> confirm
                                    $scope.refreshConfirmNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }

                                break;

                            case STATUS_WAITING:
                                if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CANCELED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCancelAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshCancelhWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshCancelCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_NOSHOW:
                                if (OriginalStatus == STATUS_CONFIRMED) { // confirm -> noshow
                                    $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) { //
                                    $scope.refreshUpdateNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) { //
                                    $scope.refreshCheckInNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CHECKIN:
                                if (OriginalStatus == STATUS_CONFIRMED) { //confirm -> checkin
                                    $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_NOSHOW) {
                                    $scope.refreshNoShowCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                        }




                    }, function (err) {

                        grp.isLoading = false;
                    });




                }, function () {
                    console.log("error show update view");
                });

            }, function (err) {
                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                grp.isLoading = false;
            });



        }

        //call update view
        $scope.callUpdateAppointmentPopupNewDOUBT = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {



            console.log('popup update called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.customerId = customerId;
            mg.customerName = customerName;


            mg.showCheckin = false;
            mg.showNoshow = false;

            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

            mg.zModal = {};


            var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');


            zSrv_InputCustom.httpGet(resourceServerUrl + 'api/getAppointmentDetails/' + appid).then(function (appointment) {

                mg.zModal = appointment[0];

                //mg.consultants = grp.zData.ConsultantOptions;
                mg.consultants = $scope.apptData.Consultants;

                mg.beds = getBeds(date, time, row, col);
                var selBedNo = appointment[0].BedNo;
                if (selBedNo != 0) {
                    mg.beds.push({ "Id": selBedNo, "Name": selBedNo.toString() });
                }

                if (mg.zModal.Status == 3) {
                    mg.showCheckin = true;  //disable
                    mg.showNoshow = true;
                }

                //if confirmed appt, check original and assigned consultant
                if (appointment[0].AssignToConsultantId != appointment[0].Origin_ConsultantId && appointment[0].Status == 2) {
                    mg.zModal.StatusCode = "Assigned";
                }

                mg.showModal($scope, ev, view, false).then(function (answer) {

                    var OriginalStatus = mg.zModal.Status;

                    if (answer == 'OK')
                    {


                        if (OriginalStatus == STATUS_WAITING) {
                            mg.zModal.Status = STATUS_WAITING;
                        }
                        else {
                            mg.zModal.Status = STATUS_CONFIRMED;
                        }

                    }

                    if (answer == 'Cancel') {
                        mg.zModal.Status = STATUS_CANCELED;
                    }
                    if (answer == 'NoShow') {
                        mg.zModal.Status = STATUS_NOSHOW;
                    }

                    if (answer == 'CheckIn') {
                        mg.zModal.Status = STATUS_CHECKIN;
                    }

                    mg.zModal.Slot = zSrv_utilService.convertTimeTo24Hour(appointment[0].BookTime);

                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                        grp.isLoading = false;
                        zSrv_zNotify.note('success', 'Appointment Updated', 'The Appointment is Updated successfully.');

                        var rrow = $scope.getRefreshRow(newValue[0].BookTime);
                        var rcol = $scope.getRefreshCol(newValue[0].AssignToConsultantId);
                        var refreshcell = rrow + "-" + rcol;
                        var refreshfromcell = row + "-" + col;

                        var bookDate = newValue[0].BookDate;
                        bookDate.setHours(0, 0, 0, 0);

                        var calDate = new Date(date);
                        calDate.setHours(0, 0, 0, 0);

                        //if (new Date(date).getDate() == bookDate.getDate()) {


                        switch (mg.zModal.Status) {
                            case STATUS_CONFIRMED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshUpdateAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) { //cehckin to appointment
                                    $scope.refreshConfirmCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell); 
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }

                                break;

                            case STATUS_WAITING:
                                if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshUpdateWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CANCELED:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCancelAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_WAITING) {
                                    $scope.refreshCancelhWaitAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshCancelCheckinAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_NOSHOW:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshNoShowAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                break;

                            case STATUS_CHECKIN:
                                if (OriginalStatus == STATUS_CONFIRMED) {
                                    $scope.refreshCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }
                                else if (OriginalStatus == STATUS_CHECKIN) {
                                    $scope.refreshUpdateCheckInAppointment(newValue[0], refreshcell, appid, refreshfromcell);
                                    $scope.refreshGrid(calDate, bookDate, row, col, rrow, rcol);
                                }

                                break;

                        }




                    }, function (err) {

                        grp.isLoading = false;
                    });




                }, function () {
                    console.log("error show update view");
                });

            }, function (err) {
                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                grp.isLoading = false;
            });



        }

       
        //this one not used...it popup on single appointment
        $scope.callPopup = function (ev, customerId, customerName, appid, consultantId, date, time, row, col) {

            var selDate = new Date(date).getDate();
            var curDate = new Date().getDate();

            if (selDate < curDate) {
                return;
            }

            //if ($scope.isSlotBlocked(row, col)) {
            //    alert("Slot blocked");
            //    return;
            //}

          


            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
           
            mg.customerId = customerId;
            mg.customerName = customerName;
            mg.showcustomerId = true;

            if (customerId == null || typeof customerId == 'undefined' || customerId == '') {
                mg.showcustomerId = false;
            }

            time = convertTimeTo12Hour(time);

            var view = "scripts/app/views/eAppointment/zDailyApptMenuView_ORG.html";

            mg.showModal($scope, ev, view, false).then(function (answer) {

                

                switch (answer) {
                    case "edit": $scope.callUpdateAppointmentPopup(ev, customerId, customerName, appid, consultantId, date, time, row, col);

                        break;

                    case "new":


                        $scope.callAddAppointmentPopup(ev, customerId, customerName, appid, consultantId, date, time, row, col);
                        break;

                }

            }, function () {
            });

        }

        //$scope.chooseMethod = function ($event, consultantId, date, time, row, col) {
        //    $event.stopPropagation();
        //    $event.preventDefault();
            
        //    $scope.callPopupNew($event, consultantId, date, time, row, col);
            
            
            
        //}


        //popup all the appointments on the cell
        $scope.callPopupNew = function (ev, consultantId, date, time, row, col) {


            return;

            $scope.message = "";
            var appointments = $scope.getAppointments(row, col);

            var blockStatus = $scope.getBlockStatus(row, col);
            if (blockStatus == true && appointments.length <= 0) {
                //alert("Slot Blocked")
                return;
            }

           
           

            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.zModal = {};
            mg.zModal.appointments = appointments;
           
            if (blockStatus == true) mg.zModal.displayadd = "none";
            else mg.zModal.displayadd = "";

            time = zSrv_utilService.convertTimeTo12Hour(time);

            var view = "scripts/app/views/eAppointment/zDailyApptMenuView.html";

            mg.showModal($scope, ev, view, false).then(function (answer) {



                var customerId = "";
                var customerName = "";
                var appid = "";

                if (answer == "new") {
                    $scope.callAddAppointmentPopupNew(ev, customerId, customerName, appid, consultantId, date, time, row, col);
                }
                else {

                    for (i in appointments) {
                        if (appointments[i].appid == answer) {
                            customerId = appointments[i].customerId;
                            customerName = appointments[i].customerName;
                            break;
                        }
                    }

                    $scope.callUpdateAppointmentPopupNew(ev, customerId, customerName, answer, consultantId, date, time, row, col);
                }





            }, function () {
                console.log("error");
            });

        }

        $scope.showHoliday = function (){
            


            var regionid = $scope.outletData.RegionId;
            var month = new Date($scope.dt).getMonth() + 1;
            var year = new Date($scope.dt).getFullYear();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'), {"RegionId":regionid , "Month": month, "Year": year}).then(function (holidays) {
               

                var view = "scripts/app/views/eAppointment/zDailyApptHolidayView.html";

                $scope.modalGroup = zSrv_MagnificPopUp;
                var mg = $scope.modalGroup;
                mg.isModalEdit = false;

                mg.zModal = {};


                mg.zModal.holidays = holidays;
                var ev = null;
                mg.showModal($scope, ev, view, false).then(function (answer) {
                
                }, function () {
                });
            });
           
        }
        
        $scope.callPopupC1Customers = function (c1appointments) {


            if (c1appointments.length <= 0) return;

            var view = "scripts/app/views/eAppointment/zDailyApptC1CustomerView.html";

            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;

            mg.zModal = {};
            mg.zModal.appointments = c1appointments;
            var ev = null;
            mg.showModal($scope, ev, view, false).then(function (answer) {

            }, function () {
            });
        }
        


        $scope.showLegend = function () {

            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
            var ev = null;

            var view = "scripts/app/views/eAppointment/zDailyApptLegend.html";

            mg.showModal($scope, ev, view, false).then(function (answer) {

            }, function () {
            });

        }

        $scope.differentOutlet = function () {
            if ($scope.historyClickEnabled == true) {
                $scope.message = "Belongs to different Outlet";
            }
        }

        $scope.search = function () {

            $scope.message = "";
            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
            var ev = null;

            var view = "scripts/app/views/eAppointment/zDailyApptCustomerHistoryView.html";
            mg.zModal = {};

            mg.zModal.prevdisplay = "none";
            mg.zModal.nextdisplay = "none";

            mg.zModal.currdisplay = "none";

            //mg.zModal.prevbtn = true;
            //mg.zModal.nextbtn = true;

            mg.showModal($scope, ev, view, false, '', "customeridaes").then(function (answer) {

                var customerId = "";
                var customerName = "";
                var date = "";
                var time = "";
                var consultantId = "";
                var outletId = "";
                var found = false;

                for (i in $scope.modalGroup.zModal.previous) {
                    if ($scope.modalGroup.zModal.previous[i].Id == answer) {
                        customerId = $scope.modalGroup.zModal.previous[i].CustomerId_AES;
                        customerName = $scope.modalGroup.zModal.previous[i].CustomerName;
                        date = $scope.modalGroup.zModal.previous[i].BookDate;
                        time = $scope.modalGroup.zModal.previous[i].BookTime;
                        consultantId = $scope.modalGroup.zModal.previous[i].AssignToConsultantId;
                        outletId = $scope.modalGroup.zModal.previous[i].OutletId;
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    for (i in $scope.modalGroup.zModal.next) {
                        if ($scope.modalGroup.zModal.next[i].Id == answer) {
                            customerId = $scope.modalGroup.zModal.next[i].CustomerId_AES;
                            customerName = $scope.modalGroup.zModal.next[i].CustomerName;
                            date = $scope.modalGroup.zModal.next[i].BookDate;
                            time = $scope.modalGroup.zModal.next[i].BookTime;
                            consultantId = $scope.modalGroup.zModal.next[i].AssignToConsultantId;
                            outletId = $scope.modalGroup.zModal.next[i].OutletId;
                            found = true;
                            break;
                        }
                    }
                }

                if (found == false) {
                    for (i in $scope.modalGroup.zModal.curr) {
                        if ($scope.modalGroup.zModal.curr[i].Id == answer) {
                            customerId = $scope.modalGroup.zModal.curr[i].CustomerId_AES;
                            customerName = $scope.modalGroup.zModal.curr[i].CustomerName;
                            date = $scope.modalGroup.zModal.curr[i].BookDate;
                            time = $scope.modalGroup.zModal.curr[i].BookTime;
                            consultantId = $scope.modalGroup.zModal.curr[i].AssignToConsultantId;
                            outletId = $scope.modalGroup.zModal.curr[i].OutletId;
                            break;
                        }
                    }
                }


                if (outletId == $scope.outletId) {
                    $scope.dt = new Date(date);

                    $scope.OnChangeDate();

                    time = zSrv_utilService.convertTimeTo24Hour(time);
                    var row = $scope.getRefreshRow(time);
                    var col = $scope.getRefreshCol(consultantId);
                    $scope.callUpdateAppointmentPopup(ev, customerId, customerName, answer, consultantId, date, time, row, col);
                }

            }, function () {
                alert("error");
            });

        }

        $scope.showHistory = function () {


            $scope.message = "";
            var Customer_AesId = $scope.modalGroup.zModal.CustomerId_AES;

            if (Customer_AesId == "" || typeof Customer_AesId == "undefined") {
                return;
            }


            var date = new Date();
            var sdate = getDate(date);




            var ev = null;
            // var resourceServerUrl = zSrv_ResourceServer.getURL('eApptResourceServerUrl');
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), { "CustomerId_AES": Customer_AesId, "date": sdate, "records": 10 }).then(function (appointment) {

                var previous = appointment[0];
                for (i in previous) {
                    switch (previous[i].Status) {
                        case 1: previous[i].Remark = "";
                            break;
                        case 2: previous[i].Remark = "";
                            if (previous[i].Origin_ConsultantId != previous[i].AssignToConsultantId) {
                                previous[i].Remark = "bg-orange";
                            }
                            break;
                        case 3: previous[i].Remark = "bg-green"; break;
                        case 4: previous[i].Remark = "bg-red"; break;
                        case 5: previous[i].Remark = "bg-grey"; break;
                        case 6: previous[i].Remark = "bg-pink"; break;
                    }
                }
                $scope.modalGroup.zModal.previous = previous;

                var next = appointment[1];
                for (i in next) {
                    switch (next[i].Status) {
                        case 1: next[i].Remark = "";
                            break;
                        case 2: next[i].Remark = "";
                            if (next[i].Origin_ConsultantId != next[i].AssignToConsultantId) {
                                next[i].Remark = "bg-orange";
                            }
                            break;
                        case 3: next[i].Remark = "bg-green"; break;
                        case 4: next[i].Remark = "bg-red"; break;
                        case 5: next[i].Remark = "bg-grey"; break;
                        case 6: next[i].Remark = "bg-pink"; break;
                    }
                }
                $scope.modalGroup.zModal.next = next;


                var curr = appointment[2];
                for (i in curr) {
                    switch (curr[i].Status) {
                        case 1: curr[i].Remark = "";
                            break;
                        case 2: curr[i].Remark = "";
                            if (curr[i].Origin_ConsultantId != curr[i].AssignToConsultantId) {
                                curr[i].Remark = "bg-orange";
                            }
                            break;
                        case 3: curr[i].Remark = "bg-green"; break;
                        case 4: curr[i].Remark = "bg-red"; break;
                        case 5: curr[i].Remark = "bg-grey"; break;
                        case 6: curr[i].Remark = "bg-pink"; break;
                    }
                }

                $scope.modalGroup.zModal.curr = curr;


                //$scope.modalGroup.zModal.prevdisplay = "";
                //$scope.modalGroup.zModal.prevbtn = true;

                //$scope.modalGroup.zModal.nextdisplay = "none";
                //$scope.modalGroup.zModal.nextbtn = false;

                $scope.modalGroup.zModal.prevdisplay = "";
                $scope.modalGroup.zModal.prevbtn = true;

                $scope.modalGroup.zModal.nextdisplay = "";
                $scope.modalGroup.zModal.nextbtn = true;

                $scope.modalGroup.zModal.currdisplay = "";
                //$scope.modalGroup.zModal.currbtn = true;

            });
        }

        $scope.prevHistory = function () {
            $scope.modalGroup.zModal.prevdisplay = "";
            $scope.modalGroup.zModal.prevbtn = true;

            $scope.modalGroup.zModal.nextdisplay = "none";
            $scope.modalGroup.zModal.nextbtn = false;
        }

        $scope.nextHistory = function () {
            $scope.modalGroup.zModal.prevdisplay = "none";
            $scope.modalGroup.zModal.prevbtn = false;

            $scope.modalGroup.zModal.nextdisplay = "";
            $scope.modalGroup.zModal.nextbtn = true;
        }


    }

    zc.$inject = injectParams;

    app.register.controller('eApptDailyAppointmentByBrandController', zc);

});
