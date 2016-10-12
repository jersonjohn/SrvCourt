
angular.module("zDir_ScheduleGridDaily", [])
.directive("scheduleGridDaily", ['$compile', '$rootScope', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', '$location', 'dataService', '$http', 'zSrv_MagnificPopUp',
function ($compile, $rootScope, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, $location, dataService, $http, zSrv_MagnificPopUp) {
    return {


        link: function (scope, element, attrs) {



            scope.$watch("dt", function (newValue, oldValue) {
                scope.sdate = scope.dt;
                scope.isLoading = true;
                scope.block = false;
                element.empty();
                $compile(element.contents())(scope);

                //if (newValue && angular.isDate(newValue)) {
                    generateGrid();
                    //_refreshData();
                    getWidth();
                    //resize();
                //}
                    //if (new Date(scope.dt).getDate() < new Date().getDate()) {
                    //    scope.callPopup = null;
                    //} else {
                    //    scope.callPopup = scope.callPopupVal;
                    //}

            });

            //$('[data-toggle="tooltip"]').tooltip({
            //    placement: 'top'
            //});

            scope.$watch("block", function (newValue, oldValue) {
                scope.block = newValue;
                //if (scope.isLoading == false && scope.block == false) {
                //    scope.isLoading = false;
                //    scope.saveBlock();
                //}
            });

            scope.$watch("showCancel", function (newValue, oldValue) {
              
              
                    $compile(element.contents())(scope);
                                
            });

            scope.$watch("showName", function (newValue, oldValue) {
               
                $compile(element.contents())(scope);
               
            });

            //scope.$watch("refreshSchedule", function (newValue, oldValue) {
            //    //element.empty();

            //    if (newValue == true) {
            //        generateGrid();
            //        $compile(element.contents())(scope);
            //        scope.refreshSchedule = false;
            //    }
                
            //});

            

            // socket.on('eAppointment', function (data) {
            //     console.log('received event: ' + data.message);
            //     if (data.type == 'ChangeAppointment') {
            //         if (data.outletid == $rootScope.outletId && data.consultantid != $rootScope.consultantId && data.date == scope.sdate)
            //         {
            //             scope.block = false;
            //             element.empty();
            //             $compile(element.contents())(scope);
            //             generateGrid();

            //             //resize();
            //         }
            //     }
            // }
            //);

            var gridName = null;

            var gridDataSet = null;
            scope.columnHeader = []; //scope.$eval(attrs.columnheader); //['Donald', 'Kumar', 'Lay Keow'];
            scope.rowHeader = []; //scope.$eval(attrs.rowheader); //['11:00', '12:00', '13:00', '14:00'];
            scope.rowHeaderData = [];
            scope.brand = null;
            scope.outlet = null;
            scope.outletData = null;
            scope.sdate = null;
            var defer_column = null;
            var defer_row = null;
            var defer_data = null;
            var defer_update = null;
            var defer_getappt = null;
            scope.gridData = null;
            scope.gridDataModel = [];
            tdid = null;
            scope.appt = null;
            scope.waitlist = [];
            scope.c1customer = [{ "custId": "C1", "slot": "07:00", "consultant": "5", "appid": "1001" }, { "custId": "C2", "slot": "08:00", "consultant": "6", "appid": "1002" }];
            scope.blockslot = [];
            scope.consultanttotal = [];
            scope.slottotal = [];
            //scope.block = false;
            scope.generalslotsetting = [];
            scope.weekdayslotSetting = [];
            scope.preferslotSetting = [];
            scope.vipCategory = [];
            scope.vipCustomer = [];
            scope.vipType = [["Silver", "Templates/images/icon-silver.png"], ["Gold", "Templates/images/icon-gold.png"], ["Platinum", "Templates/images/icon-platinum.png"]];

            var defer_row = null;
            var defer_general = null;
            var defer_weekday = null;
            var defer_prefer = null;
            var defer_blockslot = null;
            var defer_outlet = null;
            var defer_display = null;
            var defer_vipcategory = null;
            var defer_vipcustomer = null;
            var defer_customer = null;
            var defer_brandsetting = null;

            var daysOfWeek = new Array('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

            scope.NoofBeds = 0;
            scope.displayData = [];
            scope.boolVipType = false;
            scope.boolGender = false;

            scope.outletSetting = [];
            scope.brandSetting = [];
            scope.c1Appointment = [];
            scope.DisplayFields = {
                customerId: true,
                customerName: true,
                time: true,
                consultantCapacity: true,
                consultantTotalAppointment: true
            }


            function convertTimeTo24Hour(time) {
                var elem = time.split(' ');
                var stSplit = elem[0].split(":");// alert(stSplit);
                var stHour = stSplit[0];
                var stMin = stSplit[1];
                var stAmPm = elem[1];
                var newhr = 0;
                var ampm = '';
                var newtime = '';


                if (stAmPm == 'PM') {
                    if (stHour != 12) {
                        stHour = stHour * 1 + 12;
                    }
                }

                //} else if (stAmPm == 'AM') {

                //    if (stHour == '12') {
                //        stHour = stHour +1;
                //    }

                //}
                return stHour + ':' + stMin;
            }


            function convertTimeTo12Hour(time)
            {
                var stSplit = time.split(":");

                var hours = stSplit[0] > 12 ? stSplit[0] - 12 : stSplit[0];

                var am_pm = stSplit[0] >= 12 ? "PM" : "AM";

                hours = hours < 10 ? "0" + hours : hours;

                var minutes = stSplit[1] < 10 ? "0" + stSplit[1] : stSplit[1];

                //var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                time = hours + ":" + minutes  + " " + am_pm;

                return time;
            }




            var _refreshData = function () {

                

                defer_column = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "referId": $rootScope.outletId, "date": scope.sdate }).then(function (respcolumnHeader) {
                    scope.columnHeader = respcolumnHeader;
                    zSrv_OAuth2.storeInMemory('columnHeader', scope.columnHeader);
                    defer_column.resolve();
                });

                defer_general = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'), { "referId": $rootScope.outletId }).then(function (resprowHeader) {
                    scope.generalslotsetting = resprowHeader;

                    defer_general.resolve();
                });

                defer_weekday = $q.defer();


                var weekday = daysOfWeek[new Date(scope.sdate).getDay()];

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), { "weekday": weekday,"referId": $rootScope.outletId }).then(function (resprowHeader) {
                    scope.weekdayslotSetting = resprowHeader;

                    defer_weekday.resolve();
                });


                defer_prefer = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'), { "sdate": scope.sdate }).then(function (resprowHeader) {
                    scope.preferslotSetting = resprowHeader;

                    defer_prefer.resolve();
                });




                defer_data = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptDailyApptUrl'), { "sdate": scope.sdate, "outletid": scope.outlet }).then(function (data) {
                    scope.gridData = data;
                    zSrv_OAuth2.storeInMemory('data', scope.gridData);
                    defer_data.resolve();
                });

                defer_blockslot = $q.defer();
                var Id = 1;
                dataService.httpGet(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), { "sdate": scope.sdate, "outletid": scope.outlet }).then(function (data) {
                    scope.blockslot = data;

                    defer_blockslot.resolve();
                });

                defer_outlet = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl') + "/" + scope.outlet).then(function (resprowHeader) {
                    scope.outletData = resprowHeader;

                    defer_outlet.resolve();
                });


                defer_display = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrDisplaySettingUrl'), { "referId": scope.outlet }).then(function (resprowHeader) {
                    scope.displayData = resprowHeader;

                    defer_display.resolve();
                });

                defer_vipcategory = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrVipCategoryUrl'), { "referId": $rootScope.brandId }).then(function (resprowHeader) {
                    scope.vipCategory = resprowHeader;

                    defer_vipcategory.resolve();
                });


                defer_brandsetting = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandSettingUrl'), { "referId": $rootScope.brandId }).then(function (resprowBrandSetting) {
                    scope.brandSetting = resprowBrandSetting;

                    defer_brandsetting.resolve();
                });


                defer_outletsetting = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletSettingUrl'), { "referId": scope.outlet }).then(function (resprowOutletSetting) {
                    scope.outletSetting = resprowOutletSetting;

                    defer_outletsetting.resolve();
                });

                defer_c1appointment = $q.defer();

                dataService.httpGet(zSrv_ResourceServer.getURL('eApptC1AppointmentUrl'), { "date": scope.sdate, "brandId": $rootScope.brandId, "outletCode": $rootScope.outletName }).then(function (respC1Appointment) {
                    scope.c1Appointment = respC1Appointment;

                    defer_c1appointment.resolve();
                });

            }



            var getSlotSetting = function () {
                if (scope.preferslotSetting.length > 0)
                    return scope.preferslotSetting;

                if (scope.preferslotSetting.length <= 0 && scope.weekdayslotSetting.length > 0)
                    return scope.weekdayslotSetting;
                else
                    return scope.generalslotsetting;

            }

            var getAppointment = function (appid) {
                // defer_getappt = $q.defer();


                //dataService.httpGet(eApptAppointmentUrl + "/" + appid).then(function (data) {
                //    scope.appt = data;

                //    defer_getappt.resolve();
                //});

                dataService.getAppointment(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, "").then(function (data) {
                    scope.appt = data;
                });
            }


            var updateAppt = function (appid, consultant, slot, status) {

                
                dataService.getAppointment(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, "").then(function (data) {
                    scope.appt = data;

                    if (status != "3") {
                        scope.appt.AssignToConsultantId = consultant;
                    }

                    var bookDate = scope.appt.BookDate;
                    var bookTime = scope.appt.BookTime;

                    var NewTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());

                    var time = slot.split(":");
                    var hour = time[0];
                    var min = time[1];

                    NewTime.setHours(hour);
                    NewTime.setMinutes(min);
                    scope.appt.BookTime = slot;
                    scope.appt.Status = status;

                    //defer_update = $q.defer();

                    dataService.changeAppointment(zSrv_ResourceServer.getURL('eApptDailyApptUrl') + "/" + appid, scope.appt).then(function (data) {
                        scope.gridData = data;

                        //defer_update.resolve();

                        //socket.emit('eAppointment', {
                        //    outletid: scope.outlet,
                        //    consultantid: scope.consultantid,
                        //    date: scope.sdate,
                        //    type: 'ChangeAppointment',
                        //    message: 'Change Appointment'
                        //});
                    });
                });
            }

            var postBlockSlot = function (id, outlet, date, consultant, slot) {

                defer_update = $q.defer();
                var id = 1;
                var BlockSlot = { "Id": id, "OutletId": outlet, "Date": date, "ConsultantId": consultant, "Slot": slot, "Status": "ACTIVE" };
                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), BlockSlot).then(function (data) {
                    //scope.gridData = data;

                    defer_update.resolve();
                });


            }


            var putBlockSlot = function (id, blockSlot) {
                defer_update = $q.defer();


                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptBlockSlotUrl') + "/" + id, blockSlot).then(function (data) {
                    //scope.gridData = data;

                    defer_update.resolve();
                });


            }

            var IsSkinBrand = function()
            {
                for (i in scope.brandSetting) {
                    if (scope.brandSetting[i].Name == "IS_SKIN_BRAND") {
                        return scope.brandSetting[i].Value;
                        break;
                    }
                }
                return "NO";
            }

            var getConsultantName = function (Id) {

                for (c in scope.columnHeader)
                    if (scope.columnHeader[c].Id == Id) {
                        return scope.columnHeader[c].Name;
                    }

                return "";
            }


            var getApp = function (slot, consultant, interval, status) {

                var apps = [];
                var count = 0;
                for (app in scope.gridData) {

                    var bookDate = scope.gridData[app].BookDate;
                    var bookTime= scope.gridData[app].BookTime;

                    bookTime = convertTimeTo24Hour(bookTime);

                    var slotHours = bookTime.substr(0, 2);
                    var slotMins = bookTime.substr(3, 2);

                    if (slotHours.toString().length < 2) slotHours = "0" + slotHours;
                    if (slotMins.toString().length < 2) slotMins = "0" + slotMins;
                    var bookslot = slotHours + ":" + slotMins;


                    var startTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());
                   // startTime.setHours(slot.substr(0, 2), slot.substr(3, 2), 0);
                    startTime.setHours(slot.substr(0, 2));
                    startTime.setMinutes(slot.substr(3, 2));

                    var stopTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());

                    if (startTime.getMinutes() + interval >= 60) {
                        stopTime.setHours(startTime.getHours() + 1);
                        //stopTime.setMinutes(startTime.getMinutes() + interval - 60);
                    }
                    else {
                        stopTime.setHours(startTime.getHours());
                        stopTime.setMinutes(startTime.getMinutes() + interval);
                    }



                    var bookDateTime = bookDate;
                    bookDateTime.setHours(slotHours);
                    bookDateTime.setMinutes(slotMins);


                    if (scope.gridData[app].AssignToConsultantId == consultant && bookDateTime >= startTime && bookDateTime < stopTime && scope.gridData[app].Status == status) {



                        var vipType = "S";

                        var TransactionAmount = scope.gridData[app].TransactionAmount;
                        var gender = scope.gridData[app].Gender;
                        var vipType = getVipType(TransactionAmount);
                        var isscan = scope.gridData[app].IsScan;
                        var isskinanalysis = scope.gridData[app].IsSkinAnalysis;

                        //var srcVipType = "";
                        var isviptype = true;
                        //if (vipType == "S") srcVipType = "Templates/images/icon-silver.png";
                        //if (vipType == "Gold") srcVipType = "Templates/images/icon-gold.png";
                        //if (vipType == "Platinum") srcVipType = "Templates/images/icon-platinum.png";

                        //if (srcVipType != "") isviptype = true;


                        var skinBrand = false;

                        var srcGender = "";
                        ismale = false;

                        if (IsSkinBrand()  == "YES") {
                            skinBrand = true;
                            if (gender == "M") srcGender = "Templates/images/icon-male.png";

                            if (srcGender != "") ismale = true;
                        }

                        //var isscan = false;
                        var srcScan = "";
                        if (isscan) {
                            //isscan = true;
                            srcScan = "Templates/images/icon-scan.png";
                        }

                        //var srcSkinAnalysis = "";
                        //if (isskinanalysis) {
                        //    srcSkinAnalysis = "Templates/images/icon-skin.png";
                        //}

                        var tooltip = {
                            "custId": scope.gridData[app].CustomerId_AES,
                            "custName": scope.gridData[app].Name,
                            "consultant": getConsultantName(scope.gridData[app].Origin_ConsultantId),
                            "time": bookslot,
                            "telno": scope.gridData[app].TelNo,
                            "mobileno": scope.gridData[app].MobileNo,
                            "remark": scope.gridData[app].Remark
                        }

                        var title = tooltip.custId + "-" + tooltip.custName;
                        title = title + '\x0A' + "Time: " + tooltip.time;

                        title = title + '\x0A' + "Consultant: " + tooltip.consultant;

                        if (tooltip.mobileno != "")
                            title = title + '\x0A' + "HP: " + tooltip.mobileno;

                        if (tooltip.telno != "" && tooltip.mobileno != "")
                            title = title + "/" + tooltip.telno;
                        else if (tooltip.telno != "" && tooltip.mobileno == "")
                            title = title + '\x0A' + "Tel: " + tooltip.telno;

                        title = title + '\x0A' + "Note: " + tooltip.remark;

                        var isanotherconsultant = false;
                        if (scope.gridData[app].AssignToConsultantId != scope.gridData[app].Origin_ConsultantId) {
                            isanotherconsultant = true;
                        }  

                        var rec = {};
                        rec.custId = scope.gridData[app].CustomerId;
                        rec.custId_Aes = scope.gridData[app].CustomerId_AES;
                        rec.custName = scope.gridData[app].Name;
                        rec.title = title;
                        rec.slot = bookslot;
                        rec.consultant = consultant;
                        rec.appid = scope.gridData[app].Id;
                        rec.gender =scope.gridData[app].Gender; 
                        rec.viptype = vipType;
                        rec.isviptype = isviptype;
                        rec.srcgender = srcGender;
                        rec.ismale = ismale;
                        rec.isscan = isscan;
                        rec.srcscan =srcScan;
                        rec.isanotherconsultant = isanotherconsultant;
                        rec.bedno = scope.gridData[app].BedNo;

                        apps.push(rec);
                        //console.log("REC : "+JSON.stringify(apps));
                       // ismale: ismale, isscan: isscan, srcscan: srcScan, isanotherconsultant: isanotherconsultant });

                       // gender: scope.gridData[app].Gender, viptype: vipType, isviptype: isviptype, srcgender: srcGender, 

                        //apps.push({ custId: scope.gridData[app].CustomerId, custId_Aes: scope.gridData[app].CustomerId_AES, custName: scope.gridData[app].Name, title: title, slot: bookslot, consultant: consultant, appid: scope.gridData[app].Id, gender: scope.gridData[app].Gender, viptype: vipType, isviptype: isviptype, srcgender: srcGender, ismale: ismale, isscan: isscan, srcscan: srcScan, isanotherconsultant: isanotherconsultant });


                    }




                    count++;
                }





                if (apps.length > 0)
                    return apps;
                else
                    return [];


            }

            var getTransactionAmount = function (CustomerId_AES) {
                for (app in scope.vipCustomer) {
                    if (scope.vipCustomer[app].CustomerId_AES == CustomerId_AES) {
                        return scope.vipCustomer[app].TransactionAmount;
                    }
                    else {
                        return 0;
                    }
                }
            }

            var getVipType = function (TranAmount) {
                var vipType = "Normal";
                for (v in scope.vipCategory) {
                    var amountFrom = scope.vipCategory[v].AmountFrom;
                    var amountTo = scope.vipCategory[v].AmountTo;

                    if (TranAmount >= amountFrom && TranAmount <= amountTo) {
                        vipType = scope.vipCategory[v].Category;
                        break;
                    }
                }
                return vipType;
            }

            var getC1App = function (slot, interval) {

                var apps = [];

               

                for (app in scope.c1Appointment) {
                    var bookOn = scope.c1Appointment[app].BookOn;

                    var slotHours = bookOn.getHours();
                    var slotMins = bookOn.getMinutes();

                    if (slotHours.toString().length < 2) slotHours = "0" + slotHours;
                    if (slotMins.toString().length < 2) slotMins = "0" + slotMins;
                    var bookslot = slotHours + ":" + slotMins;


                    var startTime = new Date(bookOn.getFullYear(), bookOn.getMonth(), bookOn.getDate());
                    startTime.setHours(slot.substr(0, 2));
                    startTime.setMinutes(slot.substr(3, 2));

                    var stopTime = new Date(bookOn.getFullYear(), bookOn.getMonth(), bookOn.getDate());

                    if (startTime.getMinutes() + interval >= 60) {
                        stopTime.setHours(startTime.getHours() + 1);
                        //stopTime.setMinutes(startTime.getMinutes() + interval - 60);
                    }
                    else {
                        stopTime.setHours(startTime.getHours());
                        stopTime.setMinutes(startTime.getMinutes() + interval);
                    }

                    if (bookOn >= startTime && bookOn < stopTime) {
                        apps.push({ custName: scope.c1Appointment[app].Name });
                    }

                }
                if (apps.length > 0)
                    return apps;
                else
                    return [];

            };

            var getBlockStatus = function (slot, consultant) {
                var blockStatus = [];
                for (app in scope.blockslot) {
                    if (scope.blockslot[app].Slot == slot && scope.blockslot[app].ConsultantId == consultant) {
                        var obj = scope.blockslot[app];
                        blockStatus.push(obj);
                    }
                    //if (scope.blockslot[app].Slot == slot && scope.blockslot[app].ConsultantId == consultant && scope.blockslot[app].Status == "INACTIVE") {
                    //    var obj = { id: scope.blockslot[app].Id, status: "INACTIVE" };
                    //    blockStatus.push(obj);
                    //}
                }

                if (blockStatus.length > 0) {
                    return blockStatus;
                }
                else {
                    var obj = { Id: null, Status: "" };
                    blockStatus.push(obj);
                    return blockStatus;
                }

            }

            window.onresize = function (event) {
                resize();
            }

            var resize = function () {
                //var curRow = 1;


                //var c2 = $('#appTable').width();
                //var ow = $('#wrap').width();
                //var offset = $('#wrap').offset();
                //var left = offset.left;
                ////var cw = $('#wrap').get(0).clientWidth;


                //var TotalLeft = ow+left;
                //var TotalRight = 10;


                //$('#appTable tr').each(function (i) {

                //    $('#appTable tr:nth-child(' + curRow + ') th:last').css({ position: 'absolute', left: TotalLeft + 'px' });
                //    $('#appTable tr:nth-child(' + curRow + ') td:last').css({ position: 'absolute', left: TotalLeft + 'px' });

                //    curRow++;


                //});
                //generateGrid();
                var TotalRight = 10;

                var sw = $('#wrap').prop('scrollWidth');
                var iw = $('#wrap').innerWidth();

                var curRow = 1;
                if (sw != iw) {
                    $('#appTable tr').each(function (i) {

                        $('#appTable tr:nth-child(' + curRow + ') th:last').css({ position: 'absolute', right: TotalRight + 'px' });
                        $('#appTable tr:nth-child(' + curRow + ') td:last').css({ position: 'absolute', right: TotalRight + 'px' });

                        curRow++;


                    });
                }
            }


            var resizeold = function () {
                //var curRow = 1;
                //var TotalWidth = getTableWidth();
                //var c1 = $('#appTable tr:nth-child(1) td:first').width();

                //var ele = "#appTable";

                //var currentElement = angular.element(ele);

                //var lefttop = currentElement.offset();
                //var left = lefttop.left;



                //var c2 = $('#appTable').left;
                //var ow = $('#wrap').get(0).offsetWidth;
                //var cw = $('#wrap').get(0).clientWidth;


                //var TotalLeft = ow -10+ left;


                //$('#appTable tr').each(function (i) {

                //    $('#appTable tr:nth-child(' + curRow + ') th:last').css({ position: 'absolute', left: TotalLeft + 'px' });
                //    $('#appTable tr:nth-child(' + curRow + ') td:last').css({ position: 'absolute', left: TotalLeft + 'px' });

                //    curRow++;


                //});

                //var ow = $('#wrap').width(); //get(0).offsetWidth;
                //TotalWidth = $('#appTable').width() - 160;

                //if (TotalWidth < ow) {

                //    $('#wrap').width($('#appTable').width() - 160);
                //    console.log("appTable Width : " + $('#appTable').width());
                //    //$('#appTable').width(TotalWidth);
                //}

                //$('#appTable tr').each(function (i) {

                //    $('#appTable tr:nth-child(' + curRow + ') th:last').css({ position: 'absolute', left: TotalWidth + 'px' });
                //    $('#appTable tr:nth-child(' + curRow + ') td:last').css({ position: 'absolute', left: TotalWidth + 'px' });

                //    curRow++;


                //});



            }


            var setHeight = function () {
                var tm = $('#appTable').css("margin-top");
                $('#c1Table').attr('margin-top', tm);

                var curRow = 1;
                $('#appTable tr').each(function (i) {

                    if (i == 0) {
                        var c2 = $(this).height();
                        var c1 = $('#appTable tr:nth-child(' + curRow + ') th:first').height();
                        //var c3 = $('#appTable tr:nth-child(' + curRow + ') th:last').height();

                        //var maxHeight = Math.max(c1, Math.max(c2, c3));
                        var maxHeight = Math.max(c1, c2);
                        $('#appTable tr:nth-child(' + curRow + ') th:first').height(maxHeight);
                        //$('#appTable tr:nth-child(' + curRow + ') th:last').height(maxHeight);
                        $(this).height(maxHeight);
                        // $('#c1Table tr').height(maxHeight);
                        $('#c1Table tr:nth-child(' + curRow + ') th:first').height(maxHeight);
                    }
                    else {
                        var c2 = $(this).height();
                        var c1 = $('#appTable tr:nth-child(' + curRow + ') td:first').height();
                        //var c3 = $('#appTable tr:nth-child(' + curRow + ') td:last').height();

                        //var maxHeight = Math.max(c1, Math.max(c2, c3));
                        var maxHeight = Math.max(c1, c2);

                        $('#appTable tr:nth-child(' + curRow + ') td:first').height(maxHeight);
                        //$('#appTable tr:nth-child(' + curRow + ') td:last').height(maxHeight);
                        $(this).height(maxHeight);
                        //$('#c1Table tr').height(maxHeight);
                        $('#c1Table tr:nth-child(' + curRow + ') td:first').height(maxHeight);
                    }

                    curRow++;
                });

            }

            var getTableWidth = function () {
                var cols = scope.columnHeader.length + 1;
                var TotalWidth = 0;

                $("#appTable tr:first").each(function () {
                    for (var i = 2; i <= cols ; i++) {
                        TotalWidth = TotalWidth + $(this).find("td").eq(i).width();
                    }


                });

                return TotalWidth;
            }

         

            function getWidth() {
                var tw = $("#appTable").css('width');
                var sw = $("#wrap").css('width');
            }

            //var disableEditAppointment = function () {
            //    $('#eApptTable').find('*').each(function () {
            //        $(this).removeAttr('ng-click');
            //    })

            //    $compile(element.contents())(scope);
            //}

            var generateGrid = function () {
                scope.gridName = attrs.Name
                scope.outlet = attrs.outletid;
                scope.sdate = attrs.sdate;


                if ($rootScope.outletId == "" || $rootScope.outletId == null || $rootScope.outletId == "undefined") {
                    return;
                }

                _refreshData();
                $q.all([defer_column.promise, defer_general.promise, defer_weekday.promise, defer_prefer.promose, defer_data.promise, defer_blockslot.promise, defer_outlet.promise, defer_vipcategory.promise, defer_display.promise, defer_brandsetting.promise, defer_outletsetting.promise, defer_c1appointment.promise]).then(function () {

                    //expect(element.html()).toBe('');
                    //if (tableElem) tableElem.remove;
                    //$compile(element.contents())(scope);

                    scope.rowHeaderData = [];
                    scope.rowHeaderDisplay = [];

                    //angular.element(element[0]).children().remove();
                    element.empty();
                    $compile(element.contents())(scope);

                    for (field in scope.displayData) {
                        if (scope.displayData[field].Description == "CustomerId" && scope.displayData[field].Value == false) scope.DisplayFields.customerId = false;
                        if (scope.displayData[field].Description == "CustomerName" && scope.displayData[field].Value == false) scope.DisplayFields.customerName = false;
                        if (scope.displayData[field].Description == "Time" && scope.displayData[field].Value == false) scope.DisplayFields.time = false;
                        if (scope.displayData[field].Description == "ConsultantCapacity" && scope.displayData[field].Value == false) scope.DisplayFields.consultantCapacity = false;
                        if (scope.displayData[field].Description == "ConsultantTotalAppointment" && scope.displayData[field].Value == false) scope.DisplayFields.consultantTotalAppointment = false;
                    }

                    //tableElem.append("<tr ng-repeat='col in columnHeader'>

                    //rowElem.append("<daily-schedule-col-cell columns='columnHeader' >");

                    //rowElem.append(<td ng-repeat="col in columns"><span><input type="text" ng-model="col.Name"/></span></td>')

                    if (scope.outletData != null && scope.outletData != "undefined") {
                        scope.NoofBeds = scope.outletData.Beds;
                    }
                    scope.rowHeader = getSlotSetting();


                    var slotStart = scope.rowHeader[0].OperatingFromHHMM.toString();
                    var slotStop = scope.rowHeader[0].OperatingToHHMM.toString();
                    var interval = scope.rowHeader[0].SlotInterval_Min;
                    if (slotStart.length < 4) slotStart = "0" + slotStart;
                    if (slotStop.length < 4) slotStop = "0" + slotStop;

                    var d = new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth();
                    var day = d.getDate();



                    var startTime = new Date(year, month, day);
                    startTime.setHours(slotStart.substr(0, 2), slotStart.substr(2, 2), 0);

                    var stopTime = new Date(year, month, day);
                    stopTime.setHours(slotStop.substr(0, 2), slotStop.substr(2, 2), 0);

                    var rowTime = startTime
                    for (rowTime; rowTime < stopTime;) {
                        var slotBeginHours = rowTime.getHours();
                        var slotBeginMins = rowTime.getMinutes();
                        if (slotBeginHours.toString().length < 2) slotBeginHours = "0" + slotBeginHours;
                        if (slotBeginMins.toString().length < 2) slotBeginMins = "0" + slotBeginMins;

                        var slot = slotBeginHours + ":" + slotBeginMins;


                        scope.rowHeaderData.push(slot);



                        myTimeSpan = interval * 60 * 1000;
                        rowTime.setTime(rowTime.getTime() + myTimeSpan);

                        var slotEndHours = rowTime.getHours();
                        var slotEndMins = rowTime.getMinutes();
                        if (slotEndHours.toString().length < 2) slotEndHours = "0" + slotEndHours;
                        if (slotEndMins.toString().length < 2) slotEndMins = "0" + slotEndMins;

                        var slotDisplay = slotBeginHours.toString() + slotBeginMins.toString() + "-" + slotEndHours.toString() + slotEndMins.toString();
                        scope.rowHeaderDisplay.push(slotDisplay);
                    }


                    //generate grid Model
                    scope.gridDataModel = [];
                    var rows = scope.rowHeaderData.length;
                    var cols = scope.columnHeader.length;



                    for (var i = 0; i <= rows; i++) {
                        scope.gridDataModel.push([]);
                    }

                    //headers
                    var obj = { type: 'empty' };
                    scope.gridDataModel[0].push(obj);

                    for (var j = 0; j < cols; j++) {

                        var consultantShortName = scope.columnHeader[j].ShortName;
                        if (consultantShortName == null || consultantShortName == "") {
                            consultantShortName = scope.columnHeader[j].Name;
                        }

                        obj = { type: "colHeader", consultant: consultantShortName.toUpperCase(), capacity: scope.columnHeader[j].Capacity };
                        scope.gridDataModel[0].push(obj);
                        scope.consultanttotal.push(0);
                    }

                    //obj = { type: "waitHeader", consultant: "Waitlist", capacity: 0 };
                    //scope.gridDataModel[0].push(obj);

                    obj = { type: "c1Header", consultant: "NC", capacity: 0 };
                    scope.gridDataModel[0].push(obj);

                    //obj = { type: "bedHeader", consultant: "Beds", capacity: 0 };
                    //scope.gridDataModel[0].push(obj);

                    //data
                    for (var i = 1; i <= rows; i++) {
                        scope.slottotal.push(0);
                        obj = { type: "rowHeader", slot: scope.rowHeaderData[i - 1], display: scope.rowHeaderDisplay[i - 1] };
                        scope.gridDataModel[i].push(obj);

                        for (var j = 0; j < cols; j++) {
                            var apps = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, 2);
                            var appwait = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, 3);
                            var appcan = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, 4);
                            var appcheckin = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, 6);
                            var appnoshow = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, 5);

                            var blocked = getBlockStatus(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id);

                            var totalapps = 0;
                            if (apps != null || apps != undefined) totalapps = apps.length;

                            var totalwait = 0;
                            if (appwait != null || appwait != undefined) totalwait = appwait.length;

                            var totalcan = 0;
                            if (appcan != null || appcan != undefined) totalcan = appcan.length;

                            var totalcheckin = 0;
                            if (appcheckin != null || appcheckin != undefined) totalcheckin = appcheckin.length;

                            var totalnoshow = 0;
                            if (appnoshow != null || appnoshow != undefined) totalnoshow = appnoshow.length;

                            obj = { type: 'data', slot: scope.rowHeaderData[i - 1], consultant: scope.columnHeader[j].Id, appt: apps, total: totalapps, block: blocked, wait: appwait, totalwait: totalwait, cancel: appcan, totalcancel: totalcan,checkin:appcheckin,totalcheckin:totalcheckin,noshow:appnoshow,totalnoshow:totalnoshow };
                            
                            scope.gridDataModel[i].push(obj);
                        }

                       

                        //c1customers
                        var appsc1 = getC1App(scope.rowHeaderData[i - 1], interval);
                        var totalC1apps = 0;
                        if (appsc1 != null || appsc1 != undefined) totalC1apps = appsc1.length;
                        obj = { type: 'dataC1', slot: scope.rowHeaderData[i - 1], c1appt: appsc1, total: totalC1apps };
                        scope.gridDataModel[i].push(obj);




                    }



                    //generate grid Model

                    cols = cols + 1; //for waitlist,c1customer

                    var divScroll = angular.element("<div class='tab-wrapper'>");
                    //divScroll.attr("width", "500px");
                    //divScroll.attr("overflow-x", "scroll");
                    //divScroll.attr("overflow-y", "visible");

                    var tableElem = angular.element("<table id='eApptTable' class='table' >");
                    //tableElem.attr('border', '1');
                    //tableElem.attr('bordercolor', 'black');.
                    //tableElem.attr('background', 'Templates/images/bg-black.jpg');

                    for (var row = 0; row <= rows; row++) {
                        var rowElem = angular.element("<tr class='row-1st'>");
                        //rowElem.attr('background', 'red');
                        for (var col = 0; col <= cols; col++) {
                            console.log(scope.gridDataModel[row][col].type);
                            if (scope.gridDataModel[row][col].type == "empty") {
                                var cell = angular.element("<th  class='col-HD' >").attr("Id", row + "-" + col).html('<div>TIME </br>(24hrs)</div>'); /*class='first' */
                                rowElem.append(cell);
                            }
                            else if (scope.gridDataModel[row][col].type == "colHeader") {
                                var consultcolumn = col - 1;
                                //var colHeader = angular.element("<td>").attr("Id", "cons" + "-" + col).html('<div><input type="text" ng-model="gridDataModel[' + row + '][' + col + '].consultant" + /></br>Capacity:' + scope.gridDataModel[row][col].capacity + ' Total:{{consultanttotal[' + consultcolumn + ']}}</div>');
                                //var colHeader = angular.element("<th>").attr("Id", "cons" + "-" + col).html('<div class="tt-consultid">' + scope.gridDataModel[row][col].consultant + '</div><div  ><div class="capacity" ng-show="DisplayFields.consultantCapacity">' + scope.gridDataModel[row][col].capacity + '</div><div class="totalappointment" ng-show="DisplayFields.consultantTotalAppointment">{{consultanttotal[' + consultcolumn + ']}}</div></div>');
                                var colHeader = angular.element("<th>").attr("Id", "cons" + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</div>');

                                if (col % 2 == 0) colHeader.addClass("tt-hd")
                                else colHeader.addClass("tt-hd-alt");

                                colHeader.attr('ng-click', '!block || addColumnBlock($event)');
                                //colHeader.attr('ng-click', 'block ||  showConsultant($event)');
                                rowElem.append(colHeader);
                            }
                                //else if (scope.gridDataModel[row][col].type == "waitHeader") {
                                //    var colHeader = angular.element("<th>").attr("Id", row + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</br>(' + scope.gridDataModel[row][col].capacity + ')</div>');

                                //    rowElem.append(colHeader);
                                //}

                            else if (scope.gridDataModel[row][col].type == "c1Header") {
                                var colHeader = angular.element("<th class='col-last'> ").attr("Id", row + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</div>'); /*  class='last' */

                                rowElem.append(colHeader);
                            }
                            else if (scope.gridDataModel[row][col].type == "rowHeader") {
                                var slotrow = row - 1;
                                //var rowHeader = angular.element("<td class='first'>").attr("Id", "slot" + "-" + row).html('<div>' + scope.gridDataModel[row][col].slot + '</br>({{slottotal[' + slotrow + ']}})</div>').html('<p class="bed-quantity">8</p><img src="Templates/images/bed.png" width="70" height="49" class="bed" alt=""/>');
                                var rowHeader = angular.element("<td class='col-1st btm-border'>").attr("Id", "slot" + "-" + row).html( scope.gridDataModel[row][col].display + '<div class="bed-quantity">{{slottotal[' + slotrow + ']}}</div><img src="Templates/images/bed-wh.png" width="70" height="49" class="bed" alt=""/>');
                                rowHeader.attr('ng-click', '!block || addRowBlock($event)');
                                rowElem.append(rowHeader);
                            }
                            else if (scope.gridDataModel[row][col].type == "data") {

                                var apps = scope.gridDataModel[row][col].appt;
                                if (apps != undefined) {

                                 

                                    var divElem = angular.element("<div>");//<div class='tt-custid'>");

                                    divElem.attr("Id", "DIV-" + row + "-" + col);
                                    divElem.attr('ng-drop', 'true');
                                    divElem.addClass('apptcell')
                                    divElem.attr('ng-drop-success', 'onDropComplete($data,$event)');

                                    var ulElem = angular.element("<ul >");
                                    ulElem.attr("Id", "UL-" + row + "-" + col);
                                    ulElem.attr("style", "list-style-type:none");

                                    var tdid = "APP-LI-" + row + "-" + col;
                                    for (app in scope.gridDataModel[row][col].appt) {
                                        var id = scope.gridDataModel[row][col].appt[app].appid;
                                        var vipType = scope.gridDataModel[row][col].appt[app].vipType;
                                        var gender = scope.gridDataModel[row][col].appt[app].gender;

                                        var isanotherconsultant = scope.gridDataModel[row][col].appt[app].isanotherconsultant;

                                       

                                        //if (!isanotherconsultant)
                                        //    liElem = angular.element("<li class='bg-custid'>");
                                        //else
                                        liElem = angular.element("<li >");
                                        if (isanotherconsultant) {
                                            liElem.addClass('bg-orange');
                                        }

                                        var bgClass = "";
                                        if (scope.gridDataModel[row][col].appt[app].ismale && scope.gridDataModel[row][col].appt[app].isscan) {
                                            bgClass = "cust-male-scan";
                                        }
                                        else if (scope.gridDataModel[row][col].appt[app].ismale) {
                                            bgClass = "cust-male";
                                        }
                                        else if (scope.gridDataModel[row][col].appt[app].isscan) {
                                            bgClass = "cust-scan";
                                        }
                                        if (bgClass != "") liElem.addClass(bgClass);

                                        liElem.attr('title', scope.gridDataModel[row][col].appt[app].title);
                                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                        //liElem.attr('draggable', 'true');
                                        //liElem.attr('ng-drag', 'true');
                                        //liElem.attr('ng-drop', 'true');
                                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                        //liElem.attr('ng-center-anchor', 'true');
                                        //liElem.attr('ng-drag-move', 'onDragMove($data,$event)');




                                        var customerId = scope.gridDataModel[row][col].appt[app].custId;
                                        //liElem.attr('data-toggle', 'tooltip');
                                        //liElem.attr('title', scope.gridDataModel[row][col].appt[app].title);

                                        //liElem.html('<boot-strap-tooltip data-placement="left" title="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].title}}" /> <span   ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span> &nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isscan}}" /> ');

                                     
                                        liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}</span>  ');
                                      
                                        liElem.attr("Id", id);
                                       
                                        //liElem.attr('ng-click', 'callUpdateAppointmentPopup($event, gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName, gridDataModel[' + row + '][' + col + '].appt[' + app + '].appid);$event.stopPropagation()');


                                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName, gridDataModel[' + row + '][' + col + '].appt[' + app + '].appid,gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation()');
                                        ulElem.append(liElem);

                                    }


                               


                                    var tdElem = angular.element("<td>"); /* context-menu='myContextDiv */



                                    tdElem.attr("Id", row + "-" + col);
                                   

                                    var tdid = "CI-LI-" + row + "-" + col;   //Checkin
                                    for (app in scope.gridDataModel[row][col].checkin) {
                                        var id = scope.gridDataModel[row][col].checkin[app].appid;
                                        var vipType = scope.gridDataModel[row][col].checkin[app].vipType;
                                        var gender = scope.gridDataModel[row][col].checkin[app].gender;

                                        var isanotherconsultant = scope.gridDataModel[row][col].checkin[app].isanotherconsultant;



                                        //if (!isanotherconsultant)
                                        //    liElem = angular.element("<li class='bg-pink'>");
                                        //else


                                        liElem = angular.element("<li class='bg-pink'>");

                                        var bgClass = "";
                                        if (scope.gridDataModel[row][col].checkin[app].ismale && scope.gridDataModel[row][col].checkin[app].isscan) {
                                            bgClass = "cust-male-scan";
                                        }
                                        else if (scope.gridDataModel[row][col].checkin[app].ismale) {
                                            bgClass = "cust-male";
                                        }
                                        else if (scope.gridDataModel[row][col].checkin[app].isscan) {
                                            bgClass = "cust-scan";
                                        }
                                        if (bgClass != "") liElem.addClass(bgClass);

                                        liElem.attr('title', scope.gridDataModel[row][col].checkin[app].title);
                                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                        //liElem.attr('draggable', 'true');
                                        //liElem.attr('ng-drag', 'true');
                                        //liElem.attr('ng-drop', 'true');
                                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                        //liElem.attr('ng-center-anchor', 'true');
                                        //liElem.attr('ng-drag-move', 'onDragMove($data,$event)');




                                        var customerId = scope.gridDataModel[row][col].checkin[app].custId;


                                        //liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].isviptype}} >&nbsp;[{{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].viptype}}]</span> &nbsp; <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custName}}</span>  ');
                                        liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custName}}</span>  ');
                                        liElem.attr("Id", id);



                                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custName, gridDataModel[' + row + '][' + col + '].checkin[' + app + '].appid,gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation()');
                                        ulElem.append(liElem);

                                    }
                                     
                                  
                                        var tdid = "CL-LI-" + row + "-" + col;  //Cancel
                                        for (app in scope.gridDataModel[row][col].cancel) {
                                            var id = scope.gridDataModel[row][col].cancel[app].appid;
                                            liElem = angular.element('<li class="bg-red"   ng-show="showCancel">');

                                            var bgClass = "";
                                            if (scope.gridDataModel[row][col].cancel[app].ismale && scope.gridDataModel[row][col].cancel[app].isscan) {
                                                bgClass = "cust-male-scan";
                                            }
                                            else if (scope.gridDataModel[row][col].cancel[app].ismale) {
                                                bgClass = "cust-male";
                                            }
                                            else if (scope.gridDataModel[row][col].cancel[app].isscan) {
                                                bgClass = "cust-scan";
                                            }
                                            if (bgClass != "") liElem.addClass(bgClass);

                                            liElem.attr('title', scope.gridDataModel[row][col].cancel[app].title);
                                            liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            //liElem.attr('draggable', 'true');
                                            //liElem.attr('ng-drag', 'true');
                                            liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                            liElem.attr('ng-center-anchor', 'true');
                                            
                                            //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                                            //liElem.html('<img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isskinanalysis}}" />');
                                            //liElem.html('<span   ng-show={{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].viptype}}]</span> &nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isscan}}" /> ');
                                            //liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isviptype}} class="tt-custid-wh">&nbsp;[{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].viptype}}]</span> &nbsp; <span ng-show="!showName" class="tt-custid_wh">  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custName}}</span> ');
                                            liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custName}}</span>  ');


                                            //&nbsp; <span class="cust-male" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].ismale}}" />  &nbsp; <span class ="cust-scan" ng-show="{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isscan}}" /> 

                                            liElem.attr("Id", id);
                                            //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                            //cancel not allowed to edit
                                            //liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custName, gridDataModel[' + row + '][' + col + '].cancel[' + app + '].appid,gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation()');
                                            ulElem.append(liElem);

                                        }


                                       

                                       
                                        var tdid = "NS-LI-" + row + "-" + col;  //No show
                                        for (app in scope.gridDataModel[row][col].noshow) {
                                            var id = scope.gridDataModel[row][col].noshow[app].appid;
                                            liElem = angular.element('<li class="bg-grey" >');

                                            var bgClass = "";
                                            if (scope.gridDataModel[row][col].noshow[app].ismale && scope.gridDataModel[row][col].noshow[app].isscan) {
                                                bgClass = "cust-male-scan";
                                            }
                                            else if (scope.gridDataModel[row][col].noshow[app].ismale) {
                                                bgClass = "cust-male";
                                            }
                                            else if (scope.gridDataModel[row][col].noshow[app].isscan) {
                                                bgClass = "cust-scan";
                                            }
                                            if (bgClass != "") liElem.addClass(bgClass);


                                            liElem.attr('title', scope.gridDataModel[row][col].noshow[app].title);
                                            //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            ////liElem.attr('draggable', 'true');
                                            ////liElem.attr('ng-drag', 'true');
                                            //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');

                                            //liElem.attr('ng-center-anchor', 'true');
                                            
                                            //liElem.html('<span ng-show={{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].isviptype}} class="tt-custid">&nbsp;[{{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].viptype}}]</span> &nbsp; <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custName}}</span> ');
                                            liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custName}}</span>  ');


                                            liElem.attr("Id", id);
                                           
                                            //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custName, gridDataModel[' + row + '][' + col + '].noshow[' + app + '].appid,gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation()');
                                            ulElem.append(liElem);

                                        }


                                        var tdid = "WL-LI-" + row + "-" + col;
                                        for (app in scope.gridDataModel[row][col].wait) {
                                            var id = scope.gridDataModel[row][col].wait[app].appid;
                                            liElem = angular.element('<li class="bg-green" >');

                                            var bgClass = "";
                                            if (scope.gridDataModel[row][col].wait[app].ismale && scope.gridDataModel[row][col].wait[app].isscan) {
                                                bgClass = "cust-male-scan";
                                            }
                                            else if (scope.gridDataModel[row][col].wait[app].ismale) {
                                                bgClass = "cust-male";
                                            }
                                            else if (scope.gridDataModel[row][col].wait[app].isscan) {
                                                bgClass = "cust-scan";
                                            }
                                            if (bgClass != "") liElem.addClass(bgClass);


                                            liElem.attr('title', scope.gridDataModel[row][col].wait[app].title);
                                            //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            ////liElem.attr('draggable', 'true');
                                            ////liElem.attr('ng-drag', 'true');
                                            //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');

                                            //liElem.attr('ng-center-anchor', 'true');
                                            //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                                            // liElem.html('<img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isskinanalysis}}" />');
                                            //liElem.html('<span   ng-show={{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].viptype}}]</span> &nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isscan}}" /> ');
                                            //liElem.html('<span ng-show={{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isviptype}} class="tt-custid">&nbsp;[{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].viptype}}]</span> &nbsp; <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custName}}</span> ');
                                            liElem.html('<span  ng-show={{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custName}}</span>  ');


                                            //&nbsp; <span class =cust-male ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].ismale}}" />  &nbsp; <span class ="cust-scan" ng-show="{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isscan}}" /> 
                                            liElem.attr("Id", id);
                                            //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                            //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes,gridDataModel[' + row + '][' + col + '].wait[' + app + '].custName, gridDataModel[' + row + '][' + col + '].wait[' + app + '].appid,gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation()');
                                            ulElem.append(liElem);

                                        }





                                    divElem.append(ulElem);

                                    //var id = "img" + row + "-" + col;
                                    if (scope.gridDataModel[row][col].block.length) {
                                        if (scope.gridDataModel[row][col].block[0].Id != null && scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                                            //tdElem.append('<center><img id=' + id + ' src="block.png"></center>');
                                            //tdElem.attr('bgcolor', 'lightgrey');
                                            tdElem.addClass('bg-block');
                                        }
                                    }

                                    //tdElem.attr('ng-click', '!block || addBlock($event)');
                                    //tdElem.attr('ng-click', 'block ? addBlock($event) : callPopup()');
                                    var consultantId = scope.gridDataModel[row][col].consultant;
                                    tdElem.attr('ng-click', 'chooseMethod($event, gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ') ');
                                    tdElem.append(divElem);
                                    rowElem.append(tdElem);

                                }

                                else {

                                    var tdElem = angular.element("<td>");

                                    //var mainDiv = angular.element("<div class='outerDiv'>");

                                    var divElem = angular.element("<div>");
                                    divElem.addClass('apptcell')
                                    var ulElem = angular.element("<ul>");

                                    divElem.append(ulElem);
                                    //mainDiv.append(divElem);

                                    //tdElem.append(divElem);

                                    //var divElem = angular.element("<div class='wlDiv'>");
                                    //var ulElem = angular.element("<ul>");

                                    divElem.append(ulElem);
                                    //mainDiv.append(divElem);

                                    tdElem.append(divElem);




                                    tdElem.attr("Id", row + "-" + col);
                                    //tdElem.attr('ng-drop', 'true');
                                    //tdElem.attr('ng-drag-move', 'onDragMove($data,$event)')
                                    //tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                    //tdElem.append(divElem);

                                    //tdElem.attr('ng-click', '!block || addBlock($event)');

                                    //var id = "img" + row + "-" + col;
                                    //if (scope.gridDataModel[row][col].block.length) {
                                    //    if (scope.gridDataModel[row][col].block[0].Id != null && scope.gridDataModel[row][col].block[0].Status == "ACTIVE") {
                                    //        tdElem.append('<center><img id=' + id + ' src="block.png"></center>');
                                    //    }
                                    //}

                                    rowElem.append(tdElem);
                                }
                            }

                              
                            else if (scope.gridDataModel[row][col].type == "dataC1") {

                                var apps = scope.gridDataModel[row][col].c1appt;
                                if (apps != undefined) {
                                    var divElem = angular.element("<div>");
                                    var ulElem = angular.element("<ul>");

                                    var tdid = row + "-" + col;
                                    var title = "";
                                    for (app in scope.gridDataModel[row][col].c1appt) {
                                        var custName = scope.gridDataModel[row][col].c1appt[app].custName;
                                        title = title + custName + '\x0A';
                                        //liElem = angular.element("<li>");
                                        //liElem.text('{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}');
                                        //ulElem.append(liElem);

                                    }
                                    //divElem.append(ulElem);


                                    var tdElem = angular.element("<td class='last'>");
                                    

                                    tdElem.attr("Id", row + "-" + col);
                                    divElem.text(apps.length)
                                    divElem.attr('title', title);
                                   
                                    tdElem.append(divElem);
                                   
                                    rowElem.append(tdElem);


                                }
                                else {
                                    var divElem = angular.element("<div>");
                                    divElem.addClass('apptcell')
                                    var ulElem = angular.element("<ul>");

                                    
                                    divElem.text("0");

                                    var tdElem = angular.element("<td class='last'>");
                                    tdElem.attr("Id", row + "-" + col);
                       
                                    tdElem.append(divElem);
                                    rowElem.append(tdElem);
                                }
                            }

                        }
                        tableElem.append(rowElem);
                    }

                    divScroll.append(tableElem);
                    element.append(divScroll);
                    

                    getConsultantTotal();
                    getSlotTotal();

                    $compile(element.contents())(scope);


                    var curRow = 1;
                    $('#appTable tr').each(function (i) {

                        if (i == 0) {
                            var c2 = $(this).height();
                            var c1 = $('#appTable tr:nth-child(' + curRow + ') th:first').height();
                            var c3 = $('#appTable tr:nth-child(' + curRow + ') th:last').height();

                            var maxHeight = Math.max(c1, Math.max(c2, c3));
                            $('#appTable tr:nth-child(' + curRow + ') th:first').height(maxHeight);
                            $('#appTable tr:nth-child(' + curRow + ') th:last').height(maxHeight);
                            $(this).height(maxHeight);
                        }
                        else {
                            var c2 = $(this).height();
                            var c1 = $('#appTable tr:nth-child(' + curRow + ') td:first').height();
                            var c3 = $('#appTable tr:nth-child(' + curRow + ') td:last').height();

                            var maxHeight = Math.max(c1, Math.max(c2, c3));

                            $('#appTable tr:nth-child(' + curRow + ') td:first').height(maxHeight);
                            $('#appTable tr:nth-child(' + curRow + ') td:last').height(maxHeight);
                            $(this).height(maxHeight);
                        }

                        curRow++;
                    });

                    var cols = scope.columnHeader.length;
                    var TotalWidth = 0;

                    $("#appTable tr:first").each(function () {
                        for (var i = 2; i < cols ; i++) {
                            TotalWidth = TotalWidth + $(this).find("th").eq(i).width();
                        }


                    });

                    //var ow = $('#wrap').width(); //get(0).offsetWidth;
                    //TotalWidth = $('#appTable').width() - 160;

                    //if (TotalWidth < ow) {

                    //    $('#wrap').width($('#appTable').width() - 160);
                    //    console.log("appTable Width : " + $('#appTable').width());
                    //    //$('#appTable').width(TotalWidth);
                    //}


                    //$('#appTable tr').each(function (i) {

                    //    $('#appTable tr:nth-child(' + curRow + ') th:last').css({ position: 'absolute', left: TotalWidth + 'px' });
                    //    $('#appTable tr:nth-child(' + curRow + ') td:last').css({ position: 'absolute', left: TotalWidth + 'px' });

                    //    curRow++;


                    //});


                    //setTimeout(function () {
                    //    scope.$apply(function () {
                    //        resize();
                    //    });
                    //}, 2000);

                    //resize();



                    // refreshAvailable();
                    // $rootScope.$emit('go');
                    //$timeout(scope.$eval(attrs.afterRender), 0)
                });

                //var curDate = new Date();
                //if (scope.dt < curDate) {
                //    disableEditAppointment();
                //}

            }

            //scope.myContextDiv = "<ul id='contextmenu-node'><li class='contextmenu-item' ng-click='clickedItem1()'> Item 1 </li><li     class='contextmenu-item' ng-click='clickedItem2()'> Item 2 </li></ul>";

            // scope.clickedItem1 = function(){
            //     alert("Clicked item 1.");
            // };
            // scope.clickedItem2 = function () {
            //     alert("Clicked item 2.");
            // }

            scope.chooseMethod = function ($event,consultantId,date,time,row,col) {
                //scope.block ? scope.addBlock($event) : scope.callAddAppointmentPopup();

                //if (!scope.block)
                //    {
                //    if (scope.isSlotBlocked(row, col)) {
                      
                //        return;
                //    }
                //}

              
                //scope.block ? scope.addBlock($event) : scope.callPopup($event, "", "", "", consultantId,date,time,row,col);
                scope.block ? scope.addBlock($event) : scope.callPopupNew($event,consultantId, date,time,row,col);
            }

            scope.getAppointments = function (row,col) {

                var appointments = [];

                var appointment = {};

                if (scope.gridDataModel[row][col].appt.length > 0) {
                    for (app in scope.gridDataModel[row][col].appt) {

                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].appt[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].appt[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].appt[app].custName;
                        if (scope.gridDataModel[row][col].appt[app].isanotherconsultant == true)
                            appointment.type = "bg-orange"
                        else
                            appointment.type = "";

                        appointments.push(appointment);
                    }
                }

               
                if (scope.gridDataModel[row][col].checkin.length > 0) {
                    for (app in scope.gridDataModel[row][col].checkin) {
                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].checkin[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].checkin[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].checkin[app].custName;
                        appointment.type = "bg-pink";
                        appointments.push(appointment);
                    }
                }

              
                if (scope.gridDataModel[row][col].wait.length > 0) {
                    for (app in scope.gridDataModel[row][col].wait) {
                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].wait[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].wait[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].wait[app].custName;
                        appointment.type = "bg-green";
                        appointments.push(appointment);
                    }
                }

                return appointments;
            }

            scope.getRefreshRow = function (BookTime)
            {
                var bookTime = BookTime;
                var interval = scope.rowHeader[0].SlotInterval_Min;


                bookTime = convertTimeTo24Hour(bookTime);

                var slotHours = bookTime.substr(0, 2);
                var slotMins =  bookTime.substr(3, 2);

                if (slotMins >= interval)
                    slotMins = interval;
                else
                    slotMins = "00";

                var bookSlot = slotHours + ":" + slotMins;

                for (i in scope.rowHeaderData) {
                    if (scope.rowHeaderData[i] == bookSlot) {
                        return parseInt(i) + 1;
                    }
                }
                return 0;
            }

            scope.getRefreshCol = function (AssignToConsultantId) {
                
                for (i in scope.columnHeader) {
                    if(scope.columnHeader[i].Id == AssignToConsultantId)
                    {
                        return parseInt(i)+ 1;
                    }
                }
                return 0;
            }

            scope.refreshCell = function(appointment,tocellId,appid,fromcellId)
            {
                refreshToCell(tocellId);

                getConsultantTotal();
                getSlotTotal();
            }

            scope.refreshNewAppointment = function(appointment,tocellId,appid,fromcellId)
            {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var vipType = "S";

                var TransactionAmount = appointment.TransactionAmount;
                var gender = appointment.Gender;
                var vipType = getVipType(TransactionAmount);
                var isscan = appointment.IsScan;
                var isskinanalysis = appointment.IsSkinAnalysis;

                //var srcVipType = "";
                var isviptype = true;
                //if (vipType == "S") srcVipType = "Templates/images/icon-silver.png";
                //if (vipType == "Gold") srcVipType = "Templates/images/icon-gold.png";
                //if (vipType == "Platinum") srcVipType = "Templates/images/icon-platinum.png";

                //if (srcVipType != "") isviptype = true;


                var skinBrand = false;

                var srcGender = "";
                ismale = false;

                if (IsSkinBrand() == "YES") {
                    skinBrand = true;
                    if (gender == "M") srcGender = "Templates/images/icon-male.png";

                    if (srcGender != "") ismale = true;
                }

                //var isscan = false;
                var srcScan = "";
                if (isscan) {
                    //isscan = true;
                    srcScan = "Templates/images/icon-scan.png";
                }

                //var srcSkinAnalysis = "";
                //if (isskinanalysis) {
                //    srcSkinAnalysis = "Templates/images/icon-skin.png";
                //}

                var tooltip = {
                    "custId": appointment.CustomerId_AES,
                    "custName": appointment.CustomerName,
                    "consultant": appointment.ConsultantName,
                    "time": scope.gridDataModel[toRow][toCol].slot,
                    "telno": appointment.TelNo,
                    "mobileno": appointment.MobileNo,
                    "remark": appointment.Remark
                }

                var title = tooltip.custId + "-" + tooltip.custName;
                title = title + '\x0A' + "Time: " + tooltip.time;

                title = title + '\x0A' + "Consultant: " + tooltip.consultant;

                if (tooltip.mobileno != "")
                    title = title + '\x0A' + "HP: " + tooltip.mobileno;

                if (tooltip.telno != "" && tooltip.mobileno != "")
                    title = title + "/" + tooltip.telno;
                else if (tooltip.telno != "" && tooltip.mobileno == "")
                    title = title + '\x0A' + "Tel: " + tooltip.telno;

                title = title + '\x0A' + "Note: " + tooltip.remark;

                var isanotherconsultant = false;
                if (appointment.AssignToConsultantId != appointment.Origin_ConsultantId) {
                    isanotherconsultant = true;
                }

                var rec = {};
                rec.custId = appointment.CustomerId;
                rec.custId_Aes = appointment.CustomerId_AES;
                rec.custName = appointment.CustomerName;
                rec.title = title;
                rec.slot = scope.gridDataModel[toRow][toCol].slot;
                rec.consultant = appointment.AssignToConsultantId;
                rec.appid = appointment.Id;
                rec.gender = appointment.Gender;
                rec.viptype = vipType;
                rec.isviptype = isviptype;
                rec.srcgender = srcGender;
                rec.ismale = ismale;
                rec.isscan = isscan;
                rec.srcscan = srcScan;
                rec.isanotherconsultant = isanotherconsultant
                rec.bedno = appointment.BedNo;


                ////apps.push(rec);
             

                //apps.push({ custId: scope.gridData[app].CustomerId, custId_Aes: scope.gridData[app].CustomerId_AES, custName: scope.gridData[app].Name, title: title, slot: bookslot, consultant: consultant, appid: scope.gridData[app].Id, gender: scope.gridData[app].Gender, viptype: vipType, isviptype: isviptype, srcgender: srcGender, ismale: ismale, isscan: isscan, srcscan: srcScan, isanotherconsultant: isanotherconsultant });


                scope.gridDataModel[toRow][toCol].appt.push(rec);
                refreshToCell(tocellId);

                

                getConsultantTotal();
                getSlotTotal();

            }
                 
            scope.refreshWaitAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var vipType = "S";

                var TransactionAmount = appointment.TransactionAmount;
                var gender = appointment.Gender;
                var vipType = getVipType(TransactionAmount);
                var isscan = appointment.IsScan;
                var isskinanalysis = appointment.IsSkinAnalysis;

                //var srcVipType = "";
                var isviptype = true;
                //if (vipType == "S") srcVipType = "Templates/images/icon-silver.png";
                //if (vipType == "Gold") srcVipType = "Templates/images/icon-gold.png";
                //if (vipType == "Platinum") srcVipType = "Templates/images/icon-platinum.png";

                //if (srcVipType != "") isviptype = true;


                var skinBrand = false;

                var srcGender = "";
                ismale = false;

                if (IsSkinBrand() == "YES") {
                    skinBrand = true;
                    if (gender == "M") srcGender = "Templates/images/icon-male.png";

                    if (srcGender != "") ismale = true;
                }

                //var isscan = false;
                var srcScan = "";
                if (isscan) {
                    //isscan = true;
                    srcScan = "Templates/images/icon-scan.png";
                }

                //var srcSkinAnalysis = "";
                //if (isskinanalysis) {
                //    srcSkinAnalysis = "Templates/images/icon-skin.png";
                //}

                var tooltip = {
                    "custId": appointment.CustomerId_AES,
                    "custName": appointment.CustomerName,
                    "consultant": appointment.ConsultantName,
                    "time": scope.gridDataModel[toRow][toCol].slot,
                    "telno": appointment.TelNo,
                    "mobileno": appointment.MobileNo,
                    "remark": appointment.Remark
                }

                var title = tooltip.custId + "-" + tooltip.custName;
                title = title + '\x0A' + "Time: " + tooltip.time;

                title = title + '\x0A' + "Consultant: " + tooltip.consultant;

                if (tooltip.mobileno != "")
                    title = title + '\x0A' + "HP: " + tooltip.mobileno;

                if (tooltip.telno != "" && tooltip.mobileno != "")
                    title = title + "/" + tooltip.telno;
                else if (tooltip.telno != "" && tooltip.mobileno == "")
                    title = title + '\x0A' + "Tel: " + tooltip.telno;

                title = title + '\x0A' + "Note: " + tooltip.remark;

                var isanotherconsultant = false;
                if (appointment.AssignToConsultantId != appointment.Origin_ConsultantId) {
                    isanotherconsultant = true;
                }

                var rec = {};
                rec.custId = appointment.CustomerId;
                rec.custId_Aes = appointment.CustomerId_AES;
                rec.custName = appointment.CustomerName;
                rec.title = title;
                rec.slot = scope.gridDataModel[toRow][toCol].slot;
                rec.consultant = appointment.AssignToConsultantId;
                rec.appid = appointment.Id;
                rec.gender = appointment.Gender;
                rec.viptype = vipType;
                rec.isviptype = isviptype;
                rec.srcgender = srcGender;
                rec.ismale = ismale;
                rec.isscan = isscan;
                rec.srcscan = srcScan;
                rec.isanotherconsultant = isanotherconsultant
                rec.bedno = appointment.BedNo;

                ////apps.push(rec);


                //apps.push({ custId: scope.gridData[app].CustomerId, custId_Aes: scope.gridData[app].CustomerId_AES, custName: scope.gridData[app].Name, title: title, slot: bookslot, consultant: consultant, appid: scope.gridData[app].Id, gender: scope.gridData[app].Gender, viptype: vipType, isviptype: isviptype, srcgender: srcGender, ismale: ismale, isscan: isscan, srcscan: srcScan, isanotherconsultant: isanotherconsultant });


                scope.gridDataModel[toRow][toCol].wait.push(rec);
                refreshToCell(tocellId);

                getConsultantTotal();
                getSlotTotal();

            }

            scope.refreshCancelAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var fromRow = toCell[0];
                var fromCol = toCell[1];

                for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {

                        scope.gridDataModel[fromRow][fromCol].cancel.push(scope.gridDataModel[fromRow][fromCol].appt[app]);
                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);

                        var appt = scope.gridDataModel[fromRow][fromCol].appt;
                        scope.gridDataModel[fromRow][fromCol].total = appt.length;
                        
                    }
                }
                
                refreshToCell(tocellId);

                getConsultantTotal();
                getSlotTotal();

            }

            scope.refreshCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {
                //var toCell = tocellId.split("-");
                //var fromRow = toCell[0];
                //var fromCol = toCell[1];


                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var vipType = "S";

                var TransactionAmount = appointment.TransactionAmount;
                var gender = appointment.Gender;
                var vipType = getVipType(TransactionAmount);
                var isscan = appointment.IsScan;
                var isskinanalysis = appointment.IsSkinAnalysis;

                //var srcVipType = "";
                var isviptype = true;
                //if (vipType == "S") srcVipType = "Templates/images/icon-silver.png";
                //if (vipType == "Gold") srcVipType = "Templates/images/icon-gold.png";
                //if (vipType == "Platinum") srcVipType = "Templates/images/icon-platinum.png";

                //if (srcVipType != "") isviptype = true;


                var skinBrand = false;

                var srcGender = "";
                ismale = false;

                if (IsSkinBrand() == "YES") {
                    skinBrand = true;
                    if (gender == "M") srcGender = "Templates/images/icon-male.png";

                    if (srcGender != "") ismale = true;
                }

                //var isscan = false;
                var srcScan = "";
                if (isscan) {
                    //isscan = true;
                    srcScan = "Templates/images/icon-scan.png";
                }

                //var srcSkinAnalysis = "";
                //if (isskinanalysis) {
                //    srcSkinAnalysis = "Templates/images/icon-skin.png";
                //}

                var tooltip = {
                    "custId": appointment.CustomerId_AES,
                    "custName": appointment.CustomerName,
                    "consultant": appointment.ConsultantName,
                    "time": scope.gridDataModel[toRow][toCol].slot,
                    "telno": appointment.TelNo,
                    "mobileno": appointment.MobileNo,
                    "remark": appointment.Remark
                }

                var title = tooltip.custId + "-" + tooltip.custName;
                title = title + '\x0A' + "Time: " + tooltip.time;

                title = title + '\x0A' + "Consultant: " + tooltip.consultant;

                if (tooltip.mobileno != "")
                    title = title + '\x0A' + "HP: " + tooltip.mobileno;

                if (tooltip.telno != "" && tooltip.mobileno != "")
                    title = title + "/" + tooltip.telno;
                else if (tooltip.telno != "" && tooltip.mobileno == "")
                    title = title + '\x0A' + "Tel: " + tooltip.telno;

                title = title + '\x0A' + "Note: " + tooltip.remark;

                var isanotherconsultant = false;
                if (appointment.AssignToConsultantId != appointment.Origin_ConsultantId) {
                    isanotherconsultant = true;
                }

                var rec = {};
                rec.custId = appointment.CustomerId;
                rec.custId_Aes = appointment.CustomerId_AES;
                rec.custName = appointment.CustomerName;
                rec.title = title;
                rec.slot = scope.gridDataModel[toRow][toCol].slot;
                rec.consultant = appointment.AssignToConsultantId;
                rec.appid = appointment.Id;
                rec.gender = appointment.Gender;
                rec.viptype = vipType;
                rec.isviptype = isviptype;
                rec.srcgender = srcGender;
                rec.ismale = ismale;
                rec.isscan = isscan;
                rec.srcscan = srcScan;
                rec.isanotherconsultant = isanotherconsultant
                rec.bedno = appointment.BedNo;

               

                scope.gridDataModel[toRow][toCol].checkin.push(rec);

                for (app in scope.gridDataModel[toRow][toCol].appt) {
                    if (scope.gridDataModel[toRow][toCol].appt[app].appid == appid) {

                        //scope.gridDataModel[fromRow][fromCol].checkin.push(scope.gridDataModel[fromRow][fromCol].appt[app]);
                        scope.gridDataModel[toRow][toCol].appt.splice(app, 1);

                        var appt = scope.gridDataModel[toRow][toCol].appt;
                        scope.gridDataModel[toRow][toCol].total = appt.length;

                    }
                }

                refreshToCell(tocellId);

                getConsultantTotal();
                getSlotTotal();

            }

            scope.refreshNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var fromRow = toCell[0];
                var fromCol = toCell[1];

                for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {

                        scope.gridDataModel[fromRow][fromCol].noshow.push(scope.gridDataModel[fromRow][fromCol].appt[app]);
                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);

                        var appt = scope.gridDataModel[fromRow][fromCol].appt;
                        scope.gridDataModel[fromRow][fromCol].total = appt.length;

                    }
                }

                refreshToCell(tocellId);

                getConsultantTotal();
                getSlotTotal();

            }

            var appendAppointment = function (tocellId, appid, fromcellId) {

                if (fromcellId == tocellId)
                    return;
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[2];
                var fromCol = fromCell[3];

                var liid = "APP-LI-" + toRow + "-" + toCol;
                var ulid = "UL-" + toRow + "-" + toCol;
                var divid = "DIV-" + toRow + "-" + toCol;


                for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {


                        var newslot = scope.gridDataModel[toRow][toCol].slot;
                        var custid = scope.gridDataModel[fromRow][fromCol].appt[app].custId;
                        var obj = scope.gridDataModel[fromRow][fromCol].appt[app];
                        obj.slot = newslot; //change time after move as slot time
                        obj.custid = custid
                        var total = scope.gridDataModel[toRow][toCol].total;
                        total = total + 1;
                        scope.gridDataModel[toRow][toCol].total = total;

                        var newconsultant = scope.gridDataModel[toRow][toCol].consultant;
                        var oldconsultant = scope.gridDataModel[fromRow][fromCol].appt[app].consultant;

                        //if (newconsultant != oldconsultant)
                        //    scope.gridDataModel[toRow][toCol].appt[app].isanotherconsultant = true;
                        //else
                        //    scope.gridDataModel[toRow][toCol].appt[app].isanotherconsultant = false;

                        scope.gridDataModel[toRow][toCol].appt.push(obj);


                        var id = appid;
                        var tdid = toRow + "-" + toCol;
                        var pushIndex = scope.gridDataModel[toRow][toCol].appt.length - 1;

                        var isanotherconsultant = false;
                        if (newconsultant != oldconsultant) {
                            isanotherconsultant = true;
                        }

                        scope.gridDataModel[toRow][toCol].appt[pushIndex].isanotherconsultant = isanotherconsultant;

                        if (!isanotherconsultant)
                            liElem = angular.element("<li class='bg-custid' >");
                        else
                            liElem = angular.element("<li class ='anotherConsultant'>");

                        var bgClass = "";
                        if (scope.gridDataModel[toRow][toCol].appt[app].ismale && scope.gridDataModel[toRow][toCol].appt[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[toRow][toCol].appt[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[toRow][toCol].appt[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);


                        liElem.attr('title', scope.gridDataModel[toRow][toCol].appt[pushIndex].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        //liElem.attr('draggable', 'true');
                        //liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.html('<img ng-src="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].isskinanalysis}}" />');
                        //liElem.html('<span   ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span> &nbsp; <span ng-show="{{!showName}}" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="{{showName}}" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isscan}}" /> ');

                        liElem.html('<span  ng-show={{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].viptype}}]</span>  <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custName}}</span>  ');



                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custId_Aes,gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custName, gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].appid,gridDataModel[' + toRow + '][' + toCol + '].consultant,' + toRow + ', ' + toCol + ');$event.stopPropagation()');
                        liElem.attr("Id", appid);
                        //liElem.attr('onClick', 'editAppointment(' + id + ')');
                        //var tdElem = angular.element(document.querySelector('#tdid'));
                        var ele = "#" + tdid;

                        var tdElem = angular.element(ele);
                        var ulElem = angular.element(document.querySelector('#' + ulid));

                        ulElem.append(liElem);
                        $compile(element.contents())(scope);

                        console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);

                        //socket.emit('add appointment', {
                        //    message: 'message send'
                        //});

                    }

                }
                setHeight();
            };


            var removeAppointment = function (tocellId, appid, fromcellId) {
                if (fromcellId == tocellId)
                    return;
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];



                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[2];
                var fromCol = fromCell[3];


                var tdid = fromRow + "-" + fromCol;
                var ele = "#" + tdid;
                var tdElem = angular.element(ele);



                var liid = "APP-LI-" + fromRow + "-" + fromCol;
                var ulid = "UL-" + fromRow + "-" + fromCol;
                var divid = "DIV-" + fromRow + "-" + fromCol;



                //var ulElem = tdElem.find("ul");
                var ulElem = angular.element(document.querySelector('#' + ulid));

                // var liele = "#" + appid;
                var liele = "li";
                var liElem = ulElem.find(liele);

                //ulElem.remove(liElem);
                angular.forEach(angular.element(liElem), function (value, key) {
                    var data = angular.element(value);
                    data.remove();
                });



                for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {

                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);
                        var appt = scope.gridDataModel[fromRow][fromCol].appt;

                        scope.gridDataModel[fromRow][fromCol].total = appt.length;
                        console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);
                    }
                }


                $compile(element.contents())(scope);

                refreshCell(fromcellId);
                refreshToCell(tocellId);
                setHeight();

            };

            var refreshCell = function (refreshCellId) {

                var refreshCell = refreshCellId.split("-");
                var refreshRow = refreshCell[2];
                var refreshCol = refreshCell[3];

                var ele = "#" + refreshRow + "-" + refreshCol;

                var tdElem = angular.element(ele);

                //if (type == "APP") {

                //    var eleAppDiv = "#DIV-" + row + "-" + col;
                //    var eleAppUl = "#UL-" + row + "-" + col;

                //    var divElem = tdElem.find(eleAppDiv);
                //    var ulElem = tdElem.find(eleAppUl);
                //}
                //else
                //{
                //    var eleWlDiv = "#WL-DIV-" + row + "-" + col;
                //    var eleWlUl = "#WL-UL-" + row + "-" + col;

                //    var divElem = tdElem.find(eleAppDiv);
                //    var ulElem = tdElem.find(eleAppUl);
                //}


                var ulid = "UL-" + refreshRow + "-" + refreshCol;
                var ulElem = angular.element(document.querySelector('#' + ulid));




                var apps = scope.gridDataModel[refreshRow][refreshCol].appt;
                if (apps != undefined) {


                    var tdid = "APP-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].appt) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].appt[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].appt[app].isanotherconsultant;

                        liElem = angular.element("<li >");
                        if (isanotherconsultant) {
                            liElem.addClass('bg-orange');
                        }

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].appt[app].ismale && scope.gridDataModel[refreshRow][refreshCol].appt[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].appt[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].appt[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);

                        liElem = angular.element("<li>");
                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].appt[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        //liElem.attr('draggable', 'true');
                        //liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.text('CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}</span>');

                       // liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isskinanalysis}}" />');
                        //liElem.html('<span   ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span> &nbsp; <span ng-show="{{!showName}}" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="{{showName}}" class="bg-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}</span> &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isscan}}" /> ');

                        //liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} >&nbsp;[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span> &nbsp; <span class="tt-custid" ng-show="{{!showName}}" >  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="{{showName}}" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}</span>  ');

                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);
                        //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);

                    }

                }

                var apps = scope.gridDataModel[refreshRow][refreshCol].checkin;
                if (apps != undefined) {


                    var tdid = "CI-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].checkin) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].checkin[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].checkin[app].isanotherconsultant;
                        //if (!isanotherconsultant)
                        liElem = angular.element("<li class='bg-pink'>");
                        //else
                        //    liElem = angular.element("<li class ='anotherConsultant'>");

                          


                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].ismale && scope.gridDataModel[refreshRow][refreshCol].checkin[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);

                        liElem = angular.element("<li>");
                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].checkin[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        //liElem.attr('draggable', 'true');
                        //liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');


                        liElem.html('<span  ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].viptype}}]</span> <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);

                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);

                    }

                }
              

                apps = scope.gridDataModel[refreshRow][refreshCol].cancel;
                if (apps != undefined) {

                    var tdid = "CL-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].cancel) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        liElem = angular.element('<li class="bg-red"  ng-show={{showCancel}}>');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].ismale && scope.gridDataModel[refreshRow][refreshCol].cancel[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);


                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].cancel[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        ////liElem.attr('draggable', 'true');
                        ////liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                        //liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isskinanalysis}}" />');

                        //liElem.html('<span   ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].viptype}}]</span> &nbsp; <span ng-show="{{!showName}}" class="bg-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="{{showName}}" class="bg-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isscan}}" /> ');
                        liElem.html('<span  ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} ">[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].viptype}}]</span><span ng-show="!showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                        //cancel not allowed to edit
                        //liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }

                }

              

                apps = scope.gridDataModel[refreshRow][refreshCol].noshow;
                if (apps != undefined) {

                    var tdid = "NS-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].noshow) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].noshow[app].appid;
                        liElem = angular.element('<li class="bg-grey" >');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].ismale && scope.gridDataModel[refreshRow][refreshCol].noshow[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);




                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].noshow[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                      
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                       
                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].viptype}}]</span><span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                       

                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }

                }


                apps = scope.gridDataModel[refreshRow][refreshCol].wait;
                if (apps != undefined) {

                    var tdid = "WL-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].wait) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].wait[app].appid;
                        liElem = angular.element('<li class="bg-green" >');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].wait[app].ismale && scope.gridDataModel[refreshRow][refreshCol].wait[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].wait[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].wait[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);




                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].wait[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        ////liElem.attr('draggable', 'true');
                        ////liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                        //liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isskinanalysis}}" />');
                        // liElem.html('<span   ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} class="bg-custid">[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].viptype}}]</span> &nbsp; <span ng-show="{{!showName}}" class="bg-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="{{showName}}" class="bg-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isscan}}" /> ');

                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');

                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }

                }
                
                $compile(element.contents())(scope);








            }

            var refreshToCell = function (refreshCellId) {

                var refreshCell = refreshCellId.split("-");
                var refreshRow = refreshCell[0];
                var refreshCol = refreshCell[1];

                var ele = "#" + refreshRow + "-" + refreshCol;

                var tdElem = angular.element(ele);

               


              

                var ulid = "UL-" + refreshRow + "-" + refreshCol;
                var ulElem = angular.element(document.querySelector('#' + ulid));

                // var liele = "#" + appid;
                var liele = "li";
                var liElem = ulElem.find(liele);

                //ulElem.remove(liElem);
                angular.forEach(angular.element(liElem), function (value, key) {
                    var data = angular.element(value);
                    data.remove();
                });




                var apps = scope.gridDataModel[refreshRow][refreshCol].appt;
                if (apps != undefined) {


                    var tdid = "APP-LI-" + refreshRow + "-" + refreshCol;
                    for (app in scope.gridDataModel[refreshRow][refreshCol].appt) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].appt[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].appt[app].isanotherconsultant;

                        liElem = angular.element("<li >");
                        if (isanotherconsultant) {
                            liElem.addClass('bg-orange');
                        }
                        

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].appt[app].ismale && scope.gridDataModel[refreshRow][refreshCol].appt[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].appt[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].appt[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);



                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].appt[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        //liElem.attr('draggable', 'true');
                        //liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.text('CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}</span>');

                       // liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isskinanalysis}}" />');
                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);
                        //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        

                        ulElem.append(liElem);

                    }
                }

                var apps = scope.gridDataModel[refreshRow][refreshCol].checkin;
                if (apps != undefined) {


                    var tdid = "CI-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].checkin) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].checkin[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].checkin[app].isanotherconsultant;
                        //if (!isanotherconsultant)
                        liElem = angular.element("<li class='bg-pink'>");
                        //else
                        //    liElem = angular.element("<li class ='anotherConsultant'>");

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].ismale && scope.gridDataModel[refreshRow][refreshCol].checkin[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].checkin[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);

                      
                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].checkin[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        //liElem.attr('draggable', 'true');
                        //liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');


                        liElem.html('<span  ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].viptype}}]</span> <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);

                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);

                    }

                }
              

                var apps = scope.gridDataModel[refreshRow][refreshCol].cancel;
                if (apps != undefined) {


                    var tdid = "CL-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].cancel) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        liElem = angular.element('<li class="bg-red"  ng-show={{showCancel}}>');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].ismale && scope.gridDataModel[refreshRow][refreshCol].cancel[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].cancel[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);


                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].cancel[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        ////liElem.attr('draggable', 'true');
                        ////liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                        //liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isskinanalysis}}" />');

                        liElem.html('<span  ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                        //cancel not allowed to edit
                        //liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }
                }




               

                apps = scope.gridDataModel[refreshRow][refreshCol].noshow;
                if (apps != undefined) {

                    var tdid = "NS-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].noshow) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].noshow[app].appid;
                        liElem = angular.element('<li class="bg-grey" >');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].ismale && scope.gridDataModel[refreshRow][refreshCol].noshow[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].noshow[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);




                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].noshow[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');

                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');

                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].isviptype}} >&nbsp;[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);


                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }

                }

                var apps = scope.gridDataModel[refreshRow][refreshCol].wait;
                if (apps != undefined) {


                    var tdid = "WL-LI-" + refreshRow + "-" + refreshCol;

                    for (app in scope.gridDataModel[refreshRow][refreshCol].wait) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].wait[app].appid;

                        liElem = angular.element('<li class="bg-green" >');

                        var bgClass = "";
                        if (scope.gridDataModel[refreshRow][refreshCol].wait[app].ismale && scope.gridDataModel[refreshRow][refreshCol].wait[app].isscan) {
                            bgClass = "cust-male-scan";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].wait[app].ismale) {
                            bgClass = "cust-male";
                        }
                        else if (scope.gridDataModel[refreshRow][refreshCol].wait[app].isscan) {
                            bgClass = "cust-scan";
                        }
                        if (bgClass != "") liElem.addClass(bgClass);



                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].wait[app].title);
                        //liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                        ////liElem.attr('draggable', 'true');
                        ////liElem.attr('ng-drag', 'true');
                        //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                        //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                        //liElem.attr('ng-center-anchor', 'true');
                        //liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                        // liElem.html('<img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcviptype}}" width="15" height="15" alt="" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} />&nbsp; <span ng-show="DisplayFields.customerId" class="bg-custid " >{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].slot}}</span> &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcgender}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].ismale}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcscan}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isscan}}" />  &nbsp; <img ng-src="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].srcskinanalysis}}" width="15" height="15" alt="" ng-show="{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isskinanalysis}}" />');
                        liElem.html('<span ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        // liElem.attr('ng-click', '!block || editAppointment(' + id + ')');

                        //*liElem.attr('ng-click', 'callPopup($event, gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes,gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName, gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].appid,gridDataModel[' + refreshRow + '][' + refreshCol + '].consultant,dt, gridDataModel[' + refreshRow + '][' + refreshCol + '].slot,' + refreshRow + ', ' + refreshCol + ');$event.stopPropagation()');
                        ulElem.append(liElem);


                    }
                }






                $compile(element.contents())(scope);



            }

            refreshAvailable = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;



                for (row = 1; row <= rows ; row++) {
                    for (col = 1; col <= cols ; col++) {
                        var capacity = scope.gridDataModel[0][col].capacity;
                        var total = scope.gridDataModel[row][col].total;
                        var ele = "#" + row + "-" + col;
                        var currentElement = angular.element(ele);
                        if (capacity == total) {

                            //currentElement.attr('bgcolor', 'lightgrey')

                        }
                        else {
                            //currentElement.attr('bgcolor', 'lightgreen')

                        }
                    }
                }

                getConsultantTotal();
                getSlotTotal();

                //$compile(element.contents())(scope);

                //generateGrid();
            }

            getConsultantTotal = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (col = 1; col <= cols ; col++) {
                    var consultanttotal = 0;
                    for (row = 1; row <= rows ; row++) {

                        consultantttotal = consultanttotal + scope.gridDataModel[row][col].appt.length;
                        consultantttotal = consultanttotal + scope.gridDataModel[row][col].checkin.length;
                        //for (i in scope.gridDataModel[row][col].appt) {
                        //    if (scope.gridDataModel[row][col].appt[i].bedno > 0) {
                        //        consultanttotal = consultanttotal + 1;
                        //    }

                        //}

                        //for (i in scope.gridDataModel[row][col].checkin) {
                        //    if (scope.gridDataModel[row][col].checkin[i].bedno > 0) {
                        //        consultanttotal = consultanttotal + 1;
                        //    }

                        //}


                        //for (i in scope.gridDataModel[row][col].wait) {
                        //    if (scope.gridDataModel[row][col].wait[i].bedno > 0) {
                        //        consultanttotal = consultanttotal + 1;
                        //    }

                        //}

                    }
                    scope.consultanttotal[col - 1] = consultanttotal;
                }
            }

            getSlotTotal = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (row = 1; row <= rows ; row++) {
                    var slottotal = 0;
                    for (col = 1; col <= cols ; col++) {

                        slottotal = slottotal + scope.gridDataModel[row][col].appt.length;
                        slottotal = slottotal + scope.gridDataModel[row][col].checkin.length;

                        //for (i in scope.gridDataModel[row][col].appt) {
                        //    if (scope.gridDataModel[row][col].appt[i].bedno > 0) {
                        //        slottotal = slottotal + 1;
                        //    }

                        //}

                        //for (i in scope.gridDataModel[row][col].checkin) {
                        //    if (scope.gridDataModel[row][col].checkin[i].bedno > 0) {
                        //        slottotal = slottotal + 1;
                        //    }

                        //}


                        //for (i in scope.gridDataModel[row][col].wait) {
                        //    if (scope.gridDataModel[row][col].wait[i].bedno > 0) {
                        //        slottotal = slottotal + 1;
                        //    }

                        //}
                       

                    }
                    scope.slottotal[row - 1] = slottotal
                }
            }

            scope.getTakenBeds = function (row, col) {
                var takenBeds = [];
                

                for (col = 1 ; col < scope.columnHeader.length; col++) {

                    for (i in scope.gridDataModel[row][col].appt) {
                        if (scope.gridDataModel[row][col].appt[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].appt[i].bedno)
                        }

                    }

                    for (i in scope.gridDataModel[row][col].checkin) {
                        if (scope.gridDataModel[row][col].checkin[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].checkin[i].bedno)
                        }

                    }


                    for (i in scope.gridDataModel[row][col].wait) {
                        if (scope.gridDataModel[row][col].wait[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].wait[i].bedno)
                        }

                    }
                }

                return takenBeds;
            }


            scope.editAppointment = function (id) {
                console.log('/editAppointment' + "/" + id);
                $location.path('/editeApptAppointment' + "/" + id);
            }


            scope.showConsultant = function (event) {
                var cell = event.currentTarget.id;
                var Cell = cell.split("-");

                var col = Cell[1];

                var consultantId = scope.columnHeader[col - 1].Id;
                var consultantName = scope.columnHeader[col - 1].Name;

                zSrv_OAuth2.storeInMemory('currentOutletId', scope.outlet);
                zSrv_OAuth2.storeInMemory('currentConsultantId', consultantId);
                zSrv_OAuth2.storeInMemory('currentConsultantName', consultantName);

                console.log('/listdailyconsultantapp');
                $location.path('/listdailyconsultantapp');
            }


            scope.addBlock = function (event) {
                ele = "#" + event.currentTarget.id;
                var currentElement = angular.element(ele);

                var cell = event.currentTarget.id;
                var Cell = cell.split("-");
                var row = parseInt(Cell[0]);
                var col = parseInt(Cell[1]);


                //if (scope.gridDataModel[row][col].total > 0)
                //    return;

               
                //unblock already block it
                if (scope.gridDataModel[row][col].block[0].Status == "UNBLOCK" || scope.gridDataModel[row][col].block[0].Status == "") {
                    //currentElement.attr('background-color', 'lightgrey');
                    currentElement.addClass('bg-block');
                    scope.gridDataModel[row][col].block[0].Status = "BLOCK";

                }
                //IF already block remove unblock
                else if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    //currentElement.removeAttr('bgcolor');
                    currentElement.removeClass('bg-block');
                    scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                }

               // $compile(element.contents())(scope);

            }

            scope.IsSlotAvailable = function (row, col) {

                var capacity = scope.columnHeader[col - 1].Capacity;
                var total = scope.gridDataModel[row][col].total;
                if (total < capacity || capacity == 0) {

                    var slottotal = scope.slottotal[row - 1];



                    if (slottotal <= scope.NoofBeds) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
               
            }

            scope.isSlotBlocked = function (row, col) {
                if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    return true;
                }
                else {
                    return false;
                }
            }

            scope.addRowBlock = function (event) {
                var cell = event.currentTarget.id;
                var Cell = cell.split("-");
                var row = parseInt(Cell[1]);

                var firstcol = scope.gridDataModel[row][1].block[0].Status;

                var status = "";
                if (firstcol == "UNBLOCK" || firstcol == "")
                    status = "BLOCK";
                else
                    status = "UNBLOCK";


                var cols = scope.columnHeader.length;
                for (col = 1; col <= cols ; col++) {

                    //if (scope.gridDataModel[row][col].total > 0)
                    //    continue;

                    var ele = "#" + row + "-" + col;
                    var currentElement = angular.element(ele);
                    

                    //if (scope.gridDataModel[row][col].block[0].Status == "UNBLOCK" || scope.gridDataModel[row][col].block[0].Status == "") {
                    //    currentElement.addClass('bg-grey');
                    //    scope.gridDataModel[row][col].block[0].Status = "BLOCK";
                    //}
                    //else if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    //    currentElement.removeClass('bg-grey');
                    //    scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                    //}

                    if (status == "BLOCK") {
                        currentElement.addClass('bg-block');
                        scope.gridDataModel[row][col].block[0].Status = "BLOCK";
                    }
                    else {
                        currentElement.removeClass('bg-block');
                        scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                    }
                }


            }

            scope.addColumnBlock = function (event) {
                var cell = event.currentTarget.id;
                var Cell = cell.split("-");
                var col = parseInt(Cell[1]);

                var firstrow = scope.gridDataModel[1][col].block[0].Status;

                var status = "";
                if (firstrow == "UNBLOCK" || firstrow == "")
                    status = "BLOCK";
                else
                    status ="UNBLOCK";


                var rows = scope.rowHeaderData.length;
                for (row = 1; row <= rows ; row++) {
                    //if (scope.gridDataModel[row][col].total > 0)
                    //    continue;

                    var ele = "#" + row + "-" + col;
                    var currentElement = angular.element(ele);
                   
                    if (status == "BLOCK") {
                        currentElement.addClass('bg-block');
                        scope.gridDataModel[row][col].block[0].Status = "BLOCK";
                    }
                    else {
                        currentElement.removeClass('bg-block');
                        scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                    }
                   


                    //if (scope.gridDataModel[row][col].block[0].Status == "UNBLOCK" || scope.gridDataModel[row][col].block[0].Status == "") {
                    //    currentElement.addClass('bg-grey');
                    //    scope.gridDataModel[row][col].block[0].Status = "BLOCK";
                    //}
                    //else if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    //    currentElement.removeClass('bg-grey');
                    //    scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                    //}
                }

            }
            scope.saveBlockOLD = function () {
                //saveblock
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (row = 1; row <= rows ; row++) {
                    for (col = 1; col <= cols ; col++) {
                        var ele = "#" + row + "-" + col;

                        var currentElement = angular.element(ele);
                        var imgid = "#img" + row + "-" + col;
                        var imgElem = currentElement.find(imgid)
                        if (imgElem.length) {
                            var consultant = scope.gridDataModel[row][col].consultant;
                            var slot = scope.gridDataModel[row][col].slot;
                            var id = null;
                            if (scope.gridDataModel[row][col].block.length) {
                                id = scope.gridDataModel[row][col].block[0].Id;
                            }

                            if (id != null) {
                                putBlockSlot(id, scope.gridDataModel[row][col].block[0]);
                            }
                            else {
                                postBlockSlot(id, scope.outlet, scope.sdate, consultant, slot);
                            }

                        }
                    }
                }
            }

            scope.saveBlock = function () {
                //saveblock
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (row = 1; row <= rows ; row++) {
                    for (col = 1; col <= cols ; col++) {

                        var consultant = scope.gridDataModel[row][col].consultant;
                        var slot = scope.gridDataModel[row][col].slot;
                        var id = null;
                        if (scope.gridDataModel[row][col].block.length) {
                            id = scope.gridDataModel[row][col].block[0].Id;
                        }

                        if (id != null) {
                            putBlockSlot(id, scope.gridDataModel[row][col].block[0]);
                        }
                        else {

                            if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                                postBlockSlot(id, scope.outlet, scope.sdate, consultant, slot);
                            }
                        }

                    }
                }
            }


            var postBlockSlot = function (id, outlet, date, consultant, slot) {

                defer_update = $q.defer();
                var id = 1;
                var BlockSlot = { "Id": id, "OutletId": outlet, "Date": date, "ConsultantId": consultant, "Slot": slot, "Status": "BLOCK" };
                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), BlockSlot).then(function (data) {
                    //scope.gridData = data;

                    defer_update.resolve();
                });


            }


            var putBlockSlot = function (id, blockSlot) {
                defer_update = $q.defer();


                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptBlockSlotUrl') + "/" + id, blockSlot).then(function (data) {
                    //scope.gridData = data;

                    defer_update.resolve();
                });


            }

            scope.onDragMove = function (data, event) {
                console.log("move:");
                //alert("drop success, data:", data);
                var clientX = event.pageX;
                var clientY = event.pageY;
                //var cell = data.cellid;

                //var currentElement = angular.element(cell);
                //currentElement.attr("title", "moving");
            };

            scope.onDragStop = function (data, event) {

                if (scope.block) return;

                if (data == null) return;

                //if (new Date(scope.dt).getDate() < new Date().getDate()) return;


                var cell = data.cellid;
                var Cell = cell.split("-");
                var type = Cell[0];
                var element = Cell[1];
                var fromRow = Cell[2];
                var fromCol = Cell[3];


                if (type == "WL") return;


                var clientX = event.pageX;
                var clientY = event.pageY;

                //var currentElement = angular.element(cell);
                //currentElement.attr("title", "moving");


                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;
                cols++;

                findid:
                    for (row = 1; row <= rows ; row++) {
                        for (col = 1; col < cols ; col++) {
                            var ele = "#" + row + "-" + col;

                            var currentElement = angular.element(ele);

                            var lefttop = currentElement.offset();
                            var left = lefttop.left;
                            var top = lefttop.top;
                            var right = lefttop.left + currentElement[0].offsetWidth;
                            var bottom = lefttop.top + currentElement[0].offsetHeight;


                            //var eleApp = "#APP-DIV-" + row + "-" + col;

                            //var currentAppElement = angular.element(eleApp);

                            //var appOffset = currentAppElement.offset();
                            //var appleft = appOffset.left;
                            //var apptop = appOffset.top;
                            //var appright = appOffset.left + currentAppElement[0].offsetWidth;
                            //var appbottom = appOffset.top + currentAppElement[0].offsetHeight;


                            //var eleWl = "#WL-DIV-" + row + "-" + col;

                            //var currentWlElement = angular.element(eleWl);

                            //var wlOffset = currentAppElement.offset();
                            //var wlleft = wlOffset.left;
                            //var wltop = wlOffset.top;
                            //var wlright = wlOffset.left + currentWlElement[0].offsetWidth;
                            //var wlbottom = wlOffset.top + currentWlElement[0].offsetHeight;



                            //if (row == rows)
                            //{
                            //    var top1 = 0;
                            //}


                            if (clientX >= left && clientY >= top && clientX <= right && clientY <= bottom) {
                                var destcellId = row + "-" + col;
                                console.log("Stop at :" + destcellId);

                                if (row == fromRow && col == fromCol) {
                                    console.log("same row and column");
                                    return; //same td 
                                }


                                if (scope.isSlotBlocked(row, col)) {
                                   // alert("Slot blocked");
                                    return;
                                }

                                //var type;
                                //if (clientY <= appbottom) {
                                //    type = "appointment";
                                //}
                                //else
                                //{
                                //    type = "waitinglist";
                                //}

                                if (data != null) {

                                    var capacity = scope.gridDataModel[0][col].capacity;
                                    var total = scope.gridDataModel[row][col].total;
                                    if (total < capacity || capacity == 0) {

                                        var slottotal = scope.slottotal[row - 1];

                                        if (fromRow != row) {
                                            slottotal++;
                                        }

                                        if (slottotal <= scope.NoofBeds) {
                                            appendAppointment(destcellId, data.appid, data.cellid);
                                            removeAppointment(destcellId, data.appid, data.cellid, type);
                                            var consultant = scope.gridDataModel[row][col].consultant;
                                            var slot = scope.gridDataModel[row][col].slot;


                                            //var d = new Date();
                                            //var year = d.getFullYear();
                                            //var month = d.getMonth();
                                            //var day = d.getDate();

                                            //var currDate = year + month + day;

                                            scope.consultantid = $rootScope.consultantId;

                                            //var type = scope.gridDataModel[row][col].type;
                                            //if (type == "dataWait") {
                                            //    var consultant = "";
                                            //    updateAppt(data.appid, consultant, slot, "WAIT");



                                            //}
                                            //else {
                                            var consultant = scope.gridDataModel[row][col].consultant;
                                            updateAppt(data.appid, consultant, slot, 2);


                                            //}
                                        }
                                    }

                                }
                                break findid;
                            }
                        }
                    }

                refreshAvailable();
                return;


            };

            generateGrid();

            //resize();
        },
        restrict: "E",
        replace: true
    }
}]);

//.directive("sCell",  function() {
//    return {

//        scope: {
//            appt: '='
//        },

//        template: '<td><ul><li ng-repeat="app in appt">{{app.customer}} {{app.ApTime}} </br></li></ul></td>'

//       };
//})
//.directive("dailyScheduleColCell", function () {
//    return {


//        scope: {
//            columns: '='
//        },

//        //template: '<td ng-repeat="col in columns">heading</td>'
//        template: '<td ng-repeat="col in columns"><span><input type="text" ng-model="col.Name"/></span></td>'


//    };
//})

//.directive("sRowHeaderCell", function () {
//    return {

//        scope: {
//            value: '@'
//        },

//        template: '<td>{{value}}</td>'

//    };
//});


