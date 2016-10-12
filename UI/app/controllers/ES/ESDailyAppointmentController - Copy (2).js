'use strict';
//eApptDailyAppointmentController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', '$rootScope', 'dataService'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, $rootScope, dataService) {

        var vm = this;


        $scope.cellId = 0;

        $scope.consultantId = 5;
        $scope.outletId = 3;
        $scope.consultantName = "";

        $scope.outletName = null;

        $scope.brandId = null;
        $scope.brandName = null;
        $scope.brandShortName = null;
        $scope.messages = null;

        $scope.showCancel = false;
        $scope.showName = false;

        $scope.showCancelItems = function () {
            $scope.showCancel = !$scope.showCancel;
        }

        $scope.showCustomerName = function () {

            $scope.showName = !$scope.showName;

        }


        $scope.group = {

            formHeader: 'Outlet Daily Appointment - Brand',

            name: 'eApptDailyAppointmentByBrand',


            gridResourceURL: zSrv_ResourceServer.getURL('eApptDailyApptUrl'),
            createModelURL: '/createeApptAppointment',
            //editModelURL: '/editeApptDailyAppointment',
            listModelURL: '/listeApptDailyAppointment',



            zModel: {},
            zData: {},
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,
        }







        var grp = $scope.group;

        $scope.OnChangeOutlet = function () {

            if ($scope.selectedOutlet != null && $scope.selectedOutlet.Id != "undefined") {
                $scope.outletId = $scope.selectedOutlet.Id;
                $rootScope.outletId = $scope.selectedOutlet.Id;
                $rootScope.outletName = $scope.selectedOutlet.Name;
            }

        }

        $scope.$on("$routeChangeSuccess", function () {

            //zSrv_InputCustom.routeChangeSuccess($scope.group);

        });


        $scope.block = false;
        $scope.blockText = "Block";

        $scope.adate = new Date();

        $scope.minDate = new Date(2001, 1, 1);
        $scope.today = function () {


            var defer_column = null;
            defer_column = $q.defer();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "Name": $rootScope.MyProfile.UserName, "Type": "" }).then(function (respcolumnHeader) {
                $scope.consultantDetails = respcolumnHeader;

                defer_column.resolve();
            });



            if (zSrv_OAuth2.isExistInMemory('currentDay')) {
                $scope.dt = zSrv_OAuth2.restoreInMemory('currentDay');
            }
            else {
                $scope.dt = new Date();
                zSrv_OAuth2.storeInMemory('currentDay', $scope.dt);
            }





            if (zSrv_OAuth2.isExistInMemory('currentOutletId')) {
                $scope.outletId = zSrv_OAuth2.restoreInMemory('currentOutletId');
            }

            if (zSrv_OAuth2.isExistInMemory('currentConsultantId')) {
                $scope.consultantId = zSrv_OAuth2.restoreInMemory('currentConsultantId');
            }


            if (zSrv_OAuth2.isExistInMemory('currentConsultantName')) {
                $scope.consultantName = zSrv_OAuth2.restoreInMemory('currentConsultantName');
            }

            var defer_outlets = null;
            defer_outlets = $q.defer();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl'), { "referId": $rootScope.brandId }).then(function (respOutlets) {
                $scope.outlets = respOutlets;

                defer_outlets.resolve();
            });

            var defer_reminder = null;
            defer_reminder = $q.defer();
            if (zSrv_OAuth2.isExistInMemory('remindertype'))
                grp.zData.ReminderTypeOptions = zSrv_OAuth2.restoreInMemory('remindertype');
            else
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrReminderTypeUrl'), {}).then(function (respReminderType) {
                    grp.zData.ReminderTypeOptions = respReminderType;
                    zSrv_OAuth2.storeInMemory('remindertype', grp.zData.ReminderTypeOptions);
                    defer_reminder.resolve();
                });

            var defer_consultant = null;
            defer_consultant = $q.defer();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), {}).then(function (respcolumnHeader) {
                grp.zData.ConsultantOptions = respcolumnHeader;
                //zSrv_OAuth2.storeInMemory('columnHeader', scope.columnHeader);
                defer_consultant.resolve();
            });

            var defer_brandsetting = null;
            defer_brandsetting = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandSettingUrl'), { "referId": $rootScope.brandId }).then(function (resprowBrandSetting) {
                $scope.brandSetting = resprowBrandSetting;

                defer_brandsetting.resolve();
            });


            $q.all([defer_column.promise, defer_outlets.promise, defer_reminder.promise, defer_consultant.promise, defer_brandsetting.promise]).then(function () {
                $scope.consultantId = $scope.consultantDetails[0].ConsultantId;
                $scope.consultantName = $scope.consultantDetails[0].ConsultantName;
                $scope.outletId = $scope.consultantDetails[0].OutletId;
                $scope.outletName = $scope.consultantDetails[0].OutletName;

                $scope.brandId = $scope.consultantDetails[0].BrandId;
                $scope.brandName = $scope.consultantDetails[0].BrandName;
                $scope.brandShortName = $scope.consultantDetails[0].BrandShortName;

                $rootScope.brandId = $scope.brandId;
                $rootScope.brandName = $scope.brandName;
                $rootScope.brandShortName = $scope.brandShortName;

                $rootScope.outletId = $scope.outletId;
                $rootScope.outletName = $scope.outletName;
                $rootScope.consultantId = $scope.consultantId;
                $rootScope.brandSetting = $scope.brandSetting;

               
                console.log("queue finished");
               
            });

            $scope.dt = new Date(2016, 5, 4);
        };

        $scope.nextDay = function () {
            var newDate = new Date();
            newDate.setDate($scope.dt.getDate() + 1);
            $scope.dt = newDate;
        };

        $scope.prevDay = function () {
            var newDate = new Date();
            newDate.setDate($scope.dt.getDate() - 1);
            $scope.dt = newDate;
        };

        $scope.today();



        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {


            $scope.popup2.opened = true;

        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
          [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
          ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
        };

        $scope.changedate = function () {

            zSrv_OAuth2.storeInMemory('currentDay', $scope.dt);

        };

        $scope.blockSlot = function () {
            $scope.block = !$scope.block;

            if ($scope.block) {
                $scope.blockText = "Save Block";

            }
            else {
                $scope.blockText = "Block";
                //$scope.saveBlock();
            }

        };

        $scope.OnChangeCustomerId = function () {
            var Customer_AesId = $scope.modalGroup.zModal.CustomerId_AES;
            zSrv_InputCustom.httpGet('api/getCustomerByAesId/' + Customer_AesId).then(function (respCustomer) {
                $scope.CustomerDetails = respCustomer;

                if ($scope.CustomerDetails != null && $scope.CustomerDetails.length > 0) {

                    $scope.modalGroup.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                    $scope.modalGroup.zModal.CustomerId = $scope.CustomerDetails[0].Id;
                }
                else {
                    alert("Invalid customer Id");
                }
            });

            //promise.then(function (result) {
            //    console.log(result); // "Stuff worked!"
            //}, function (err) {
            //    console.log(err); // Error: "It broke"
            //});
        }

        // var promise = new Promise(function(resolve, reject) {

        //     //$scope.Customer_AesId = $scope.CustomerId;
        //     zSrv_InputCustom.httpGet('api/getCustomerByAesId/' + $scope.CustomerId).then(function (respCustomer) {
        //         $scope.CustomerDetails = respCustomer;
        //         if ($scope.CustomerDetails != null && $scope.CustomerDetails.length > 0) {

        //             $scope.modalGroup.zModal.CustomerName = $scope.CustomerDetails[0].Name;
        //             $scope.modalGroup.zModal.CustomerId = $scope.CustomerDetails[0].Id;
        //         }
        //         else {
        //             alert("Invalid customer Id");
        //         }
        //         resolve();

        //     }, function (err) {
        //         reject();
        //     });
        //});

        $scope.getConsultantDetails = function (Id) {
            zSrv_InputCustom.httpGet('api/eApptMtrConsultantUrl/' + Id).then(function (respConsultant) {
                $scope.ConsultantDetails = respConsultant;

            });
        }


        $scope.OnChangeBookDate = function () {
            //alert($scope.modalGroup.zModal.BookOn);

            var max_book_days = getMaxBookDays();

            var currDate = new Date();
            var bookDate = $scope.modalGroup.zModal.BookOn;

            var days = ((bookDate - currDate) / 24 / 3600000);

            if (days > max_book_days) {
                alert("cannot book more than 30 days advance");
            }
        }

        var getMaxBookDays = function () {
            for (i in $rootScope.brandSetting) {
                if ($rootScope.brandSetting[i].Name == "APPT_NOT_BOOK_ABOVE_DAYS") {
                    return $rootScope.brandSetting[i].Value;
                }
            }

            return null;
        }

        $scope.addAppointment = function () {
            var id = 0;
            //alert($scope.group.createModelURL);
            $location.path($scope.group.createModelURL + '/' + id);
        };

        $scope.CloseMG = function () {
            $scope.modalGroup.Close();

        }

        $scope.callPopupOld = function (ev, customerId, customerName, appid) {

            //if( customerId == null || typeof customerId == 'undefined') {
            //    return;
            //}

            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
            //mg.modalHeader = 'eAppointment';
            //var view = null;
            mg.customerId = customerId;
            mg.customerName = customerName;
            mg.showcustomerId = true;

            if (customerId == null || typeof customerId == 'undefined') {
                mg.showcustomerId = false;
            }

            var view = "scripts/app/views/eAppointment/zDailyApptMenuView.html";

            mg.showModal($scope, ev, view, false).then(function (answer) {

                //alert("Answer : " + JSON.stringify(answer));

                switch (answer) {
                    case "edit": view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

                        mg.zModal = {};

                        zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid).then(function (appointment) {

                            mg.zModal = appointment;

                            mg.showModal($scope, ev, view, false).then(function (answer) {

                                if (answer == 'Cancel') {
                                    mg.zModal.Status = 4;
                                }

                                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {
                                    // grp.alerts.push({ type: 'success', msg: 'Saved successfully.' });
                                    grp.isLoading = false;
                                    zSrv_zNotify.note('success', 'Record Updated', 'The Appointment is saved successfully.');
                                    //mg.show(ev, 'Record Updated', 'The support issue is saved successfully.')
                                    //grp.ngLocation.path(grp.editModelURL + "/" + newValue.Id).replace();
                                    //mg.Close();
                                }, function (err) {
                                    // grp.alerts.push({ type: "danger", msg: err });
                                    grp.isLoading = false;
                                });




                            }, function () {
                            });

                        }, function (err) {
                            // grp.alerts.push({ type: "danger", msg: err });
                            grp.isLoading = false;
                        });

                        break;

                    case "new": view = "scripts/app/views/eAppointment/zDailyApptNewView.html";

                        mg.zModal = {};


                        mg.zModal.BookOn = new Date;
                        mg.zModal.Customer_AES = "";
                        mg.zModal.AssignToConsultantId = 0;
                        mg.zModal.Remark = "";
                        mg.zModal.ReminderType = 1;
                        mg.zModal.IsScan = false;

                        mg.showModal($scope, ev, view, false, "popup-basic bg-none mfp-with-anim mfp-hide").then(function (answer) {

                            mg.zModal.Id = 0;
                            mg.zModal.Origin_ConsultantId = $rootScope.consultantId;
                            mg.zModal.OutletId = $rootScope.outletId;
                            mg.zModal.AssignedBy_ConsultantId = 5;
                            mg.zModal.Purpose = 1;
                            mg.zModal.Status = 1;
                            mg.zModal.BedNo = 0;
                            mg.zModal.TelNo = "";
                            mg.zModal.MobileNo = "";
                            mg.zModal.IsScan = false;

                            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (newValue) {
                                // grp.alerts.push({ type: 'success', msg: 'Saved successfully.' });
                                grp.isLoading = false;
                                zSrv_zNotify.note('success', 'Record Updated', 'The Appointment is saved successfully.');
                                //mg.show(ev, 'Record Updated', 'The support issue is saved successfully.')
                                //grp.ngLocation.path(grp.editModelURL + "/" + newValue.Id).replace();
                                mg.Close();
                            }, function (err) {
                                // grp.alerts.push({ type: "danger", msg: err });
                                grp.isLoading = false;
                            });




                        }, function () {
                        });

                        break;

                    case "reserve": view = "scripts/app/views/eAppointment/zDailyApptReserveSlot.html";
                        break;
                }




            }, function () {
            });

        }

        $scope.isAppointmentAvailable = function (BookDate, BookTime, consultantId) {
            return false;
        }
        $scope.callUpdateAppointmentPopup = function (ev, customerId, customerName, appid) {

            //if( customerId == null || typeof customerId == 'undefined') {
            //    return;
            //}

            console.log('popup update called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
            //mg.modalHeader = 'eAppointment';
            //var view = null;
            mg.customerId = customerId;
            mg.customerName = customerName;
            //mg.showcustomerId = true;

            //if (customerId == null || typeof customerId == 'undefined') {
            //    mg.showcustomerId = false;
            //}

            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

            mg.zModal = {};

            //var appid = newValue.Id;

            zSrv_InputCustom.httpGet('api/getAppointmentDetails/' + appid).then(function (appointment) {

                mg.zModal = appointment[0];
                mg.zModal.consultants = grp.zData.ConsultantOptions;

                mg.showModal($scope, ev, view, false).then(function (answer) {

                    if (answer == 'Cancel') {
                        mg.zModal.Status = 4;
                    }
                    if (answer == 'NoShow') {
                        mg.zModal.Status = 5;
                    }

                    if (answer == 'CheckIn') {
                        mg.zModal.Status = 6;
                    }

                   
                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                        grp.isLoading = false;
                        zSrv_zNotify.note('success', 'Record Updated', 'The Appointment is saved successfully.');

                    }, function (err) {

                        grp.isLoading = false;
                    });




                }, function () {
                });

            }, function (err) {
                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                grp.isLoading = false;
            });



        }

        $scope.callAddAppointmentPopup = function (ev, consultantId) {



            console.log('popup add called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;


            var view = "scripts/app/views/eAppointment/zDailyApptNewView.html";

            mg.zModal = {};


            mg.zModal.BookDate = new Date;
            mg.zModal.Customer_AES = "";
            mg.zModal.AssignToConsultantId = consultantId;
            mg.zModal.Remark = "";
            mg.zModal.ReminderType = 1;
            mg.zModal.IsScan = false;

            //dataService.getConsultantList().then(function (data) {
            //    mg.zModal.ConsultantOptions = data;
            //});

            mg.showModal($scope, ev, view, false).then(function (answer) {

                mg.zModal.Id = 0;
                mg.zModal.Origin_ConsultantId = $rootScope.consultantId;
                mg.zModal.OutletId = $rootScope.outletId;
                mg.zModal.AssignedBy_ConsultantId = 5;
                mg.zModal.Purpose = 1;
                mg.zModal.Status = 1;
                mg.zModal.BedNo = 0;
                mg.zModal.TelNo = "";
                mg.zModal.MobileNo = "";
                mg.zModal.IsScan = false;

                if (!$scope.isAppointmentAvailable(mg.zModal.BookDate, mg.zModal.BookTime, consultantId)) {
                    //alert("Slot not available.Do u want to save as Waitint list")
                    mg.showConfirm(ev, "Slot Not available", "Do u want to save as  Waiting list?").then(function (answer) {
                        if (answer == "OK") {
                            ms.zModal.Status = 3;
                        }

                        zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptAppointmentUrl'), mg.zModal).then(function (newValue) {

                            grp.isLoading = false;
                            zSrv_zNotify.note('success', 'Record Updated', 'The Appointment is saved successfully.');

                            // mg.Close();
                            //update



                            var view = "scripts/app/views/eAppointment/zDailyApptUpdateView.html";

                            mg.zModal = {};
                            var appid = newValue.Id;

                            zSrv_InputCustom.httpGet('api/getAppointmentDetails/' + appid).then(function (appointment) {

                                mg.zModal = appointment[0];

                                //$scope.getConsultantDetails(appointment.Origin_ConsultantId);
                                //mg.zModal.consultantDetails = $scope.ConsultantDetails;

                                mg.zModal.consultants = grp.zData.ConsultantOptions;

                                //mg.zModal.CustomerName = $scope.CustomerDetails[0].Name;
                                //mg.zModal.TelNo = $scope.CustomerDetails[0].TelNo;
                                //mg.zModal.MobileNo = $scope.CustomerDetails[0].MobileNo;


                                //mg.zModal.consutlants = grp.zData.ConsultantOptions;

                                mg.showModal($scope, ev, view, false /*, "popup-basic bg-none mfp-with-anim mfp-hide" */).then(function (answer) {

                                    if (answer == 'Cancel') {
                                        mg.zModal.Status = 4;
                                    }

                                  

                                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, mg.zModal).then(function (newValue) {

                                        grp.isLoading = false;
                                        zSrv_zNotify.note('success', 'Record Updated', 'The Appointment is saved successfully.');

                                    }, function (err) {

                                        grp.isLoading = false;
                                    });




                                }, function () {
                                });

                            }, function (err) {
                                zSrv_zNotify.note('Error', 'Record Update Failed', 'Error save Appointment.');
                                grp.isLoading = false;
                            });







                            //update

                        }, function (err) {

                            grp.isLoading = false;
                        });


                    }, function () {
                    });
                }







            }, function () {
            });

        }

        $scope.callPopup = function (ev, customerId, customerName, appid, consultantId) {

            //if( customerId == null || typeof customerId == 'undefined') {
            //    return;
            //}

            console.log('popup called');
            $scope.modalGroup = zSrv_MagnificPopUp;
            var mg = $scope.modalGroup;
            mg.isModalEdit = false;
            //mg.modalHeader = 'eAppointment';
            //var view = null;
            mg.customerId = customerId;
            mg.customerName = customerName;
            mg.showcustomerId = true;

            if (customerId == null || typeof customerId == 'undefined' || customerId == '') {
                mg.showcustomerId = false;
            }

            //zDailyApptMenuView.html

            var view = "scripts/app/views/eAppointment/zDailyApptMenuView_ORG.html";

            mg.showModal($scope, ev, view,false ).then(function (answer) {

                //alert("Answer : " + JSON.stringify(answer));

                switch (answer) {
                    case "edit": $scope.callUpdateAppointmentPopup(ev, customerId, customerName, appid);

                        break;

                    case "new": $scope.callAddAppointmentPopup(ev, consultantId);
                        break;

                }

            }, function () {
            });

        }

    }

    zc.$inject = injectParams;

    app.register.controller('eApptDailyAppointmentController', zc);

});
