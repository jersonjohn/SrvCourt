//'use strict';
//zDir_ScheduleGrid
define(['app'], function (app) {
//angular.module("zDir_ScheduleGrid", ["zSrv_UtilService"])
//.directive("scheduleGrid", ['$compile', '$rootScope', '$q', '$timeout', '$window', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', '$location', 'dataService', '$http', 'zSrv_MagnificPopUp', 'zSrv_MasterData', 'zSrv_UtilService',
//function ($compile, $rootScope, $q, $timeout, $window, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, $location, dataService, $http, zSrv_MagnificPopUp, zSrv_MasterData, zSrv_UtilService) {
   
    var injectParams = ['$compile', '$rootScope', '$q', '$timeout', '$window', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom',
        '$location', '$http', 'zSrv_MagnificPopUp', 'zSrv_DataService', 'zSrv_MasterData', 'zSrv_UtilService'];

    var zd = function ($compile, $rootScope, $q, $timeout, $window, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom,
        $location, $http, zSrv_MagnificPopUp, zSrv_DataService, zSrv_MasterData, zSrv_UtilService) {
    
        var lastupdate = '2016-08-08' ;
    return {


        link: function (scope, element, attrs) {

     //       require(['/Scripts/app/dependencies/eAppointment/zDir_DataService.js', '/Scripts/app/dependencies/eAppointment/zDir_MasterData.js','/Scripts/app/dependencies/eAppointment/zDir_UtilService.js'], function () {

            //scope.$watch("dt", function (newValue, oldValue) {

            //    scope.sdate = scope.dt;
            //    scope.isLoading = true;
            //    scope.block = false;
            //    element.empty();
            //    $compile(element.contents())(scope);
            //    generateGrid();

            //});

            var dataService = zSrv_DataService;

            //scope.$watch("block", function (newValue, oldValue) {
            //   scope.block = newValue;
            //});

            scope.$watch("showCancel", function (newValue, oldValue) {
                //$compile(element.contents())(scope);
            });

            scope.$watch("showName", function (newValue, oldValue) {
                // $compile(element.contents())(scope);
            });




            var gridName = "Daily Appointment";



            var tdid = null;
            scope.appt = null;
            scope.waitlist = [];

            //scope.blockslot = [];
            scope.consultanttotal = [];
            scope.slottotal = [];


            scope.NoofBeds = 0;
            scope.displayData = [];
            scope.boolVipType = false;
            scope.boolGender = false;


            //add block rows when row header is clicked
            function addRowBlock(row) {

                if (scope.$parent.block == false) return;

                //var cell = event.currentTarget.id;
                //var Cell = cell.split("-");
                //var row = parseInt(Cell[1]);

                var firstcol = scope.gridDataModel[row][1].block[0].Status;

                var status = "";
                if (firstcol == "UNBLOCK" || firstcol == "")
                    status = "BLOCK";
                else
                    status = "UNBLOCK";


                var cols = scope.columnHeader.length;
                for (var col = 1; col <= cols ; col++) {



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
                }


            }

            //add block rows when column header is clicked
            function addColumnBlock(col) {

                if (scope.$parent.block == false) return;

                //var cell = event.currentTarget.id;
                //var Cell = cell.split("-");
                //var col = parseInt(Cell[1]);

                var firstrow = scope.gridDataModel[1][col].block[0].Status;

                var status = "";
                if (firstrow == "UNBLOCK" || firstrow == "")
                    status = "BLOCK";
                else
                    status = "UNBLOCK";


                var rows = scope.rowHeaderData.length;
                for (var row = 1; row <= rows ; row++) {

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

                }

            }

            //var redrawTableColumnHeader = function () {
            //    //$('#slot-1').
            //}

            //get slot setting preference order preferslotsetting->weekdayslotsetting->generalslotsetting
            var getSlotSetting = function () {

                if (scope.preferslotSetting.length > 0)
                    return scope.preferslotSetting;

                if (scope.preferslotSetting.length <= 0 && scope.weekdayslotSetting.length > 0)
                    return scope.weekdayslotSetting;
                else
                    return scope.generalslotsetting;

            }



            //check brand is skin brand?
            var IsSkinBrand = function () {
                for (var i in scope.brandSetting) {
                    if (scope.brandSetting[i].Name == "IS_SKIN_BRAND") {
                        return scope.brandSetting[i].Value;
                        break;
                    }
                }
                return "NO";
            }



            //get consultantname for id from columheder
            var getConsultantName = function (Id) {

                for (var c in scope.columnHeader)
                    if (scope.columnHeader[c].Id == Id) {
                        return scope.columnHeader[c].Name;
                    }

                return "";
            }
			
			 var getConsultantShortName = function (Id) {

                for (var c in scope.columnHeader)
                    if (scope.columnHeader[c].Id == Id) {
                        return scope.columnHeader[c].ShortName;
                    }

                return "";
            }

            var getTotalAppForConsultant = function (consultant) {
                var total = 0;
                for (var app in scope.gridData) {
                    if (scope.gridData[app].AssignToConsultantId == consultant) {
                        total = total + 1;
                    }
                }
                return total;
            }


            //get appointment for cells.
            var getApp = function (slot, consultant, interval, status) {

                var apps = [];
                var count = 0;
                for (var app in scope.gridData) {

                    var bookDate = scope.gridData[app].BookDate;
                    var bookTime = scope.gridData[app].BookTime;

                    bookTime = zSrv_UtilService.convertTimeTo24Hour(bookTime);

                    var slotHours = bookTime.substr(0, 2);
                    var slotMins = bookTime.substr(3, 2);

                    if (slotHours.toString().length < 2) slotHours = "0" + slotHours;
                    if (slotMins.toString().length < 2) slotMins = "0" + slotMins;
                    var bookslot = slotHours + ":" + slotMins;


                    var startTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());

                    startTime.setHours(slot.substr(0, 2));
                    startTime.setMinutes(slot.substr(3, 2));

                    var stopTime = new Date(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());

                    if (startTime.getMinutes() + interval >= 60) {
                        stopTime.setHours(startTime.getHours() + 1);

                    }
                    else {
                        stopTime.setHours(startTime.getHours());
                        stopTime.setMinutes(startTime.getMinutes() + interval);
                    }



                    var bookDateTime = bookDate;
                    bookDateTime.setHours(slotHours);
                    bookDateTime.setMinutes(slotMins);


                    if (scope.gridData[app].AssignToConsultantId == consultant && bookDateTime >= startTime && bookDateTime < stopTime && scope.gridData[app].Status == status) {



                        var vipType = "A";

                        var TransactionAmount = scope.gridData[app].TransactionAmount;
                        var gender = scope.gridData[app].Gender;
                        var vipType = getVipType(TransactionAmount);
                        var isscan = scope.gridData[app].IsScan;
                        var isskinanalysis = scope.gridData[app].IsSkinAnalysis;


                        var isviptype = true;


                        var skinBrand = false;

                        var srcGender = "";
                        var ismale = false;

                        if (IsSkinBrand() == "YES") {
                            skinBrand = true;
                            if (gender == "M") srcGender = "Templates/images/icon-male.png";

                            if (srcGender != "") ismale = true;
                        }


                        var srcScan = "";
                        if (isscan) {

                            srcScan = "Templates/images/icon-scan.png";
                        }



                        var tooltip = {
                            "custId": scope.gridData[app].CustomerId_AES,
                            "custName": scope.gridData[app].Name,
                            "consultant": getConsultantShortName(scope.gridData[app].Origin_ConsultantId),
                           // "time": bookslot,
						   "time": scope.gridData[app].BookTime,
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
                        rec.gender = scope.gridData[app].Gender;
                        rec.viptype = vipType;
                        rec.isviptype = isviptype;
                        rec.srcgender = srcGender;
                        rec.ismale = ismale;
                        rec.isscan = isscan;
                        rec.srcscan = srcScan;
                        rec.isanotherconsultant = isanotherconsultant;
                        rec.bedno = scope.gridData[app].BedNo;

                        apps.push(rec);

                    }

                    count++;
                }

                if (apps.length > 0)
                    return apps;
                else
                    return [];

            }

            //get c1 appointment
            var getC1App = function (slot, interval) {

                var apps = [];



                for (var app in scope.c1Appointment) {
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


            //get viptype
            var getVipType = function (TranAmount) {
                var vipType = "A";
                for (var v in scope.vipCategory) {
                    var amountFrom = scope.vipCategory[v].AmountFrom;
                    var amountTo = scope.vipCategory[v].AmountTo;

                    if (TranAmount >= amountFrom && TranAmount <= amountTo) {
                        vipType = scope.vipCategory[v].Category;
                        break;
                    }
                }
                return vipType;
            }







            //generate slot sequence to display as row header 1100-1200...
            var generateSlots = function () {

                scope.rowHeaderData = [];
                scope.rowHeaderDisplay = [];

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
                for (var rowTime; rowTime < stopTime;) {
                    var slotBeginHours = rowTime.getHours();
                    var slotBeginMins = rowTime.getMinutes();
                    if (slotBeginHours.toString().length < 2) slotBeginHours = "0" + slotBeginHours;
                    if (slotBeginMins.toString().length < 2) slotBeginMins = "0" + slotBeginMins;

                    var slot = slotBeginHours + ":" + slotBeginMins;


                    scope.rowHeaderData.push(slot);



                    var myTimeSpan = interval * 60 * 1000;
                    rowTime.setTime(rowTime.getTime() + myTimeSpan);

                    var slotEndHours = rowTime.getHours();
                    var slotEndMins = rowTime.getMinutes();
                    if (slotEndHours.toString().length < 2) slotEndHours = "0" + slotEndHours;
                    if (slotEndMins.toString().length < 2) slotEndMins = "0" + slotEndMins;

                    var slotDisplay = slotBeginHours.toString() + slotBeginMins.toString() + "-" + slotEndHours.toString() + slotEndMins.toString();
                    scope.rowHeaderDisplay.push(slotDisplay);
                }
            }


            var removeResignedConsultantWithNoApp = function () {
                var ValidConsultantList = [];
                var date = new Date(scope.dt);

                for (var con in scope.columnHeader) {
                    var expiryDate = new Date(scope.columnHeader[con].ExpiryDate);
                    if (expiryDate < date) {
                        var extendPeriod = new Date(expiryDate);
                        extendPeriod.setDate(extendPeriod.getDate() + 90);

                        if (date <= extendPeriod) {
                            var totalAppts = 0;
                            totalAppts = getTotalAppForConsultant(scope.columnHeader[con].Id);
                            if (totalAppts > 0) {
                                ValidConsultantList.push(scope.columnHeader[con]);
                            }
                        }
                    }
                    else {
                        ValidConsultantList.push(scope.columnHeader[con]);
                    }

                }

                scope.columnHeader = ValidConsultantList;
                scope.$parent.columnHeader = ValidConsultantList;
            }


            var generateGrid = function () {
                scope.gridName = attrs.Name
                scope.outlet = attrs.outletid;
                scope.sdate = attrs.sdate;



                //element.empty();
                //$compile(element.contents())(scope);


                if (scope.outletData != null && scope.outletData != "undefined") {
                    scope.NoofBeds = scope.outletData.Beds;
                }


                scope.rowHeader = getSlotSetting(); //get slot setting (prefer/weekday/general)
                scope.$parent.rowHeader = scope.rowHeader;

                var interval = scope.rowHeader[0].SlotInterval_Min;
                generateSlots();

                //remove expired consultant dont have appointments on that day
                removeResignedConsultantWithNoApp();


                //generate grid Model
                scope.gridDataModel = [];
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;



                for (var i = 0; i <= rows; i++) {
                    scope.gridDataModel.push([]);
                }

                //headers
                var obj = { type: 'empty' }; //cell(0,0)
                scope.gridDataModel[0].push(obj);

                for (var j = 0; j < cols; j++) {  //column header(consultants)

                    var consultantShortName = scope.columnHeader[j].ShortName;
                    if (consultantShortName == null || consultantShortName == "") {
                        consultantShortName = scope.columnHeader[j].Name;
                    }

                    if (consultantShortName.length > 20) {
                        consultantShortName = consultantShortName.substr(0, 20);
                    }

                    obj = { type: "colHeader", consultant: consultantShortName.toUpperCase(), capacity: scope.columnHeader[j].Capacity };
                    scope.gridDataModel[0].push(obj);
                    scope.consultanttotal.push(0);
                }



                obj = { type: "c1Header", consultant: "NC", capacity: 0 }; //c1 header
                scope.gridDataModel[0].push(obj);



                for (var i = 1; i <= rows; i++) {
                    scope.slottotal.push(0);
                    obj = { type: "rowHeader", slot: scope.rowHeaderData[i - 1], display: scope.rowHeaderDisplay[i - 1] };
                    scope.gridDataModel[i].push(obj);

                    //data from from cell (1,1)
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

                        obj = { type: 'data', slot: scope.rowHeaderData[i - 1], consultant: scope.columnHeader[j].Id, appt: apps, total: totalapps, block: blocked, wait: appwait, totalwait: totalwait, cancel: appcan, totalcancel: totalcan, checkin: appcheckin, totalcheckin: totalcheckin, noshow: appnoshow, totalnoshow: totalnoshow };

                        scope.gridDataModel[i].push(obj);
                    }



                    //c1customers
                    var appsc1 = getC1App(scope.rowHeaderData[i - 1], interval);
                    var totalC1apps = 0;
                    if (appsc1 != null || appsc1 != undefined) totalC1apps = appsc1.length;
                    obj = { type: 'dataC1', slot: scope.rowHeaderData[i - 1], c1appt: appsc1, total: totalC1apps };
                    scope.gridDataModel[i].push(obj);
                }



                //draw grid  by gridDataModel

                cols = cols + 1; // add for c1customer

                var divScroll = angular.element("<div class='tab-wrapper'>");
                var tableElem = angular.element("<table id='eApptTable' class='table' >");
                var tbodyElem = angular.element("<tbody>");

                for (var row = 0; row <= rows; row++) {
                    var tbody = null;
                    if (row == 0)
                        tbody = angular.element("<thead>");
                    else
                        tbody = tbodyElem;

                    var rowElem = angular.element("<tr class='row-1st'>");

                    for (var col = 0; col <= cols; col++) {
                        //console.log(scope.gridDataModel[row][col].type);


                        if (scope.gridDataModel[row][col].type == "empty") { //set cell (0,0) 
                            var cell = angular.element("<th  class='col-HD' >").attr("Id", row + "-" + col).html('<div class="time-title">TIME </br>(24hrs)</div>'); /*class='first' */
                            rowElem.append(cell);
                        }
                        else if (scope.gridDataModel[row][col].type == "colHeader") { //set column header consultant name

                            var colHeader = angular.element("<th>").attr("Id", "cons" + "-" + col).html('<div title = ' + scope.columnHeader[col - 1].Id + ',' + scope.columnHeader[col - 1].Capacity + ' class="cons-title-cell">' + scope.gridDataModel[row][col].consultant + '</div>');

                            if (col % 2 == 0) colHeader.addClass("tt-hd")
                            else colHeader.addClass("tt-hd-alt");

                            //colHeader.attr('ng-click', 'addColumnBlock(' + col + ')');



                            rowElem.append(colHeader);
                        }


                        else if (scope.gridDataModel[row][col].type == "c1Header") { //column c1 header
                            var colHeader = angular.element("<th class='col-last'> ").attr("Id", row + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</div>'); /*  class='last' */


                            rowElem.append(colHeader);
                        }
                        else if (scope.gridDataModel[row][col].type == "rowHeader") {//set row header(slots)
                            var slotrow = row - 1;

                            //var rowHeader = angular.element("<td class='col-1st btm-border'>").attr("Id", "slot" + "-" + row).html(scope.gridDataModel[row][col].display + '<div class="bed-quantity">{{slottotal[' + slotrow + ']}}</div><img src="Templates/images/bed-wh.png" width="70" height="49" class="bed" alt=""/>');

                            var rowHeader = angular.element("<td class='col-1st btm-border'>").attr("Id", "slot" + "-" + row).html('<div class="column-1">' + scope.gridDataModel[row][col].display + '<div class="bed-quantity">{{slottotal[' + slotrow + ']}}</div><img src="Templates/images/bed-wh.png" width="70" height="49" class="bed" alt=""/></div>');


                            //rowHeader.attr('ng-click', 'addRowBlock($event)');
                            //rowHeader.attr('ng-click', 'addRowBlock(' + row + ')');
                            //rowHeader.attr('onclick', 'addRowBlock(' + row + ')');
                            rowElem.append(rowHeader);
                        }

                        else if (scope.gridDataModel[row][col].type == "data") { //set cell from (1,1)

                            var apps = scope.gridDataModel[row][col].appt;
                            if (apps != undefined) {

                                var divElem = angular.element("<div>");

                                divElem.attr("Id", "DIV-" + row + "-" + col);
                                //divElem.attr('ng-drop', 'true');
                                divElem.addClass('apptcell')
                                //divElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                //divElem.attr('ng-click', 'chooseMethod($event, gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + '); $event.stopPropagation();');
                                var ulElem = angular.element("<ul >");
                                ulElem.attr("Id", "UL-" + row + "-" + col);
                                ulElem.attr("style", "list-style-type:none");



                                var tdid = "CI-LI-" + row + "-" + col;   //Checkin
                                for (var app in scope.gridDataModel[row][col].checkin) {
                                    var id = scope.gridDataModel[row][col].checkin[app].appid;
                                    var vipType = scope.gridDataModel[row][col].checkin[app].vipType;
                                    var gender = scope.gridDataModel[row][col].checkin[app].gender;

                                    var isanotherconsultant = scope.gridDataModel[row][col].checkin[app].isanotherconsultant;

                                    var liElem = angular.element("<li class='bg-pink'>");

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

                                    var customerId = scope.gridDataModel[row][col].checkin[app].custId;
                                    liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].checkin[' + app + '].custName}}</span>  ');
                                    liElem.attr("Id", id);
                                    ulElem.append(liElem);

                                }



                                var tdid = "APP-LI-" + row + "-" + col;  //confirm
                                for (var app in scope.gridDataModel[row][col].appt) {
                                    var id = scope.gridDataModel[row][col].appt[app].appid;
                                    var vipType = scope.gridDataModel[row][col].appt[app].vipType;
                                    var gender = scope.gridDataModel[row][col].appt[app].gender;

                                    var isanotherconsultant = scope.gridDataModel[row][col].appt[app].isanotherconsultant;

                                    var liElem = angular.element("<li >");
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
                                    var customerId = scope.gridDataModel[row][col].appt[app].custId;
                                    liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custName}}</span>  ');

                                    liElem.attr("Id", id);
                                    ulElem.append(liElem);

                                }




                                var tdid = "NS-LI-" + row + "-" + col;  //No show
                                for (var app in scope.gridDataModel[row][col].noshow) {
                                    var id = scope.gridDataModel[row][col].noshow[app].appid;
                                    var liElem = angular.element('<li class="bg-grey" >');

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

                                    liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].noshow[' + app + '].custName}}</span>  ');
                                    liElem.attr("Id", id);

                                    ulElem.append(liElem);

                                }



                                var tdid = "CL-LI-" + row + "-" + col;  //Cancel
                                for (var app in scope.gridDataModel[row][col].cancel) {
                                    var id = scope.gridDataModel[row][col].cancel[app].appid;
                                    var liElem = angular.element('<li class="bg-red"   ng-show="showCancel">');

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

                                    liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                    liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                    liElem.attr('ng-center-anchor', 'true');


                                    liElem.html('<span class="tt-custid_wh" ng-show={{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].viptype}}]</span><span class="tt-custid_wh" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + row + '][' + col + '].cancel[' + app + '].custName}}</span>  ');
                                    liElem.attr("Id", id);
                                    ulElem.append(liElem);

                                }


                                var unSortedWaitList = scope.gridDataModel[row][col].wait;
                                var VipCategory = ['S', 'E', 'M', 'A'];
                                var sortedWaitList = [];
                                for (var c in VipCategory) {

                                    var waitSorted = [];
                                    waitSorted = getCategorySortedForWait(VipCategory[c], unSortedWaitList);

                                    for (var i in waitSorted) {
                                        sortedWaitList.push(waitSorted[i]);
                                    }
                                }

                                scope.gridDataModel[row][col].wait = sortedWaitList;


                                var tdid = "WL-LI-" + row + "-" + col; //waiting list
                                for (var app in scope.gridDataModel[row][col].wait) {
                                    var id = scope.gridDataModel[row][col].wait[app].appid;
                                    var liElem = angular.element('<li class="bg-green" >');

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

                                    liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + row + '][' + col + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custName}}</span>  ');

                                    liElem.attr("Id", id);
                                    ulElem.append(liElem);

                                }




                                divElem.append(ulElem);



                                var consultantId = scope.gridDataModel[row][col].consultant;

                                var tdElem = angular.element("<td>");
                                tdElem.attr("Id", row + "-" + col);
                                tdElem.attr('ng-click', 'chooseMethod($event, gridDataModel[' + row + '][' + col + '].consultant,dt, gridDataModel[' + row + '][' + col + '].slot,' + row + ', ' + col + ');$event.stopPropagation(); ');


                                if (scope.gridDataModel[row][col].block.length) {
                                    if (scope.gridDataModel[row][col].block[0].Id != null && scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                                        tdElem.addClass('bg-block');
                                    }
                                }

                                tdElem.append(divElem);
                                rowElem.append(tdElem);

                            }

                            else {

                                var tdElem = angular.element("<td>");
                                var divElem = angular.element("<div>");
                                divElem.addClass('apptcell')
                                var ulElem = angular.element("<ul>");
                                divElem.append(ulElem);
                                divElem.append(ulElem);
                                tdElem.append(divElem);
                                tdElem.attr("Id", row + "-" + col);
                                rowElem.append(tdElem);
                            }
                        }


                        else if (scope.gridDataModel[row][col].type == "dataC1") { //c1 data

                            var apps = scope.gridDataModel[row][col].c1appt;
                            if (apps != undefined) {
                                var divElem = angular.element("<div>");
                                var ulElem = angular.element("<ul>");

                                var tdid = row + "-" + col;
                                var title = "";
                                for (var app in scope.gridDataModel[row][col].c1appt) {
                                    var custName = scope.gridDataModel[row][col].c1appt[app].custName;
                                    title = title + custName + '\x0A';
                                }

                                var tdElem = angular.element("<td class='last'>");


                                tdElem.attr("Id", row + "-" + col);
                                divElem.text(apps.length)
                                divElem.attr('title', title);

                                tdElem.append(divElem);
                                tdElem.attr('ng-click', 'popupC1Customers( gridDataModel[' + row + '][' + col + '].c1appt)');
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
                    //tableElem.append(rowElem);

                    tbody.append(rowElem);
                    tableElem.append(tbody);
                }

                divScroll.append(tableElem);
                element.append(divScroll);


                getConsultantTotal();
                getSlotTotal();
                //redrawTableColumnHeader();
                $compile(element.contents())(scope);




            }

            var getCategorySortedForWait = function (type, waitappointment) {
                var waitappointments = [];
                for (var i in waitappointment) {
                    if (waitappointment[i].viptype == type) {
                        waitappointments.push(waitappointment[i]);
                    }
                }
                return waitappointments;
            }



            scope.popupC1Customers = function (c1customers) {
                scope.$parent.callPopupC1Customers(c1customers);
            }

            //show popup when cell is clicked. When block is enabled then popop not called
            scope.chooseMethod = function ($event, consultantId, date, time, row, col) {
                var time12 = zSrv_UtilService.convertTimeTo12Hour(time);
                scope.$parent.block ? scope.addBlock($event) : scope.$parent.callPopupNew($event, consultantId, date, time, row, col);
            }

            //find the  refresh row when date,time or consultant changed in the update view
            scope.$parent.getRefreshRow = function (BookTime) {
                var bookTime = BookTime;
                var interval = scope.rowHeader[0].SlotInterval_Min;


                bookTime = zSrv_UtilService.convertTimeTo24Hour(bookTime);

                var slotHours = bookTime.substr(0, 2);
                var slotMins = bookTime.substr(3, 2);

                if (slotMins >= interval)
                    slotMins = interval;
                else
                    slotMins = "00";

                var bookSlot = slotHours + ":" + slotMins;

                for (var i in scope.rowHeaderData) {
                    if (scope.rowHeaderData[i] == bookSlot) {
                        return parseInt(i) + 1;
                    }
                }
                return 0;
            }

            //find the  refresh col when date,time or consultant changed in the update view
            scope.$parent.getRefreshCol = function (AssignToConsultantId) {

                for (var i in scope.columnHeader) {
                    if (scope.columnHeader[i].Id == AssignToConsultantId) {
                        return parseInt(i) + 1;
                    }
                }
                return 0;
            }

            //refresh cell after updateview
            scope.$parent.refreshGridCell = function (tocellId) { //, fromcellI
                refreshToCell(tocellId);

                //if (tocellId != fromcellId) {
                //    refreshToCell(fromcellId);
                //}

                getConsultantTotal();
                getSlotTotal();
                //redrawTableColumnHeader();
            }


            var getAppointmentModal = function (appointment,toRow,toCol) {

                var vipType = "S";

                var TransactionAmount = appointment.TransactionAmount;
                var gender = appointment.Gender;
                var vipType = getVipType(TransactionAmount);
                var isscan = appointment.IsScan;
                var isskinanalysis = appointment.IsSkinAnalysis;


                var isviptype = true;



                var skinBrand = false;

                var srcGender = "";
                var ismale = false;

                if (IsSkinBrand() == "YES") {
                    skinBrand = true;
                    if (gender == "M") srcGender = "Templates/images/icon-male.png";

                    if (srcGender != "") ismale = true;
                }


                var srcScan = "";
                if (isscan) {

                    srcScan = "Templates/images/icon-scan.png";
                }



                var tooltip = {
                    "custId": appointment.CustomerId_AES,
                    "custName": appointment.CustomerName,
                    "consultant": appointment.ConsultantShortName,
                    //"time": scope.gridDataModel[toRow][toCol].slot,
				    "time": appointment.BookTime,
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

                return rec;
            }



            //add new appointment 
            scope.$parent.refreshNewAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

              

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);

                scope.gridDataModel[toRow][toCol].appt.push(rec);
               

                getConsultantTotal();
                getSlotTotal();
                

            }

            scope.$parent.refreshUpdateAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];


              

                 var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {


                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);

                        var appt = scope.gridDataModel[fromRow][fromCol].appt;
                        scope.gridDataModel[fromRow][fromCol].total = appt.length;

                    }
                }
                scope.gridDataModel[toRow][toCol].appt.push(rec);



                getConsultantTotal();
                getSlotTotal();
                

            }



            //add new wait appointment
            scope.$parent.refreshWaitAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

               

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);

                scope.gridDataModel[toRow][toCol].wait.push(rec);
                

                getConsultantTotal();
                getSlotTotal();
                

            }

            //add new wait appointment
            scope.$parent.refreshCancelhWaitAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

               

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].wait) {
                    if (scope.gridDataModel[fromRow][fromCol].wait[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].wait.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].cancel.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //add new wait appointment
            scope.$parent.refreshUpdateWaitAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];


                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

               

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);

                for (var app in scope.gridDataModel[fromRow][fromCol].wait) {
                    if (scope.gridDataModel[fromRow][fromCol].wait[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].wait.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].wait.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //confirm appointment to cacel and refresh the grid
            scope.$parent.refreshCancelAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].cancel.push(rec);

                getConsultantTotal();
                getSlotTotal();
               
            }


            //change confirm to checkin appointment and refresh grid
            scope.$parent.refreshCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {



                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];


                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

               


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);

                    }
                }

                scope.gridDataModel[toRow][toCol].checkin.push(rec);

                getConsultantTotal();
                getSlotTotal();
                

            }

            //change confirm to checkin appointment and refresh grid
            scope.$parent.refreshUpdateCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {



                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].checkin) {
                    if (scope.gridDataModel[fromRow][fromCol].checkin[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].checkin.splice(app, 1);


                    }
                }

                scope.gridDataModel[toRow][toCol].checkin.push(rec);

                getConsultantTotal();
                getSlotTotal();
                

            }

            //cancel checkin appointment
            scope.$parent.refreshCancelCheckinAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].checkin) {
                    if (scope.gridDataModel[fromRow][fromCol].checkin[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].checkin.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].cancel.push(rec);


                getConsultantTotal();
                getSlotTotal();
               

            }


            //change  checkin appointment to confirm
            scope.$parent.refreshConfirmCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].checkin) {
                    if (scope.gridDataModel[fromRow][fromCol].checkin[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].checkin.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].appt.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }


            //change appointment from confirm to noShow 
            scope.$parent.refreshNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {

                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {


                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);

                        var appt = scope.gridDataModel[fromRow][fromCol].appt;
                        scope.gridDataModel[fromRow][fromCol].total = appt.length;

                    }
                }

                scope.gridDataModel[toRow][toCol].noshow.push(rec);

                getConsultantTotal();
                getSlotTotal();
                

            }

            //change confirm to checkin appointment and refresh grid
            scope.$parent.refreshUpdateNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {



                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].noshow) {
                    if (scope.gridDataModel[fromRow][fromCol].noshow[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].noshow.splice(app, 1);


                    }
                }

                scope.gridDataModel[toRow][toCol].noshow.push(rec);

                getConsultantTotal();
                getSlotTotal();
               

            }

            //noshow -confirm
            scope.$parent.refreshConfirmNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].noshow) {
                    if (scope.gridDataModel[fromRow][fromCol].noshow[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].noshow.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].appt.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //checkin to noshow
            scope.$parent.refreshNoShowCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].noshow) {
                    if (scope.gridDataModel[fromRow][fromCol].noshow[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].noshow.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].checkin.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //checkinto no show
            scope.$parent.refreshCheckInNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

              

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].checkin) {
                    if (scope.gridDataModel[fromRow][fromCol].checkin[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].checkin.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].noshow.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //Confirm to wait
            scope.$parent.refreshWaitConfirmAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].wait.push(rec);


                getConsultantTotal();
                getSlotTotal();
               

            }

            //Wait to Confirm
            scope.$parent.refreshConfirmWaitAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

                

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].wait) {
                    if (scope.gridDataModel[fromRow][fromCol].wait[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].wait.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].appt.push(rec);


                getConsultantTotal();
                getSlotTotal();
                

            }

            //Checkin to wait
            scope.$parent.refreshWaitCheckInAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

               


                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].checkin) {
                    if (scope.gridDataModel[fromRow][fromCol].checkin[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].checkin.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].wait.push(rec);


                getConsultantTotal();
                getSlotTotal();
              

            }

            //NoShow to wait
            scope.$parent.refreshWaitNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];

               

                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].noshow) {
                    if (scope.gridDataModel[fromRow][fromCol].noshow[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].noshow.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].wait.push(rec);


                getConsultantTotal();
                getSlotTotal();
               

            }

            //cancel noshow appointment
            scope.$parent.refreshCancelNoShowAppointment = function (appointment, tocellId, appid, fromcellId) {
                var toCell = tocellId.split("-");
                var toRow = toCell[0];
                var toCol = toCell[1];

                var fromCell = fromcellId.split("-");
                var fromRow = fromCell[0];
                var fromCol = fromCell[1];



                var rec = {};
                rec = getAppointmentModal(appointment, toRow, toCol);


                for (var app in scope.gridDataModel[fromRow][fromCol].noshow) {
                    if (scope.gridDataModel[fromRow][fromCol].noshow[app].appid == appid) {
                        scope.gridDataModel[fromRow][fromCol].noshow.splice(app, 1);
                    }
                }

                scope.gridDataModel[toRow][toCol].cancel.push(rec);


                getConsultantTotal();
                getSlotTotal();


            }

            var getCategorySorted = function (type, appointment) {
                var appointments = [];
                for (var i in appointment) {
                    if (appointment[i].vipCategory == type) {
                        appointments.push(appointment[i]);
                    }
                }
                return appointments;
            }

            //list appointments in a cell (row,col) to show popup (appt,waiting,checkin)
            scope.$parent.getAppointments = function (row, col) {

                var appointments = [];

                var appointment = {};

                var VipCategory = ['S', 'E', 'M', 'A'];

                if (scope.gridDataModel[row][col].checkin.length > 0) {
                    var appointmentUnSorted = [];
                    for (var app in scope.gridDataModel[row][col].checkin) {
                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].checkin[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].checkin[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].checkin[app].custName;
                        appointment.vipCategory = scope.gridDataModel[row][col].checkin[app].viptype;
                        appointment.type = "bg-pink";
                        appointmentUnSorted.push(appointment);
                    }

                    for (var c in VipCategory) {
                        var appointmentSorted = [];
                        appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                        for (var i in appointmentSorted) {
                            appointments.push(appointmentSorted[i]);
                        }
                    }

                }


                if (scope.gridDataModel[row][col].appt.length > 0) {
                    var appointmentUnSorted = [];
                    for (var app in scope.gridDataModel[row][col].appt) {

                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].appt[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].appt[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].appt[app].custName;
                        if (scope.gridDataModel[row][col].appt[app].isanotherconsultant == true)
                            appointment.type = "bg-orange"
                        else
                            appointment.type = "bg-trans";
                        appointment.vipCategory = scope.gridDataModel[row][col].appt[app].viptype;
                        appointmentUnSorted.push(appointment);
                    }

                    for (var c in VipCategory) {
                        var appointmentSorted = [];
                        appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                        for (var i in appointmentSorted) {
                            appointments.push(appointmentSorted[i]);
                        }
                    }
                }


                if (scope.gridDataModel[row][col].noshow.length > 0) {
                    for (var app in scope.gridDataModel[row][col].noshow) {
                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].noshow[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].noshow[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].noshow[app].custName;
                        appointment.vipCategory = scope.gridDataModel[row][col].noshow[app].viptype;
                        appointment.type = "bg-grey";
                        appointments.push(appointment);
                    }
                }

                if (scope.gridDataModel[row][col].wait.length > 0) {
                    var appointmentUnSorted = [];
                    for (var app in scope.gridDataModel[row][col].wait) {
                        appointment = {};
                        appointment.appid = scope.gridDataModel[row][col].wait[app].appid;
                        appointment.customerId = scope.gridDataModel[row][col].wait[app].custId_Aes;
                        appointment.customerName = scope.gridDataModel[row][col].wait[app].custName;
                        appointment.vipCategory = scope.gridDataModel[row][col].wait[app].viptype;
                        appointment.type = "bg-green";
                        appointmentUnSorted.push(appointment);
                    }

                    for (var c in VipCategory) {
                        var appointmentSorted = [];
                        appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                        for (var i in appointmentSorted) {
                            appointments.push(appointmentSorted[i]);
                        }
                    }

                }

                return appointments;
            }

                //list appointments in a cell (row,col) to show popup (appt,waiting,checkin)
                scope.$parent.getAppointmentsWithoutWait = function (row,customerId) {

                    var appointments = [];

                    var appointment = {};

                    var VipCategory = ['S', 'E', 'M', 'A'];

                    var cols = scope.columnHeader.length;
                    for (var col =1; col < cols; col++) {

                        if (scope.gridDataModel[row][col].checkin.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].checkin) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].checkin[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].checkin[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].checkin[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].checkin[app].viptype;
                                appointment.type = "bg-pink";
                                if(appointment.customerId == customerId){
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }

                        }


                        if (scope.gridDataModel[row][col].appt.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].appt) {
                                
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].appt[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].appt[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].appt[app].custName;
                                if (scope.gridDataModel[row][col].appt[app].isanotherconsultant == true)
                                    appointment.type = "bg-orange"
                                else
                                    appointment.type = "bg-trans";
                                appointment.vipCategory = scope.gridDataModel[row][col].appt[app].viptype;

                                if(appointment.customerId == customerId){
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }
                        }


                        if (scope.gridDataModel[row][col].noshow.length > 0) {
                            for (var app in scope.gridDataModel[row][col].noshow) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].noshow[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].noshow[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].noshow[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].noshow[app].viptype;
                                appointment.type = "bg-grey";

                                if(appointment.customerId == customerId){
                                    appointments.push(appointment);
                                }
                            }
                        }

                    }

                return appointments;
                }


            //list appointments in a cell (row,col) to show popup (appt,waiting,checkin,waitinglist)
                scope.$parent.getAppointmentsForRow = function (row, customerId) {

                    var appointments = [];

                    var appointment = {};

                    var VipCategory = ['S', 'E', 'M', 'A'];

                    var cols = scope.columnHeader.length;
                    for (var col = 1; col < cols; col++) {

                        if (scope.gridDataModel[row][col].checkin.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].checkin) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].checkin[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].checkin[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].checkin[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].checkin[app].viptype;
                                appointment.type = "bg-pink";
                                if (appointment.customerId == customerId) {
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }

                        }


                        if (scope.gridDataModel[row][col].appt.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].appt) {

                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].appt[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].appt[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].appt[app].custName;
                                if (scope.gridDataModel[row][col].appt[app].isanotherconsultant == true)
                                    appointment.type = "bg-orange"
                                else
                                    appointment.type = "bg-trans";
                                appointment.vipCategory = scope.gridDataModel[row][col].appt[app].viptype;

                                if (appointment.customerId == customerId) {
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }
                        }


                        if (scope.gridDataModel[row][col].noshow.length > 0) {
                            for (var app in scope.gridDataModel[row][col].noshow) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].noshow[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].noshow[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].noshow[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].noshow[app].viptype;
                                appointment.type = "bg-grey";

                                if (appointment.customerId == customerId) {
                                    appointments.push(appointment);
                                }
                            }
                        }

                        if (scope.gridDataModel[row][col].wait.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].wait) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].wait[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].wait[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].wait[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].wait[app].viptype;
                                appointment.type = "bg-green";
                                if (appointment.customerId == customerId) {
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }

                        }

                    }

                    return appointments;
                }


            //list appointments in a cell (row,col) to show popup (appt,checkin)
                scope.$parent.getAppointmentsConfirmed= function (row, customerId) {

                    var appointments = [];

                    var appointment = {};

                    var VipCategory = ['S', 'E', 'M', 'A'];

                    var cols = scope.columnHeader.length;
                    for (var col = 1; col < cols; col++) {

                        if (scope.gridDataModel[row][col].checkin.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].checkin) {
                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].checkin[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].checkin[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].checkin[app].custName;
                                appointment.vipCategory = scope.gridDataModel[row][col].checkin[app].viptype;
                                appointment.type = "bg-pink";
                                if (appointment.customerId == customerId) {
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }

                        }


                        if (scope.gridDataModel[row][col].appt.length > 0) {
                            var appointmentUnSorted = [];
                            for (var app in scope.gridDataModel[row][col].appt) {

                                appointment = {};
                                appointment.appid = scope.gridDataModel[row][col].appt[app].appid;
                                appointment.customerId = scope.gridDataModel[row][col].appt[app].custId_Aes;
                                appointment.customerName = scope.gridDataModel[row][col].appt[app].custName;
                                if (scope.gridDataModel[row][col].appt[app].isanotherconsultant == true)
                                    appointment.type = "bg-orange"
                                else
                                    appointment.type = "bg-trans";
                                appointment.vipCategory = scope.gridDataModel[row][col].appt[app].viptype;

                                if (appointment.customerId == customerId) {
                                    appointmentUnSorted.push(appointment);
                                }
                            }

                            for (var c in VipCategory) {
                                var appointmentSorted = [];
                                appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                                for (var i in appointmentSorted) {
                                    appointments.push(appointmentSorted[i]);
                                }
                            }
                        }


                        //if (scope.gridDataModel[row][col].noshow.length > 0) {
                        //    for (var app in scope.gridDataModel[row][col].noshow) {
                        //        appointment = {};
                        //        appointment.appid = scope.gridDataModel[row][col].noshow[app].appid;
                        //        appointment.customerId = scope.gridDataModel[row][col].noshow[app].custId_Aes;
                        //        appointment.customerName = scope.gridDataModel[row][col].noshow[app].custName;
                        //        appointment.vipCategory = scope.gridDataModel[row][col].noshow[app].viptype;
                        //        appointment.type = "bg-grey";

                        //        if (appointment.customerId == customerId) {
                        //            appointments.push(appointment);
                        //        }
                        //    }
                        //}

                    }

                    return appointments;
                }







            //list wait appointments in a cell (row,col) to show popup (appt,waiting,checkin)
            scope.$parent.getWaitAppointments = function (row, columns) {

                var appointments = [];

                var appointment = {};

                var VipCategory = ['S', 'E', 'M', 'A'];

                var cols = scope.columnHeader.length;
                for (var col = 1; col < cols; col++) {


                    if (scope.gridDataModel[row][col].wait.length > 0) {
                        var appointmentUnSorted = [];
                        for (var app in scope.gridDataModel[row][col].wait) {
                            appointment = {};
                            appointment.appid = scope.gridDataModel[row][col].wait[app].appid;
                            appointment.customerId = scope.gridDataModel[row][col].wait[app].custId_Aes;
                            appointment.customerName = scope.gridDataModel[row][col].wait[app].custName;
                            appointment.vipCategory = scope.gridDataModel[row][col].wait[app].viptype;
                            appointment.type = "bg-green";
                            appointmentUnSorted.push(appointment);
                        }

                        for (var c in VipCategory) {
                            var appointmentSorted = [];
                            appointmentSorted = getCategorySorted(VipCategory[c], appointmentUnSorted);

                            for (var i in appointmentSorted) {
                                appointments.push(appointmentSorted[i]);
                            }
                        }

                    }
                }



                return appointments;
            }


            //add appointment to the cell tocellId (used by drag and drop)
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


                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
                    if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {


                        var newslot = scope.gridDataModel[toRow][toCol].slot;
                        var custid = scope.gridDataModel[fromRow][fromCol].appt[app].custId;
                        var obj = scope.gridDataModel[fromRow][fromCol].appt[app];
                        obj.slot = newslot;
                        obj.custid = custid
                        var total = scope.gridDataModel[toRow][toCol].total;
                        total = total + 1;
                        scope.gridDataModel[toRow][toCol].total = total;

                        var newconsultant = scope.gridDataModel[toRow][toCol].consultant;
                        var oldconsultant = scope.gridDataModel[fromRow][fromCol].appt[app].consultant;


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
                            var liElem = angular.element("<li class='bg-custid' >");
                        else
                            var liElem = angular.element("<li class ='anotherConsultant'>");

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

                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].viptype}}]</span>  <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + toRow + '][' + toCol + '].appt[' + app + '].custName}}</span>  ');

                        liElem.attr("Id", appid);

                        var ele = "#" + tdid;

                        var tdElem = angular.element(ele);
                        var ulElem = angular.element(document.querySelector('#' + ulid));

                        ulElem.append(liElem);
                        $compile(element.contents())(scope);

                        console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);



                    }

                }

            };

            //remove appointment from the cell fromcellId (used by drag and drop)
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

                var ulElem = angular.element(document.querySelector('#' + ulid));


                var liele = "li";
                var liElem = ulElem.find(liele);


                angular.forEach(angular.element(liElem), function (value, key) {
                    var data = angular.element(value);
                    data.remove();
                });



                for (var app in scope.gridDataModel[fromRow][fromCol].appt) {
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



            //refresh the cell- generate all li elements

            var refreshCell = function (refreshCellId) {

                var refreshCell = refreshCellId.split("-");
                var refreshRow = refreshCell[2];
                var refreshCol = refreshCell[3];

                var ele = "#" + refreshRow + "-" + refreshCol;

                var tdElem = angular.element(ele);




                var ulid = "UL-" + refreshRow + "-" + refreshCol;
                var ulElem = angular.element(document.querySelector('#' + ulid));




                var apps = scope.gridDataModel[refreshRow][refreshCol].appt;
                if (apps != undefined) {




                    var apps = scope.gridDataModel[refreshRow][refreshCol].checkin;
                    if (apps != undefined) {


                        var tdid = "CI-LI-" + refreshRow + "-" + refreshCol;

                        for (var app in scope.gridDataModel[refreshRow][refreshCol].checkin) {
                            var id = scope.gridDataModel[refreshRow][refreshCol].checkin[app].appid;

                            var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].checkin[app].isanotherconsultant;

                            var liElem = angular.element("<li class='bg-pink'>");


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

                            var liElem = angular.element("<li>");
                            liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].checkin[app].title);



                            liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].viptype}}]</span> <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName}}</span>  ');
                            liElem.attr("Id", id);


                            ulElem.append(liElem);

                        }

                    }

                    var tdid = "APP-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].appt) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].appt[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].appt[app].isanotherconsultant;

                        var liElem = angular.element("<li >");
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

                        var liElem = angular.element("<li>");
                        liElem.attr('title', scope.gridDataModel[refreshRow][refreshCol].appt[app].title);


                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);

                        ulElem.append(liElem);

                    }

                }

                apps = scope.gridDataModel[refreshRow][refreshCol].noshow;
                if (apps != undefined) {

                    var tdid = "NS-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].noshow) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].noshow[app].appid;
                        var liElem = angular.element('<li class="bg-grey" >');

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
                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].viptype}}]</span><span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        ulElem.append(liElem);


                    }

                }


                apps = scope.gridDataModel[refreshRow][refreshCol].cancel;
                if (apps != undefined) {

                    var tdid = "CL-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].cancel) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        var liElem = angular.element('<li class="bg-red"  ng-show="showCancel">');

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

                        liElem.html('<span class="tt-custid_wh" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} ">[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].viptype}}]</span><span ng-show="!showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);

                        ulElem.append(liElem);


                    }

                }



                var unSortedWaitList = scope.gridDataModel[refreshRow][refreshCol].wait;
                var VipCategory = ['S', 'E', 'M', 'A'];
                var sortedWaitList = [];
                for (var c in VipCategory) {

                    var waitSorted = [];
                    waitSorted = getCategorySortedForWait(VipCategory[c], unSortedWaitList);

                    for (var i in waitSorted) {
                        sortedWaitList.push(waitSorted[i]);
                    }
                }

                scope.gridDataModel[refreshRow][refreshCol].wait = sortedWaitList;


                apps = scope.gridDataModel[refreshRow][refreshCol].wait;
                if (apps != undefined) {

                    var tdid = "WL-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].wait) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].wait[app].appid;
                        var liElem = angular.element('<li class="bg-green" >');

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
                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName}}</span> ');
                        liElem.attr("Id", id);

                        ulElem.append(liElem);


                    }

                }


                //$compile(element.contents())(scope);
                $compile(ulElem.contents())(scope);
            }

            //refresh cell
            var refreshToCell = function (refreshCellId) {

                var refreshCell = refreshCellId.split("-");
                var refreshRow = refreshCell[0];
                var refreshCol = refreshCell[1];

                var ele = "#" + refreshRow + "-" + refreshCol;

                var tdElem = angular.element(ele);






                var ulid = "UL-" + refreshRow + "-" + refreshCol;
                var ulElem = angular.element(document.querySelector('#' + ulid));


                var liele = "li";
                var liElem = ulElem.find(liele);


                angular.forEach(angular.element(liElem), function (value, key) {
                    var data = angular.element(value);
                    data.remove();
                });




                var apps = scope.gridDataModel[refreshRow][refreshCol].appt;
                if (apps != undefined) {




                    var apps = scope.gridDataModel[refreshRow][refreshCol].checkin;
                    if (apps != undefined) {


                        var tdid = "CI-LI-" + refreshRow + "-" + refreshCol;

                        for (var app in scope.gridDataModel[refreshRow][refreshCol].checkin) {
                            var id = scope.gridDataModel[refreshRow][refreshCol].checkin[app].appid;

                            var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].checkin[app].isanotherconsultant;

                            var liElem = angular.element("<li class='bg-pink'>");

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



                            liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].viptype}}]</span> <span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].checkin[' + app + '].custName}}</span>  ');
                            liElem.attr("Id", id);


                            ulElem.append(liElem);

                        }

                    }

                    var tdid = "APP-LI-" + refreshRow + "-" + refreshCol;
                    for (var app in scope.gridDataModel[refreshRow][refreshCol].appt) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].appt[app].appid;

                        var isanotherconsultant = scope.gridDataModel[refreshRow][refreshCol].appt[app].isanotherconsultant;

                        var liElem = angular.element("<li >");
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

                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].viptype}}]</span><span class="tt-custid" ng-show="!showName" >  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custName}}</span>  ');
                        liElem.attr("Id", id);
                        ulElem.append(liElem);

                    }
                }


                apps = scope.gridDataModel[refreshRow][refreshCol].noshow;
                if (apps != undefined) {

                    var tdid = "NS-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].noshow) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].noshow[app].appid;
                        var liElem = angular.element('<li class="bg-grey" >');

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

                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].isviptype}} >&nbsp;[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].noshow[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);
                        ulElem.append(liElem);


                    }

                }

                var apps = scope.gridDataModel[refreshRow][refreshCol].cancel;
                if (apps != undefined) {


                    var tdid = "CL-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].cancel) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        var id = scope.gridDataModel[refreshRow][refreshCol].cancel[app].appid;
                        var liElem = angular.element('<li class="bg-red"  ng-show="showCancel">');

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


                        liElem.html('<span class="tt-custid_wh" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid_wh">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].cancel[' + app + '].custName}}</span> ');

                        liElem.attr("Id", id);

                        ulElem.append(liElem);


                    }
                }





                var unSortedWaitList = scope.gridDataModel[refreshRow][refreshCol].wait;
                var VipCategory = ['S', 'E', 'M', 'A'];
                var sortedWaitList = [];
                for (var c in VipCategory) {

                    var waitSorted = [];
                    waitSorted = getCategorySortedForWait(VipCategory[c], unSortedWaitList);

                    for (var i in waitSorted) {
                        sortedWaitList.push(waitSorted[i]);
                    }
                }

                scope.gridDataModel[refreshRow][refreshCol].wait = sortedWaitList;


                var apps = scope.gridDataModel[refreshRow][refreshCol].wait;
                if (apps != undefined) {


                    var tdid = "WL-LI-" + refreshRow + "-" + refreshCol;

                    for (var app in scope.gridDataModel[refreshRow][refreshCol].wait) {
                        var id = scope.gridDataModel[refreshRow][refreshCol].wait[app].appid;

                        var liElem = angular.element('<li class="bg-green" >');

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
                        liElem.html('<span class="tt-custid" ng-show={{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].isviptype}} >[{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].viptype}}]</span> <span ng-show="!showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custId_Aes}}</span> <span ng-show="showName" class="tt-custid">  {{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].custName}}</span> ');
                        liElem.attr("Id", id);
                        ulElem.append(liElem);


                    }
                }

                //$compile(element.contents())(scope);
                $compile(ulElem.contents())(scope);

            }



            var getConsultantAppsBySlot = function (row, col) {
                var consultanttotal = 0;
                consultanttotal = consultanttotal + scope.gridDataModel[row][col].appt.length;
                consultanttotal = consultanttotal + scope.gridDataModel[row][col].checkin.length;
                return consultanttotal;
            }


            //refresh all consultant total appointments on that day
            var getConsultantTotal = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (var col = 1; col <= cols ; col++) {
                    var consultanttotal = 0;
                    for (var row = 1; row <= rows ; row++) {

                        consultanttotal = consultanttotal + scope.gridDataModel[row][col].appt.length;
                        consultanttotal = consultanttotal + scope.gridDataModel[row][col].checkin.length;
                    }
                    scope.consultanttotal[col - 1] = consultanttotal;
                }
            }

            //refresh all slot total (bed taken) on that day
            var getSlotTotal = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (var row = 1; row <= rows ; row++) {
                    var slottotal = 0;
                    for (var col = 1; col <= cols ; col++) {

                        slottotal = slottotal + scope.gridDataModel[row][col].appt.length;
                        slottotal = slottotal + scope.gridDataModel[row][col].checkin.length;

                    }
                    scope.slottotal[row - 1] = slottotal
                }

                $timeout(function () {
                    scope.redrawTableColumnHeader();
                }, 1000);
            }


            //refresh both consultant and slot  appointments 
            //bgcolor is taken out as no need to change backcolor if available or not
            var refreshAvailable = function () {
                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;



                for (var row = 1; row <= rows ; row++) {
                    for (var col = 1; col <= cols ; col++) {
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
                //redrawTableColumnHeader();

            }


            //this function is not used as bed taken calculated as no of apoointments.
            //no need to check beds assigned or not
            scope.getTakenBeds = function (row, col) {
                var takenBeds = [];


                for (var col = 1 ; col < scope.columnHeader.length; col++) {

                    for (var i in scope.gridDataModel[row][col].appt) {
                        if (scope.gridDataModel[row][col].appt[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].appt[i].bedno)
                        }

                    }

                    for (var i in scope.gridDataModel[row][col].checkin) {
                        if (scope.gridDataModel[row][col].checkin[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].checkin[i].bedno)
                        }

                    }


                    for (var i in scope.gridDataModel[row][col].wait) {
                        if (scope.gridDataModel[row][col].wait[i].bedno > 0) {
                            takenBeds.push(scope.gridDataModel[row][col].wait[i].bedno)
                        }

                    }
                }

                return takenBeds;
            }





            //check slot available for add appointment
            scope.$parent.IsBedAvailable = function (row) {

                var slottotal = scope.slottotal[row - 1];
                if (slottotal < scope.NoofBeds) {
                    return true;
                }
                else {
                    return false;
                }
            }

            scope.$parent.IsCapacityAvailable = function (row, col) {
                var capacity = scope.columnHeader[col - 1].Capacity;

                var appts = getConsultantAppsBySlot(row, col);

                if (capacity > appts) {
                    return true
                }
                else {
                    return false;
                }

            }




            // block functions

            //check the cell is blocked
            scope.$parent.IsSlotBlocked = function (row, col) {
                if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    return true;
                }
                else {
                    return false;
                }
            }

            //gt block status  by slot,consultant
            var getBlockStatus = function (slot, consultant) {
                var blockStatus = [];
                for (var app in scope.blockslot) {
                    if (scope.blockslot[app].Slot == slot && scope.blockslot[app].ConsultantId == consultant) {
                        var obj = scope.blockslot[app];
                        blockStatus.push(obj);
                    }
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

            scope.$parent.getBlockStatus = function (row, col) {
                if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {
                    return true;
                }
                else {
                    return false;
                }


            }

            //add  block when click individual cell
            scope.addBlock = function (event) {
                var ele = "#" + event.currentTarget.id;
                var currentElement = angular.element(ele);

                var cell = event.currentTarget.id;
                var Cell = cell.split("-");
                var row = parseInt(Cell[0]);
                var col = parseInt(Cell[1]);


                //if (scope.gridDataModel[row][col].total > 0)
                //    return;



                if (scope.gridDataModel[row][col].block[0].Status == "UNBLOCK" || scope.gridDataModel[row][col].block[0].Status == "") {

                    currentElement.addClass('bg-block');
                    scope.gridDataModel[row][col].block[0].Status = "BLOCK";

                }

                else if (scope.gridDataModel[row][col].block[0].Status == "BLOCK") {

                    currentElement.removeClass('bg-block');
                    scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
                }

            }



            ////add block rows when row header is clicked
            //scope.addRowBlock = function (event) {

            //    if (scope.$parent.block == false) return;

            //    var cell = event.currentTarget.id;
            //    var Cell = cell.split("-");
            //    var row = parseInt(Cell[1]);

            //    var firstcol = scope.gridDataModel[row][1].block[0].Status;

            //    var status = "";
            //    if (firstcol == "UNBLOCK" || firstcol == "")
            //        status = "BLOCK";
            //    else
            //        status = "UNBLOCK";


            //    var cols = scope.columnHeader.length;
            //    for (col = 1; col <= cols ; col++) {



            //        var ele = "#" + row + "-" + col;
            //        var currentElement = angular.element(ele);



            //        if (status == "BLOCK") {
            //            currentElement.addClass('bg-block');
            //            scope.gridDataModel[row][col].block[0].Status = "BLOCK";
            //        }
            //        else {
            //            currentElement.removeClass('bg-block');
            //            scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
            //        }
            //    }


            //}



            ////add block rows when column header is clicked
            //scope.addColumnBlock = function (event) {

            //    if (scope.$parent.block == false) return;

            //    var cell = event.currentTarget.id;
            //    var Cell = cell.split("-");
            //    var col = parseInt(Cell[1]);

            //    var firstrow = scope.gridDataModel[1][col].block[0].Status;

            //    var status = "";
            //    if (firstrow == "UNBLOCK" || firstrow == "")
            //        status = "BLOCK";
            //    else
            //        status = "UNBLOCK";


            //    var rows = scope.rowHeaderData.length;
            //    for (row = 1; row <= rows ; row++) {

            //        var ele = "#" + row + "-" + col;
            //        var currentElement = angular.element(ele);

            //        if (status == "BLOCK") {
            //            currentElement.addClass('bg-block');
            //            scope.gridDataModel[row][col].block[0].Status = "BLOCK";
            //        }
            //        else {
            //            currentElement.removeClass('bg-block');
            //            scope.gridDataModel[row][col].block[0].Status = "UNBLOCK";
            //        }

            //    }

            //}

            //save block to the database
            scope.$parent.saveBlock = function () {

                var rows = scope.rowHeaderData.length;
                var cols = scope.columnHeader.length;

                for (var row = 1; row <= rows ; row++) {
                    for (var col = 1; col <= cols ; col++) {

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


            //add block status to database if record not already exists
            var postBlockSlot = function (id, outlet, date, consultant, slot) {

                var defer_update = $q.defer();
                var id = 1;
                var BlockSlot = { "Id": id, "OutletId": outlet, "Date": date, "ConsultantId": consultant, "Slot": slot, "Status": "BLOCK" };
                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), BlockSlot).then(function (data) {
                    defer_update.resolve();
                });


            }

            //update block status to database if record already exists
            var putBlockSlot = function (id, blockSlot) {
               var defer_update = $q.defer();


                zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptBlockSlotUrl') + "/" + id, blockSlot).then(function (data) {
                    defer_update.resolve();
                });


            }



            //this function is not used .for drag and drop
            var getAppointment = function (appid) {

                dataService.getAppointment(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, "").then(function (data) {
                    scope.appt = data;
                });
            }


            //this fuction is not used ..for drag and drop
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



                    dataService.changeAppointment(zSrv_ResourceServer.getURL('eApptDailyApptUrl') + "/" + appid, scope.appt).then(function (data) {
                        scope.gridData = data;
                    });
                });
            }


           scope.$parent.getGridRows = function () {
                return scope.rowHeaderData.length;
            }

            scope.$parent.getGridCols = function () {
               return scope.columnHeader.length;
            }

            generateGrid();




            $timeout(function () {
                if (!$('#touchElement').length) {
                    //function isTouchDevice() {
                    //    try {
                    //        document.createEvent("TouchEvent");
                    //        return true;
                    //    } catch (e) {
                    //        return false;
                    //    }
                    //}



                    //function touchScroll(id) {
                    //    if (isTouchDevice()) { //if touch events exist...
                    //        var el = document.getElementById(id);
                    //        var scrollStartXPos = 0;
                    //        var scrollStartYPos = 0;

                    //        document.getElementById(id).addEventListener("touchstart", function (event) {
                    //            scrollStartXPos = this.scrollLeft + event.touches[0].pageX;
                    //            scrollStartYPos = $(window).scrollTop() + event.touches[0].pageY;
                    //            //     console.log('>> pageX: ' + event.touches[0].pageX + ' pageY: ' + event.touches[0].pageY + ', scrollStartXPos: ' + scrollStartXPos + ', scrollStartYPos: ' + scrollStartYPos);
                    //            //event.preventDefault();
                    //        }, false);

                    //        document.getElementById(id).addEventListener("touchmove", function (event) {
                    //            //      this.scrollLeft = scrollStartXPos - event.touches[0].pageX;
                    //            //      $(window).scrollTop(scrollStartYPos - event.touches[0].pageY);
                    //            //      console.log('*>> pageX: ' + event.touches[0].pageX + ' pageY: ' + event.touches[0].pageY + ', scrollLeft: ' + this.scrollLeft
                    //            //          + ', scrollStartXPos: ' + scrollStartXPos + ', scrollStartYPos: ' + scrollStartYPos);
                    //            event.preventDefault();
                    //        }, false);
                    //    }
                    //}

                    function init() {
                        var $this = scope.t_origin;
                        $this.wrap('<div id="touchElement" class="container eappt" />');
                        scope.$apply();
                        scope.t_origin_wrapper = $('.container.eappt');

                        cloneCreate();
                        resizeFixed();
                    }

                    scope.redrawTableColumnHeader = function () {
                        var $this = scope.t_origin;
                        var $container = scope.t_origin_wrapper;

                        var colHeader = $("table.fixed-col-head");
                        $container.find(colHeader).remove();

                        var $t_fixedColHead = $this.clone();
                        $t_fixedColHead.css('position', '');

                        $t_fixedColHead.find("thead").remove();
                        $t_fixedColHead.find("tbody tr>td:not(:first-child)").remove().end().addClass("fixed-col-head").insertAfter($this);
                        scope.t_fixedColHead = $t_fixedColHead;

                        //scope.$apply();
                       


                        var tableWrapperLeft = scope.t_origin_wrapper.offset().left;
                        $t_fixedColHead.css('left', tableWrapperLeft);
                        var offset = $(window).scrollTop() + 66,
                            tableOffsetTop = $this.offset().top;
                        $t_fixedColHead.css('top', tableOffsetTop - offset + 66 + 55);
                        //$t_fixedColHead.css('top',0);

                        $t_fixedColHead.on("click", "td",function () {
                            if (scope.$parent.block) {
                                var rowSlotId = $(this).attr('id');
                                rowSlotId = rowSlotId.substr(5);
                                addRowBlock(rowSlotId);
                                //alert(rowSlotId);
                            }

                        });
                      
                        scope.$apply();
                    }


                    function cloneCreate() {
                        var $this = scope.t_origin;
                        var $container = scope.t_origin_wrapper;

                        var fixedHeader = $("table.fixed");
                        $container.find(fixedHeader).remove();

                        var $t_fixed = $this.clone();
                        $t_fixed.find("tbody").remove().end().addClass("fixed").insertAfter($this);
                        scope.t_fixed = $t_fixed;


                        var $t_fixedColHead = $this.clone();
                        $t_fixedColHead.find("thead").remove();

                        $t_fixedColHead.find("tbody tr>td:not(:first-child)").remove().end().addClass("fixed-col-head").insertAfter($this);
                        scope.t_fixedColHead = $t_fixedColHead;


                        $this.css('position', 'relative');

                        scope.$apply();
                    }

                    function resizeFixed() {
                        //  $timeout(function () { 
                        //var $this = $this;
					    scope.t_origin = $('#eApptTable');
                        var $this = scope.t_origin;
                        var t_fixed = scope.t_fixed;
                        var $t_fixedColHead = scope.t_fixedColHead;
                        var tableLeft = scope.t_origin.offset().left;
                        var tableWrapperLeft = scope.t_origin_wrapper.offset().left;

                        var tableWidth = scope.t_origin.width();
                        t_fixed.css('width', tableWidth);
                        //cloneCreate();

                        var tableWrapperLeft = scope.t_origin_wrapper.offset().left;
                        $t_fixedColHead.css('left', tableWrapperLeft);
                        var offset = $(window).scrollTop() + 66,
                            tableOffsetTop = $this.offset().top;
                        $t_fixedColHead.css('top', tableOffsetTop - offset + 66 + 55);
                        scope.$apply();

                        //t_fixed.css('left', tableLeft);
                        //t_fixedColHead.css('left', tableWrapperLeft);
                        //scope.$apply();
                        //}, 0);

                    }

                    function myScrollEnd() {
                        scrollHorizontally();
                    }

                    scope.t_origin = $('#eApptTable');
                    init();
                    //touchScroll('touchElement');
                    $('#touchElement').dragScroll({});
                    var myScroll = new IScroll('#touchElement', { probeType: 3, eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false });
                    myScroll.on('scroll', myScrollEnd);
                    scope.myScroll = myScroll;

                    //$("eApptTable").on("click", "td", function () {
                    //    var rowSlotId = $(this).attr('id');
                    //    rowSlotId = rowSlotId.substr(5);
                    //    addRowBlock(rowSlotId);
                    //    alert('fixed clicked');

                    //});

                    //$("table").on("click", "td", function () {
                    //    var rowSlotId = $(this).attr('id');
                    //    rowSlotId = rowSlotId.substr(5);
                    //    addRowBlock(rowSlotId);

                    //});

                    //col block
                    $("table").on("click", "th", function () {
                        var colSlotId = $(this).attr('id');
                        colSlotId = colSlotId.substr(5);
                        addColumnBlock(colSlotId);

                    });
                    //col block


                    //vertical scrolling
                    function scrollVertically() {
					    scope.t_origin = $('#eApptTable');
                        var $this = scope.t_origin;
                        var $t_fixed = scope.t_fixed;
                        var $t_fixedColHead = scope.t_fixedColHead
                        var offset = $(window).scrollTop() + 66,
                            tableOffsetTop = $this.offset().top,
                            tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
                        //console.log('>> offset: ' + offset + ', tableOffsetTop: ' + tableOffsetTop + ', tableOffsetBottom: ' + tableOffsetBottom);
                        if (offset < tableOffsetTop || offset > tableOffsetBottom)
                            $t_fixed.hide();
                        else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $t_fixed.is(":hidden"))
                            $t_fixed.show();


                        $t_fixedColHead.css('top', tableOffsetTop - offset + 66 + 55);
                        //console.log('|||| offset: ' + offset + ', tableOffsetTop: ' + tableOffsetTop);
                        scope.$apply();
                    }

                    scrollVertically();
                    angular.element($window).bind("scroll", function () {
                        scrollVertically();
                    });

                    function scrollHorizontally() {
                        var $t_fixed = scope.t_fixed;
                        var offsetleft = scope.t_origin.offset().left;
                        console.log('== offsetleft: ' + offsetleft + ', t_fixed left: ' + scope.t_origin_wrapper.scrollLeft());
                        $t_fixed.css('left', (offsetleft - scope.t_origin.scrollLeft()));

                        //if (scope.t_origin_wrapper.scrollLeft() < 1)
                        //    scope.t_fixedColHead.hide();
                        //else
                        //    scope.t_fixedColHead.show();
                        var tableLeft = scope.t_origin_wrapper.offset().left;
                        scope.t_fixedColHead.css('left', tableLeft);
                        var tableOffsetTop = scope.t_origin.offset().top,
                            offset = $(window).scrollTop() + 66;
                        scope.t_fixedColHead.css('top', tableOffsetTop - offset + 66 + 55);
                    }

                    //horizontal scrolling
                    scope.t_origin_wrapper.on("scroll", function () {
                        scrollHorizontally();
                    });

                    angular.element($window).bind("resize", function () {
                        resizeFixed();
                    });
                }
            }, 500);

        //        })
        },
        restrict: "E",
        replace: true
    }

    
    }
    zd.$inject = injectParams;

    app.register.directive('scheduleGrid', zd);

});

