angular.module("zDir_DailyScheduleTask", [])
.directive("dailyScheduleTask", ['$compile', '$rootScope', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', '$location', 'socket', 'dataService',
function ($compile, $rootScope, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom,  $location, socket, dataService) {
        return {

           
            link: function (scope, element, attrs) { 


               
                scope.$watch("dt", function (newValue, oldValue) {
                    //scope.sdate = newValue;
                    scope.block =false;
                    element.empty();
                    $compile(element.contents())(scope);
                    generateGrid();
                    getWidth();
                    //resize();
                   
                });

                scope.$watch("block", function (newValue, oldValue) {
                    scope.block = newValue;
                });

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
                scope.columnHeader =[]; //scope.$eval(attrs.columnheader); //['Donald', 'Kumar', 'Lay Keow'];
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
                scope.c1customer = [{"custId":"C1","slot":"07:00","consultant":"5","appid":"1001"},{"custId":"C2","slot":"08:00","consultant":"6","appid":"1002"}];
                scope.blockslot = [];
                scope.consultanttotal=[];
                scope.slottotal = [];
                //scope.block = false;
                scope.generalslotsetting = [];
                scope.weekdayslotSetting = [];
                scope.preferslotSetting = [];

               
                var defer_row = null;
                var defer_general = null;
                var defer_weekday = null;
                var defer_prefer = null;
                var defer_blockslot = null;
                var defer_outlet = null;
                var defer_display= null;

                var daysOfWeek = new Array('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

                scope.NoofBeds = 0;
                scope.displayData = [];


                scope.DisplayFields = {
                    customerId: true,
                    customerName: true,
                    time: true,
                    consultantCapacity: true,
                    consultantTotalAppointment: true
                }

                scope.showCustome


                var _refreshData = function () {

                    defer_column = $q.defer();
                  
                    dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), {}).then(function (respcolumnHeader) {
                            scope.columnHeader = respcolumnHeader;
                            zSrv_OAuth2.storeInMemory('columnHeader', scope.columnHeader);
                            defer_column.resolve();
                        });

                    defer_general = $q.defer();
                  
                    dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrSettingUrl'), {}).then(function (resprowHeader) {
                            scope.generalslotsetting = resprowHeader;
                        
                            defer_general.resolve();
                        });

                        defer_weekday = $q.defer();
                    
                       
                        var weekday = daysOfWeek[new Date(scope.sdate).getDay()];

                        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), { "weekday": weekday }).then(function (resprowHeader) {
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
                            scope.blockslot= data;
                          
                            defer_blockslot.resolve();
                        });

                        defer_outlet = $q.defer();

                        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl') + "/" + scope.outlet).then(function (resprowHeader) {
                            scope.outletData = resprowHeader;

                            defer_outlet.resolve();
                        });


                        defer_display = $q.defer();

                        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrDisplaySettingUrl') , { "referId" :scope.outlet }).then(function (resprowHeader) {
                            scope.displayData = resprowHeader;

                            defer_display.resolve();
                        });

                }

                var getSlotSetting = function () {
                    if (scope.preferslotSetting.length >0)
                        return scope.preferslotSetting;

                    if (scope.preferslotSetting.length <=0 && scope.weekdayslotSetting.length > 0)
                        return scope.weekdayslotSetting;
                    else
                        return generalslotsetting;

                }

                var getAppointment = function(appid) {
                   // defer_getappt = $q.defer();
              

                        //dataService.httpGet(eApptAppointmentUrl + "/" + appid).then(function (data) {
                        //    scope.appt = data;

                        //    defer_getappt.resolve();
                    //});

                    dataService.getAppointment(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, "").then(function (data) {
                        scope.appt = data;
                    });
                    }


                var updateAppt = function (appid,consultant,slot,status) {

                    // getAppointment(appid);


                    //$q.all([defer_getappt.promise]).then(function () {

                    //    if (status != "WAIT")
                    //    {
                    //      scope.appt.AssignToConsultantId = consultant;
                    //    }

                    //    var bookon =scope.appt.BookOn;
                    //    var NewTime = new Date(bookon.getFullYear(), bookon.getMonth(), bookon.getDate());

                    //    var time = slot.split(":");
                    //    var hour= time[0];
                    //    var min = time[1];

                    //    NewTime.setHours(hour);
                    //    NewTime.setMinutes(min);
                    //    scope.appt.BookOn = NewTime;
                    //    scope.appt.Status = status;

                    //    defer_update = $q.defer();

                    //    zSrv_InputCustom.httpPut(eApptdailyapptUrl + "/" + appid, scope.appt).then(function (data) {
                    //        scope.gridData = data;

                    //        defer_update.resolve();
                    //    });
                    //});

                    dataService.getAppointment(zSrv_ResourceServer.getURL('eApptAppointmentUrl') + "/" + appid, "").then(function (data) {
                        scope.appt = data;

                        if (status != "WAIT") {
                            scope.appt.AssignToConsultantId = consultant;
                        }

                        var bookon = scope.appt.BookOn;
                        var NewTime = new Date(bookon.getFullYear(), bookon.getMonth(), bookon.getDate());

                        var time = slot.split(":");
                        var hour = time[0];
                        var min = time[1];

                        NewTime.setHours(hour);
                        NewTime.setMinutes(min);
                        scope.appt.BookOn = NewTime;
                        scope.appt.Status = status;

                        //defer_update = $q.defer();

                        dataService.changeAppointment(zSrv_ResourceServer.getURL('eApptdailyapptUrl') + "/" + appid, scope.appt).then(function (data) {
                            scope.gridData = data;

                            //defer_update.resolve();

                            socket.emit('eAppointment', {
                                outletid: scope.outlet,
                                consultantid: scope.consultantid,
                                date: scope.sdate,
                                type: 'ChangeAppointment',
                                message: 'Change Appointment'
                            });
                        });
                    });
                }

                var postBlockSlot = function (id,outlet,date, consultant, slot) {

                    defer_update = $q.defer();
                    var id = 1;
                    var BlockSlot = { "Id": id, "OutletId": outlet, "Date": date, "ConsultantId": consultant, "Slot": slot, "Status": "ACTIVE" };
                    zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), BlockSlot).then(function (data) {
                            //scope.gridData = data;

                            defer_update.resolve();
                        });
                    
                    
                }


                var putBlockSlot = function(id,blockSlot)
                {
                    defer_update = $q.defer();
                

                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('eApptBlockSlotUrl') + "/" + id, blockSlot).then(function (data) {
                            //scope.gridData = data;

                            defer_update.resolve();
                        });
                      
                    
                }

                var getApp = function(slot, consultant,interval,status)
                {
                    
                        var apps = [];
                        for (app in scope.gridData) {

                            var bookon = scope.gridData[app].BookOn;


                            var slotHours = bookon.getHours();
                            var slotMins = bookon.getMinutes();



                            var startTime = new Date(bookon.getFullYear(), bookon.getMonth(),bookon.getDate());
                            startTime.setHours(slot.substr(0, 2), slot.substr(3, 2), 0);

                            var stopTime = new Date(bookon.getFullYear(), bookon.getMonth(), bookon.getDate());

                            if (startTime.getMinutes() + interval >= 60) {
                                stopTime.setHours(startTime.getHours() + 1);
                                stopTime.setMinutes(0);
                            }
                            else
                            {
                                stopTime.setHours(startTime.getHours());
                                stopTime.setMinutes(startTime.getMinutes() + interval);
                            }
                            


                            if (slotHours.toString().length < 2) slotHours = "0" + slotHours;
                            if (slotMins.toString().length < 2) slotMins = "0" + slotMins;

                            var bookslot = slotHours + ":" + slotMins;


                            if (status == "CONFIRMED") {
                                if (scope.gridData[app].AssignToConsultantId == consultant && scope.gridData[app].BookOn >= startTime && scope.gridData[app].BookOn < stopTime && scope.gridData[app].Status != "WAIT") {


                                    apps.push({ custId: scope.gridData[app].CustomerId, slot: bookslot, consultant: consultant, appid: scope.gridData[app].Id });
                                }
                            }
                            else if(status=="WAIT")
                            {
                                if (scope.gridData[app].AssignToConsultantId == consultant &&  scope.gridData[app].BookOn >= startTime && scope.gridData[app].BookOn < stopTime && scope.gridData[app].Status == "WAIT") {


                                    apps.push({ custId: scope.gridData[app].CustomerId, slot: bookslot, consultant: scope.gridData[app].AssignToConsultantId, appid: scope.gridData[app].Id });
                                }
                            }

                          
                        }
                        if (apps.length > 0)
                            return apps;
                        else
                            return [];
                    
                };

                var getC1App = function(slot, consultant,interval)
                {
                    
                    var apps = [];
                    for (app in scope.c1customer) {

                        
                        if (scope.c1customer[app].slot == slot ) {
                            apps.push({ custId: scope.c1customer[app].custId, slot: scope.c1customer[app].slot, consultant: scope.c1customer[app].consultant, appid: scope.c1customer[app].appid});
                         }
                          
                    }
                    if (apps.length > 0)
                        return apps;
                    else
                        return [];
                    
                };

                var getBlockStatus = function (slot,consultant)
                {
                    var blockStatus = [];
                    for (app in scope.blockslot) {
                        if(scope.blockslot[app].Slot == slot  && scope.blockslot[app].ConsultantId== consultant)
                        {
                            var obj = scope.blockslot[app];
                            blockStatus.push(obj);
                        }
                        //if (scope.blockslot[app].Slot == slot && scope.blockslot[app].ConsultantId == consultant && scope.blockslot[app].Status == "INACTIVE") {
                        //    var obj = { id: scope.blockslot[app].Id, status: "INACTIVE" };
                        //    blockStatus.push(obj);
                        //}
                    }

                    if(blockStatus.length > 0)
                    {
                        return blockStatus;
                    }
                    else
                    {
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
                  
                }


                var setHeight = function ()
                {
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
                        else

                        {
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

                var getTableWidth = function()
                {
                    var cols = scope.columnHeader.length+1;
                    var TotalWidth = 0;
                  
                    $("#appTable tr:first").each(function () {
                        for (var i = 2; i <= cols ; i++) {
                            TotalWidth = TotalWidth + $(this).find("td").eq(i).width();
                        }

                       
                    });

                    return TotalWidth;
                }

                function stripFirstColumn() {
                    // pull out first column:
                    var nt = $('<table id="nameTable" cellpadding="3" cellspacing="0" style="width:100px;"></table>');
                    $('#appTable tr').each(function (i) {
                        nt.append('<tr><td style="color:' + $(this).children('td:first').css('color') + '">' + $(this).children('td:first').html() + '</td></tr>');
                    });
                    nt.appendTo('#nameTableSpan');
                    // remove original first column
                    $('#appTable tr').each(function (i) {
                        $(this).children('td:first').remove();
                    });
                    $('#nameTable td:first').css('background-color', '#8DB4B7');
                }

                function stripLastColumn() {
                    // pull out last column:
                    var nt = $('<table id="totalTable" cellpadding="3" cellspacing="0" style="width:70px;"></table>');
                    $('#appTable tr').each(function (i) {
                        nt.append('<tr><td style="color:' + $(this).children('td:last').css('color') + '">' + $(this).children('td:last').html() + '</td></tr>');
                    });
                    nt.appendTo('#totalTableSpan');
                    // remove original last column
                    $('#appTable tr').each(function (i) {
                        $(this).children('td:last').remove();
                    });
                    $('#totalTable td:first').css('background-color', '#8DB4B7');
                }

                function fixHeights() {
                    // change heights:
                    var curRow = 1;
                    $('#appTable tr').each(function (i) {
                        // get heights
                        var c1 = $('#nameTable tr:nth-child(' + curRow + ')').height();    // column 1
                        var c2 = $(this).height();    // column 2
                        var c3 = $('#totalTable tr:nth-child(' + curRow + ')').height();    // column 3
                        var maxHeight = Math.max(c1, Math.max(c2, c3));

                        //$('#log').append('Row '+curRow+' c1=' + c1 +' c2=' + c2 +' c3=' + c3 +'  max height = '+maxHeight+'<br/>');

                        // set heights
                        //$('#nameTable tr:nth-child('+curRow+')').height(maxHeight);
                        $('#nameTable tr:nth-child(' + curRow + ') td:first').height(maxHeight);
                        //$('#log').append('NameTable: '+$('#nameTable tr:nth-child('+curRow+')').height()+'<br/>');
                        //$(this).height(maxHeight);
                        $(this).children('td:first').height(maxHeight);
                        //$('#log').append('MainTable: '+$(this).height()+'<br/>');
                        //$('#totalTable tr:nth-child('+curRow+')').height(maxHeight);
                        $('#totalTable tr:nth-child(' + curRow + ') td:first').height(maxHeight);
                        //$('#log').append('TotalTable: '+$('#totalTable tr:nth-child('+curRow+')').height()+'<br/>');

                        curRow++;
                    });

                    if ($.browser.msie)
                        $('#ladderDiv').height($('#ladderDiv').height() + 18);
                }

                function getWidth() {
                    var tw = $("#appTable").css('width');
                    var sw = $("#wrap").css('width');
                }

                var generateGrid = function () {
                    scope.gridName = attrs.Name
                    scope.outlet = attrs.outletid;
                    scope.sdate = attrs.sdate;


                    _refreshData();
                    $q.all([defer_column.promise, defer_general.promise, defer_weekday.promise, defer_prefer.promose, defer_data.promise, defer_blockslot.promise, defer_outlet.promise]).then(function () {

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

                            var slotDisplay = slotBeginHours + slotBeginMins + "-" + slotEndHours + slotEndMins;
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
                            obj = { type: "colHeader", consultant: scope.columnHeader[j].Name, capacity: scope.columnHeader[j].Capacity };
                            scope.gridDataModel[0].push(obj);
                            scope.consultanttotal.push(0);
                        }

                        //obj = { type: "waitHeader", consultant: "Waitlist", capacity: 0 };
                        //scope.gridDataModel[0].push(obj);

                        obj = { type: "c1Header", consultant: "C1", capacity: 0 };
                        scope.gridDataModel[0].push(obj);

                        //obj = { type: "bedHeader", consultant: "Beds", capacity: 0 };
                        //scope.gridDataModel[0].push(obj);

                        //data
                        for (var i = 1; i <= rows; i++) {
                            scope.slottotal.push(0);
                            obj = { type: "rowHeader", slot: scope.rowHeaderData[i - 1], display: scope.rowHeaderDisplay[i - 1] };
                            scope.gridDataModel[i].push(obj);

                            for (var j = 0; j < cols; j++) {
                                var apps = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, "CONFIRMED");
                                var appwait = getApp(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id, interval, "WAIT");
                                var blocked = getBlockStatus(scope.rowHeaderData[i - 1], scope.columnHeader[j].Id);

                                var totalapps = 0;
                                if (apps != null || apps != undefined) totalapps = apps.length;
                                var totalwait = 0;
                                if (appwait != null || appwait != undefined) totalwait = appwait.length;

                                //if (apps != undefined)
                                obj = { type: 'data', slot: scope.rowHeaderData[i - 1], consultant: scope.columnHeader[j].Id, appt: apps, total: totalapps, block: blocked ,wait:appwait,totalwait:totalwait};
                                //else
                                //obj = {type: 'data',}
                                scope.gridDataModel[i].push(obj);
                            }

                            //waitlist
                            //var appswait = getApp(scope.rowHeaderData[i - 1], "", interval, "WAIT");
                            //var totalapps = 0;
                            //if (appswait != null || appswait != undefined) totalapps = appswait.length;
                            //obj = { type: 'dataWait', slot: scope.rowHeaderData[i - 1], appt: appswait, total: totalapps };
                            //scope.gridDataModel[i].push(obj);

                            //c1customers
                            var appsc1 = getC1App(scope.rowHeaderData[i - 1], "", interval);
                            var totalC1apps = 0;
                            if (appsc1 != null || appsc1 != undefined) totalC1apps = appsc1.length;
                            obj = { type: 'dataC1', slot: scope.rowHeaderData[i - 1], appt: appsc1, total: totalC1apps };
                            scope.gridDataModel[i].push(obj);




                        }



                        //generate grid Model

                        cols = cols + 1; //for waitlist,c1customer

                        var divScroll = angular.element("<div id='wrap' class='wrapper'>");
                        //divScroll.attr("width", "500px");
                        //divScroll.attr("overflow-x", "scroll");
                        //divScroll.attr("overflow-y", "visible");

                        var tableElem = angular.element("<table id='appTable' >");
                        tableElem.attr('border', '1');
                        tableElem.attr('bordercolor', 'black');
                        tableElem.attr('background', 'Templates/images/bg-black.jpg');

                        for (var row = 0; row <= rows; row++) {
                            var rowElem = angular.element("<tr>");
                            rowElem.attr('background', 'red');
                            for (var col = 0; col <= cols; col++) {
                                console.log(scope.gridDataModel[row][col].type);
                                if (scope.gridDataModel[row][col].type == "empty") {
                                    var cell = angular.element("<th  class='first'>").attr("Id", row + "-" + col).html('<div>TIME </br>(24hrs)</div>');
                                    rowElem.append(cell);
                                }
                                else if (scope.gridDataModel[row][col].type == "colHeader") {
                                    var consultcolumn = col - 1;
                                    //var colHeader = angular.element("<td>").attr("Id", "cons" + "-" + col).html('<div><input type="text" ng-model="gridDataModel[' + row + '][' + col + '].consultant" + /></br>Capacity:' + scope.gridDataModel[row][col].capacity + ' Total:{{consultanttotal[' + consultcolumn + ']}}</div>');
                                    var colHeader = angular.element("<th>").attr("Id", "cons" + "-" + col).html('<div class="tt-consultid">' + scope.gridDataModel[row][col].consultant + '</div><div  ><div class="capacity" ng-show="DisplayFields.consultantCapacity">' + scope.gridDataModel[row][col].capacity + '</div><div class="totalappointment" ng-show="DisplayFields.consultantTotalAppointment">{{consultanttotal[' + consultcolumn + ']}}</div></div>');
                                    //colHeader.attr('ng-click', '!block || addColumnBlock($event)');
                                    colHeader.attr('ng-click', 'block ||  showConsultant($event)');
                                    rowElem.append(colHeader);
                                }
                                //else if (scope.gridDataModel[row][col].type == "waitHeader") {
                                //    var colHeader = angular.element("<th>").attr("Id", row + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</br>(' + scope.gridDataModel[row][col].capacity + ')</div>');

                                //    rowElem.append(colHeader);
                                //}

                                else if (scope.gridDataModel[row][col].type == "c1Header") {
                                    var colHeader = angular.element("<th class='last'>").attr("Id", row + "-" + col).html('<div>' + scope.gridDataModel[row][col].consultant + '</div>');

                                    rowElem.append(colHeader);
                                }
                                else if (scope.gridDataModel[row][col].type == "rowHeader") {
                                    var slotrow = row - 1;
                                    //var rowHeader = angular.element("<td class='first'>").attr("Id", "slot" + "-" + row).html('<div>' + scope.gridDataModel[row][col].slot + '</br>({{slottotal[' + slotrow + ']}})</div>').html('<p class="bed-quantity">8</p><img src="Templates/images/bed.png" width="70" height="49" class="bed" alt=""/>');
                                    var rowHeader = angular.element("<td class='first'>").attr("Id", "slot" + "-" + row).html('<div>' + scope.gridDataModel[row][col].display + '<p class="bed-quantity">{{slottotal[' + slotrow + ']}}</p><img src="Templates/images/bed.png" width="70" height="49" class="bed" alt=""/>');
                                    rowHeader.attr('ng-click', '!block || addRowBlock($event)');
                                    rowElem.append(rowHeader);
                                }
                                else if (scope.gridDataModel[row][col].type == "data") {

                                    var apps = scope.gridDataModel[row][col].appt;
                                    if (apps != undefined) {

                                        var mainDiv = angular.element("<div class='outerDiv'>");
                                        mainDiv.attr("Id", "DIV-" + row + "-" + col);

                                        var divElem = angular.element("<div class='appDiv' >");

                                        divElem.attr("Id", "APP-DIV-" + row + "-" + col);
                                        divElem.attr('ng-drop', 'true');
                                        divElem.attr('ng-drop-success', 'onDropComplete($data,$event)');

                                        var ulElem = angular.element("<ul>");
                                        ulElem.attr("Id", "APP-UL-" + row + "-" + col);


                                        var tdid = "APP-LI-" + row + "-" + col;
                                        for (app in scope.gridDataModel[row][col].appt) {
                                            var id = scope.gridDataModel[row][col].appt[app].appid;
                                            liElem = angular.element("<li>");
                                            liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            liElem.attr('draggable', 'true');
                                            liElem.attr('ng-drag', 'true');
                                            liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                            liElem.attr('ng-center-anchor', 'true');
                                            liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].slot}}</span>');
                                            liElem.attr("Id", id);
                                            liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                            ulElem.append(liElem);

                                        }
                                        divElem.append(ulElem);
                                        mainDiv.append(divElem);

                                        var tdElem = angular.element("<td>");



                                        tdElem.attr("Id", row + "-" + col);
                                        //tdElem.attr('ng-drop', 'true');
                                        //tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                       
                                        //tdElem.append(divElem);

                                        var id = "img" + row + "-" + col;
                                        if (scope.gridDataModel[row][col].block.length) {
                                            if (scope.gridDataModel[row][col].block[0].Id != null && scope.gridDataModel[row][col].block[0].Status == "ACTIVE") {
                                                tdElem.append('<center><img id=' + id + ' src="block.png"></center>');
                                            }
                                        }

                                        tdElem.attr('ng-click', '!block || addBlock($event)');


                                        //add waitlist

                                        var divElem = angular.element("<div class='waitlist wlDiv'>");
                                        divElem.attr("Id", "WL-DIV-" + row + "-" + col);
                                        divElem.attr('ng-drop', 'true');
                                        divElem.attr('ng-drop-success', 'onDropComplete($data,$event)');

                                        var ulElem = angular.element("<ul>");
                                        ulElem.attr("Id", "WL-UL-" + row + "-" + col);

                                        var tdid = "WL-LI-"  + row + "-" + col;
                                        for (app in scope.gridDataModel[row][col].wait) {
                                            var id = scope.gridDataModel[row][col].wait[app].appid;
                                            liElem = angular.element("<li>");
                                            liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            liElem.attr('draggable', 'true');
                                            liElem.attr('ng-drag', 'true');
                                            liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                            liElem.attr('ng-center-anchor', 'true');
                                            liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + row + '][' + col + '].wait[' + app + '].slot}}</span>');
                                            liElem.attr("Id", id);
                                            liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                            ulElem.append(liElem);

                                        }
                                        divElem.append(ulElem);

                                        mainDiv.append(divElem);

                                        tdElem.append(mainDiv);

                                        //waitlist


                                        rowElem.append(tdElem);


                                    }

                                    else {

                                        var tdElem = angular.element("<td>");

                                        var mainDiv = angular.element("<div class='outerDiv'>");

                                        var divElem = angular.element("<div class='appDiv'>");
                                        var ulElem = angular.element("<ul>");

                                        divElem.append(ulElem);
                                        mainDiv.append(divElem);

                                        //tdElem.append(divElem);

                                        var divElem = angular.element("<div class='wlDiv'>");
                                        var ulElem = angular.element("<ul>");

                                        divElem.append(ulElem);
                                        mainDiv.append(divElem);

                                        tdElem.append(divElem);
                                       

                                        

                                        tdElem.attr("Id", row + "-" + col);
                                        tdElem.attr('ng-drop', 'true');
                                        //tdElem.attr('ng-drag-move', 'onDragMove($data,$event)')
                                        //tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                        //tdElem.append(divElem);

                                        tdElem.attr('ng-click', '!block || addBlock($event)');

                                        var id = "img" + row + "-" + col;
                                        if (scope.gridDataModel[row][col].block.length) {
                                            if (scope.gridDataModel[row][col].block[0].Id != null && scope.gridDataModel[row][col].block[0].Status == "ACTIVE") {
                                                tdElem.append('<center><img id=' + id + ' src="block.png"></center>');
                                            }
                                        }

                                        rowElem.append(tdElem);
                                    }
                                }

                                //else if (scope.gridDataModel[row][col].type == "dataWait") {

                                //    var apps = scope.gridDataModel[row][col].appt;
                                //    if (apps != undefined) {
                                //        var divElem = angular.element("<div>");
                                //        var ulElem = angular.element("<ul>");

                                //        var tdid = row + "-" + col;
                                //        for (app in scope.gridDataModel[row][col].appt) {
                                //            var id = scope.gridDataModel[row][col].appt[app].appid;
                                //            liElem = angular.element("<li>");
                                //            liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                //            liElem.attr('draggable', 'true');
                                //            liElem.attr('ng-drag', 'true');
                                //            liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                //            liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                //            liElem.attr('ng-center-anchor', 'true');
                                //            liElem.text('CustId:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].slot}}');
                                //            liElem.attr("Id", id);
                                //            liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                //            ulElem.append(liElem);

                                //        }
                                //        divElem.append(ulElem);


                                //        var tdElem = angular.element("<td>");
                                //        //tdElem.attr('border-color', 'yellow');
                                //        //tdElem.attr('border-width', '5px');
                                //        //tdElem.attr('border-style', 'solid');


                                //        tdElem.attr("Id", row + "-" + col);
                                //        tdElem.attr('ng-drop', 'true');
                                //        //tdElem.attr('ng-drag-move', 'onDragMove($data,$event)')
                                //        tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                //        tdElem.append(divElem);

                                //       // rowElem.append(tdElem);


                                //    }

                                //}
                                else if (scope.gridDataModel[row][col].type == "dataC1") {

                                    var apps = scope.gridDataModel[row][col].appt;
                                    if (apps != undefined) {
                                        var divElem = angular.element("<div>");
                                        var ulElem = angular.element("<ul>");

                                        var tdid = row + "-" + col;
                                        for (app in scope.gridDataModel[row][col].appt) {
                                            var id = scope.gridDataModel[row][col].appt[app].appid;
                                            liElem = angular.element("<li>");
                                            liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + tdid + '"}');
                                            //liElem.attr('draggable', 'true');
                                            //liElem.attr('ng-drag', 'true');
                                            //liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                            //liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                            //liElem.attr('ng-center-anchor', 'true');
                                            liElem.text('CustId:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + row + '][' + col + '].appt[' + app + '].slot}}');


                                            liElem.attr("Id", id);
                                            //liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                            ulElem.append(liElem);

                                        }
                                        divElem.append(ulElem);


                                        var tdElem = angular.element("<td class='last'>");
                                        //tdElem.attr('border-color', 'yellow');
                                        //tdElem.attr('border-width', '5px');
                                        //tdElem.attr('border-style', 'solid');


                                        tdElem.attr("Id", row + "-" + col);
                                        //tdElem.attr('ng-drop', 'true');
                                        //tdElem.attr('ng-drag-move', 'onDragMove($data,$event)')
                                        //tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                        //tdElem.append(divElem);

                                        divElem.text(apps.length);
                                        tdElem.append(divElem);
                                        //tdElem.text(apps.length);
                                        rowElem.append(tdElem);


                                    }
                                    else {
                                        var divElem = angular.element("<div>");
                                        var ulElem = angular.element("<ul>");

                                        //divElem.append(ulElem);
                                        divElem.text("0");

                                        var tdElem = angular.element("<td class='last'>");
                                        //tdElem.attr('border-color', 'yellow');
                                        //tdElem.attr('border-width', '5px');
                                        //tdElem.attr('border-style', 'solid');


                                        tdElem.attr("Id", row + "-" + col);
                                        tdElem.attr('ng-drop', 'true');
                                        //tdElem.attr('ng-drag-move', 'onDragMove($data,$event)')
                                        tdElem.attr('ng-drop-success', 'onDropComplete($data,$event)');
                                        tdElem.append(divElem);
                                        rowElem.append(tdElem);
                                    }
                                }

                            }
                            tableElem.append(rowElem);
                        }

                        divScroll.append(tableElem);
                        element.append(divScroll);
                        // element.append(tableElem);

                        //getConsultantTotal();
                        //getSlotTotal();

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

                        var ow = $('#wrap').width(); //get(0).offsetWidth;
                        TotalWidth = $('#appTable').width() - 160;

                        if (TotalWidth < ow) {

                            $('#wrap').width($('#appTable').width() - 160);
                            console.log("appTable Width : " + $('#appTable').width());
                            //$('#appTable').width(TotalWidth);
                        }

                        // resize();



                        // refreshAvailable();
                        // $rootScope.$emit('go');
                        //$timeout(scope.$eval(attrs.afterRender), 0)
                    });



                }

                var appendAppointment = function (tocellId, appid, fromcellId,totype) {
                    
                    if (fromcellId == tocellId)
                        return;
                    var toCell = tocellId.split("-");
                    var toRow = toCell[0];
                    var toCol = toCell[1];

                    var fromCell = fromcellId.split("-");
                    var fromRow = fromCell[2];
                    var fromCol = fromCell[3];

                    if (fromCell[0] == "APP")
                        var fromtype = "appointment";
                    else
                        var fromtype = "waitinglist";


                    if (totype == "appointment") {

                        var liid = "APP-LI-" + toRow + "-" + toCol;
                        var ulid = "APP-UL-" + toRow + "-" + toCol;
                        var divid = "APP-DIV-" + toRow + "-" + toCol;
                    }
                    else {
                        var liid = "WL-LI-" + toRow + "-" + toCol;
                        var ulid = "WL-UL-" + toRow + "-" + toCol;
                        var divid = "WL-DIV-" + toRow + "-" + toCol;
                    }


                    if (fromtype == "appointment") {
                        for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                            if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {


                                var newslot = scope.gridDataModel[toRow][toCol].slot;
                                var custid = scope.gridDataModel[fromRow][fromCol].appt[app].custId;
                                var obj = scope.gridDataModel[fromRow][fromCol].appt[app];
                                obj.slot = newslot; //change time after move as slot time
                                obj.custid = custid

                                if (totype == "appointment") {
                                    var total = scope.gridDataModel[toRow][toCol].total;
                                    total = total + 1;
                                    scope.gridDataModel[toRow][toCol].total = total;
                                    scope.gridDataModel[toRow][toCol].appt.push(obj);
                                }
                                else {
                                    scope.gridDataModel[toRow][toCol].wait.push(obj);
                                }



                               


                                var id = appid;


                                if (totype == "appointment") {
                                    var pushIndex = scope.gridDataModel[toRow][toCol].appt.length - 1;
                                }
                                else
                                {
                                    var pushIndex = scope.gridDataModel[toRow][toCol].wait.length - 1;
                                }

                                var liElem = angular.element("<li>");
                                liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + liid + '"}');
                                liElem.attr('draggable', 'true');
                                liElem.attr('ng-drag', 'true');
                                liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                liElem.attr('ng-center-anchor', 'true');
                                //liElem.html('<p class="bg-custid" >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].custId}},Time:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].slot}}</p>');

                                if (totype == "appointment") {
                                    liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].slot}}</span>');
                                }
                                else
                                {
                                    liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].wait[' + pushIndex + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + toRow + '][' + toCol + '].wait[' + pushIndex + '].slot}}</span>');
                                }

                                liElem.attr("Id", appid);
                                liElem.attr('onClick', 'editAppointment(' + id + ')');
                                //var tdElem = angular.element(document.querySelector('#tdid'));
                                var ele = "#" + toRow + "-" + toCol;

                                var tdElem = angular.element(ele);
                                //var ulElem = tdElem.find("ul");
                                var ulElem = angular.element(document.querySelector('#' + ulid));
                                //var divElem = angular.element(divid);

                                //var ulElem = angular.element(ulid);

                                ulElem.append(liElem);


                                $compile(element.contents())(scope);

                                console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);

                                socket.emit('add appointment', {
                                    message: 'message send'
                                });

                            }

                        }
                    }
                    else {
                        for (app in scope.gridDataModel[fromRow][fromCol].wait) {
                            if (scope.gridDataModel[fromRow][fromCol].wait[app].appid == appid) {


                                var newslot = scope.gridDataModel[toRow][toCol].slot;
                                var custid = scope.gridDataModel[fromRow][fromCol].wait[app].custId;
                                var obj = scope.gridDataModel[fromRow][fromCol].wait[app];
                                obj.slot = newslot; //change time after move as slot time
                                obj.custid = custid

                                if (totype == "appointment") {
                                    var total = scope.gridDataModel[toRow][toCol].total;
                                    total = total + 1;
                                    scope.gridDataModel[toRow][toCol].total = total;
                                    scope.gridDataModel[toRow][toCol].appt.push(obj);
                                }
                                else {
                                    scope.gridDataModel[toRow][toCol].wait.push(obj);
                                }






                                var id = appid;


                                if (totype == "appointment") {
                                    var pushIndex = scope.gridDataModel[toRow][toCol].appt.length - 1;
                                }
                                else {
                                    var pushIndex = scope.gridDataModel[toRow][toCol].wait.length - 1;
                                }

                                var liElem = angular.element("<li>");
                                liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + liid + '"}');
                                liElem.attr('draggable', 'true');
                                liElem.attr('ng-drag', 'true');
                                liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                liElem.attr('ng-center-anchor', 'true');
                                //liElem.html('<p class="bg-custid" >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].custId}},Time:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].slot}}</p>');

                                if (totype == "appointment") {
                                    liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + toRow + '][' + toCol + '].appt[' + pushIndex + '].slot}}</span>');
                                }
                                else {
                                    liElem.html('<span ng-show="DisplayFields.customerId" class="bg-custid " >CustId:{{gridDataModel[' + toRow + '][' + toCol + '].wait[' + pushIndex + '].custId}}</span> <span  ng-show="DisplayFields.time" class="bg-custid ">Time:{{gridDataModel[' + toRow + '][' + toCol + '].wait[' + pushIndex + '].slot}}</span>');
                                }

                                liElem.attr("Id", appid);
                                liElem.attr('onClick', 'editAppointment(' + id + ')');
                                //var tdElem = angular.element(document.querySelector('#tdid'));
                                var ele = "#" + toRow + "-" + toCol;

                                var tdElem = angular.element(ele);
                                //var ulElem = tdElem.find("ul");
                                var ulElem = angular.element(document.querySelector('#' + ulid));
                                //var divElem = angular.element(divid);

                                //var ulElem = angular.element(ulid);

                                ulElem.append(liElem);


                                $compile(element.contents())(scope);

                                console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);

                                socket.emit('add appointment', {
                                    message: 'message send'
                                });

                            }

                        }
                    }

                    setHeight();
                };

                var removeAppointment = function (tocellId, appid, fromcellId,type) {
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

                    if (type == "appointment") {

                        var liid = "APP-LI-" + fromRow + "-" + fromCol;
                        var ulid = "APP-UL-" + fromRow + "-" + fromCol;
                        var divid = "APP-DIV-" + fromRow + "-" + fromCol;
                    }
                    else {
                        var liid = "WL-LI-" + fromRow + "-" + fromCol;
                        var ulid = "WL-UL-" + fromRow + "-" + fromCol;
                        var divid = "WL-DIV-" + fromRow + "-" + fromCol;
                    }

                   
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

                  
                    if (fromtype == "appointment") {
                        for (app in scope.gridDataModel[fromRow][fromCol].appt) {
                            if (scope.gridDataModel[fromRow][fromCol].appt[app].appid == appid) {

                                scope.gridDataModel[fromRow][fromCol].appt.splice(app, 1);
                                var appt = scope.gridDataModel[fromRow][fromCol].appt;

                                scope.gridDataModel[fromRow][fromCol].total = appt.length;
                                console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);
                            }
                        }
                    }
                    else {
                        for (app in scope.gridDataModel[fromRow][fromCol].wait) {
                            if (scope.gridDataModel[fromRow][fromCol].wait[app].appid == appid) {

                                scope.gridDataModel[fromRow][fromCol].wait.splice(app, 1);
                                var appt = scope.gridDataModel[fromRow][fromCol].wait;

                                //scope.gridDataModel[fromRow][fromCol].total = appt.length;
                                console.log("appointment Changed:" + fromcellId + " " + appid + " " + tocellId);
                            }
                        }
                    }

                    $compile(element.contents())(scope);

                   refreshCell(fromcellId,type);
                    setHeight();
                   
                };

                var refreshCell = function (refreshCellId,type) {

                    var refreshCell = refreshCellId.split("-");
                    var refreshRow = refreshCell[2];
                    var refreshCol = refreshCell[3];

                    var ele = "#" + refreshRow + "-" + refreshCol;
                            
                    var tdElem = angular.element(ele);

                    if (type == "appointment") {

                        var eleAppDiv = "#APP-DIV-" + row + "-" + col;
                        var eleAppUl = "#APP-UL-" + row + "-" + col;

                        var divElem = tdElem.find(eleAppDiv);
                        var ulElem = tdElem.find(eleAppUl);
                    }
                    else
                    {
                        var eleWlDiv = "#WL-DIV-" + row + "-" + col;
                        var eleWlUl = "#WL-UL-" + row + "-" + col;

                        var divElem = tdElem.find(eleAppDiv);
                        var ulElem = tdElem.find(eleAppUl);
                    }
                    


                    divElem.append(ulElem);

                    if (type == "appointment") {
                        var apps = scope.gridDataModel[refreshRow][refreshCol].appt;
                        if (apps != undefined) {



                            for (app in scope.gridDataModel[refreshRow][refreshCol].appt) {
                                var id = scope.gridDataModel[refreshRow][refreshCol].appt[app].appid;
                                liElem = angular.element("<li>");
                                liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + refreshCellId + '"}');
                                liElem.attr('draggable', 'true');
                                liElem.attr('ng-drag', 'true');
                                liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                liElem.attr('ng-center-anchor', 'true');
                                liElem.text('CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].slot}}');
                                liElem.attr("Id", id);
                                liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                ulElem.append(liElem);

                            }
                            $compile(element.contents())(scope);
                        }
                    }
                    else {
                        var apps = scope.gridDataModel[refreshRow][refreshCol].wait;
                        if (apps != undefined) {



                            for (app in scope.gridDataModel[refreshRow][refreshCol].wait) {
                                var id = scope.gridDataModel[refreshRow][refreshCol].wait[app].appid;
                                liElem = angular.element("<li>");
                                liElem.attr('ng-drag-data', '{appid:' + id + ',cellid:"' + refreshCellId + '"}');
                                liElem.attr('draggable', 'true');
                                liElem.attr('ng-drag', 'true');
                                liElem.attr('ng-drag-start', 'onDragStart($data, $event)');
                                liElem.attr('ng-drag-stop', 'onDragStop($data, $event)');
                                liElem.attr('ng-center-anchor', 'true');
                                liElem.text('CustId:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].appt[' + app + '].custId}},Time:{{gridDataModel[' + refreshRow + '][' + refreshCol + '].wait[' + app + '].slot}}');
                                liElem.attr("Id", id);
                                liElem.attr('ng-click', '!block || editAppointment(' + id + ')');
                                ulElem.append(liElem);

                            }
                            $compile(element.contents())(scope);
                        }
                    }
                                       
                }

                refreshAvailable = function()
                {
                    var rows = scope.rowHeaderData.length;
                    var cols = scope.columnHeader.length;
                  

                
                        for (row = 1; row <= rows ; row++) {
                            for (col = 1; col <= cols ; col++) {
                                var capacity = scope.gridDataModel[0][col].capacity;
                                var total = scope.gridDataModel[row][col].total;
                                var ele = "#" + row + "-" + col;
                                var currentElement = angular.element(ele);
                                if(capacity == total)
                                {
                                  
                                    //currentElement.attr('bgcolor', 'lightgrey')
                                   
                                }
                                else
                                {
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
                        var consultanttotal =0;
                        for (row = 1; row <= rows ; row++) {
                          
                            var total = scope.gridDataModel[row][col].total;
                            consultanttotal+= total;

                        }
                        scope.consultanttotal[col-1]=consultanttotal;
                        }
                    }

                getSlotTotal = function () {
                    var rows = scope.rowHeaderData.length;
                    var cols = scope.columnHeader.length;

                    for (row = 1; row <= rows ; row++) {
                        var slottotal = 0;
                     for (col = 1; col <= cols ; col++) {
                      
                        

                            var total = scope.gridDataModel[row][col].total;
                            slottotal += total;

                        }
                        scope.slottotal[row-1] = slottotal
                    }
                }


                editAppointment = function (id)
                {
                    console.log('/editAppointment' + "/" + id);
                    $location.path('/editAppointment' + "/" + id);
                }


                scope.showConsultant = function(event)
                {
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
                scope.addBlock = function(event)
                {
                    ele = "#" + event.currentTarget.id;
                    var currentElement = angular.element(ele);

                    var cell = event.currentTarget.id;
                    var Cell = cell.split("-");
                    var row = Cell[0];
                    var col = Cell[1];


                    if (scope.gridDataModel[row][col].total > 0)
                        return;
                    
                    var imgid = "#img" + row + "-" + col;
                    var imgElem = currentElement.find(imgid)
                    if (imgElem.length)
                    {
                        imgElem.remove();
                        scope.gridDataModel[row][col].block[0].Status = "INACTIVE";
                    }
                    else {
                        var id = "img" + event.target.id;
                        currentElement.append('<center><img id=' + id + ' src="block.png"></center>');
                        scope.gridDataModel[row][col].block[0].Status = "ACTIVE";
                    }
                }
                
                scope.addRowBlock = function (event) {
                    var cell = event.currentTarget.id;
                    var Cell = cell.split("-");
                    var row = Cell[1];
                    var cols = scope.columnHeader.length;
                    for (col = 1; col <= cols ; col++) {

                        if (scope.gridDataModel[row][col].total > 0)
                            continue;

                        var ele = "#" + row + "-" + col;
                        var currentElement = angular.element(ele);
                        var imgid = "#img" + row + "-" + col;
                        var imgElem = currentElement.find(imgid)
                        if (imgElem.length)
                        {
                            //imgElem.remove();
                        }
                        else {
                            var id = "img" + row + "-" + col;
                            currentElement.append('<center><img id=' + id + ' src="block.png"></center>');
                        }
                    }
                   
                   
                }

                scope.addColumnBlock = function (event) {
                    var cell = event.currentTarget.id;
                    var Cell = cell.split("-");
                    var col = Cell[1];

                    var rows = scope.rowHeaderData.length;
                    for (row = 1; row <= rows ; row++) {
                        if (scope.gridDataModel[row][col].total > 0)
                            continue;

                        var ele = "#" + row + "-" + col;
                        var currentElement = angular.element(ele);
                        var imgid = "#img" + row + "-" + col;
                        var imgElem = currentElement.find(imgid)
                        if (imgElem.length) {
                            // imgElem.remove();
                        }
                        else {
                            var id = "img" + row + "-" + col;
                            currentElement.append('<center><img id=' + id + ' src="block.png"></center>');
                        }
                    }
                   
                }
                scope.saveBlockOLD = function()
                {
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
                                var id =null;
                                if (scope.gridDataModel[row][col].block.length) {
                                    id = scope.gridDataModel[row][col].block[0].Id;
                                }

                                if (id != null)
                                {
                                    putBlockSlot(id, scope.gridDataModel[row][col].block[0]);
                                }
                                else
                                {
                                    postBlockSlot(id,scope.outlet,scope.sdate, consultant, slot) ;
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

                                    if(scope.gridDataModel[row][col].block[0].Status =="ACTIVE")
                                    {
                                        postBlockSlot(id, scope.outlet, scope.sdate, consultant, slot);
                                    }
                                }

                            }
                        }
                    }
                

              

                scope.onDragStop = function (data, event) {

                    if (scope.block) return;

                    var cell = data.cellid;
                    var Cell = cell.split("-");
                    var type = Cell[0];
                    var element = Cell[1];
                    var fromRow = Cell[2];
                    var fromCol = Cell[3];



                    var clientX = event.pageX;
                    var clientY = event.pageY;

                 
                    var rows = scope.rowHeaderData.length;
                    var cols = scope.columnHeader.length;
                    cols++;

                    findid:
                    for (row = 1; row <= rows ; row++)
                    {
                        for(col=1;col < cols ; col++)
                        {
                            var ele = "#" + row + "-" + col;

                            var currentElement = angular.element(ele);

                            var lefttop = currentElement.offset();
                            var left = lefttop.left;
                            var top = lefttop.top;
                            var right = lefttop.left + currentElement[0].offsetWidth;
                            var bottom = lefttop.top + currentElement[0].offsetHeight;


                            var eleApp = "#APP-DIV-" + row + "-" + col;

                            var currentAppElement = angular.element(eleApp);

                            var appOffset = currentAppElement.offset();
                            var appleft = appOffset.left;
                            var apptop = appOffset.top;
                            var appright = appOffset.left + currentAppElement[0].offsetWidth;
                            var appbottom = appOffset.top + currentAppElement[0].offsetHeight;

                              
                            var eleWl = "#WL-DIV-" + row + "-" + col;

                            var currentWlElement = angular.element(eleWl);

                            var wlOffset = currentAppElement.offset();
                            var wlleft = wlOffset.left;
                            var wltop = wlOffset.top;
                            var wlright = wlOffset.left + currentWlElement[0].offsetWidth;
                            var wlbottom = wlOffset.top + currentWlElement[0].offsetHeight;



                                if (row == rows)
                                {
                                    var top1 = 0;
                                }
                                if (clientX >= left && clientY >= top && clientX <= right && clientY <= bottom) {
                                    var destcellId = row + "-" + col;
                                    console.log("Stop at :" + destcellId);

                                    var type;
                                    if (clientY <= appbottom) {
                                        type = "appointment";
                                    }
                                    else
                                    {
                                        type = "waitinglist";
                                    }

                                    if (data != null) {

                                        var capacity = scope.gridDataModel[0][col].capacity;
                                        var total = scope.gridDataModel[row][col].total;
                                        if (total < capacity || capacity == 0) {

                                            var slottotal = scope.slottotal[row - 1];

                                            if (fromRow != row) {
                                                slottotal++;
                                            }

                                            if (slottotal <= scope.NoofBeds) {
                                                appendAppointment(destcellId, data.appid, data.cellid,type);
                                                removeAppointment(destcellId, data.appid, data.cellid,type);
                                                var consultant = scope.gridDataModel[row][col].consultant;
                                                var slot = scope.gridDataModel[row][col].slot;


                                                //var d = new Date();
                                                //var year = d.getFullYear();
                                                //var month = d.getMonth();
                                                //var day = d.getDate();

                                                //var currDate = year + month + day;

                                                scope.consultantid = $rootScope.consultantId;

                                                var type = scope.gridDataModel[row][col].type;
                                                if (type == "dataWait") {
                                                    var consultant = "";
                                                    updateAppt(data.appid, consultant, slot, "WAIT");

                                                  
                                                   
                                                }
                                                else {
                                                    var consultant = scope.gridDataModel[row][col].consultant;
                                                    updateAppt(data.appid, consultant, slot, "CON");

                                                   
                                                }
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
                
                resize();
            },
            restrict: "E",
            replace: true
        }
    }])

.directive("sCell",  function() {
    return {

        scope: {
            appt: '='
        },

        template: '<td><ul><li ng-repeat="app in appt">{{app.customer}} {{app.ApTime}} </br></li></ul></td>'

       };
})
.directive("dailyScheduleColCell", function () {
    return {

       
        scope: {
            columns: '='
        },

        //template: '<td ng-repeat="col in columns">heading</td>'
        template: '<td ng-repeat="col in columns"><span><input type="text" ng-model="col.Name"/></span></td>'

      
    };
})

.directive("sRowHeaderCell", function () {
    return {

        scope: {
            value: '@'
        },

        template: '<td>{{value}}</td>'

    };
});


