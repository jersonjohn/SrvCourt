angular.module("zSrv_MasterData", [])
.factory('zSrv_MasterData', ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'dataService', '$rootScope',function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer, dataService,$rootScope) {




    var defer_consultants = null;
    var defer_generalslotsetting = null;
    var defer_weekdayslotsetting = null;
    var defer_preferredslotsetting = null;
    var defer_displaysetting = null;
    var defer_region = null;
    var defer_holiday = null;
    var defer_outletsetting = null;

    var defer_outlets = null;
    var defer_brandsetting = null;
    var defer_remindertype = null;
    var defer_vipcategory = null;

    var defer_dailyappt = null;
    var defer_blockslot = null;
    var defer_c1appt = null;

    var defer_login = null;
    var defer_outletdata = null;

    var dataServiceFactory = {};

    
    var loginData =  {};
    var masterData =  {};
    var apptData = {};

    var brandId = null;
    var outletId = null;
    
    var daysOfWeek = new Array('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');
   


    var _loadApptDatas = function loadApptDatas(date,brandId,outletId,outletName) {

        defer_dailyappt = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptDailyApptUrl'), { "sdate": date, "outletid": outletId }).then(function (respDailyAppt) {
            apptData.Appointments = respDailyAppt;
        
            defer_dailyappt.resolve();
        });

        defer_blockslot = $q.defer();
       
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptBlockSlotUrl'), { "sdate": date, "outletid": outletId}).then(function (respBlockSlot) {
            apptData.BlockSlot = respBlockSlot;

            defer_blockslot.resolve();
        });

        defer_c1appt = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptC1AppointmentUrl'), { "date": date, "brandId": brandId, "outletCode":outletName }).then(function (respC1Appointment) {
            apptData.C1Appointment = respC1Appointment;

            defer_c1appt.resolve();
        });

        defer_consultants = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "referId": outletId, "date": date }).then(function (respConsultant) {
            apptData.Consultants = respConsultant;
            defer_consultants.resolve();
        });


        defer_weekdayslotsetting = $q.defer();
        var weekday = daysOfWeek[new Date().getDay()];
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), { "weekday": weekday, "referId": outletId }).then(function (respWeekdaySlotSetting) {
            apptData.WeekdaySlotSetting = respWeekdaySlotSetting;
            defer_weekdayslotsetting.resolve();
        });


        defer_preferredslotsetting = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'), { "sdate": date }).then(function (respPreferredSlotSetting) {
            apptData.PreferredSlotSetting = respPreferredSlotSetting;
            defer_preferredslotsetting.resolve();
        });

       

    }

    var _loadLoginDatas = function loadLoginDatas(){
        defer_login = $q.defer();
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "Name": $rootScope.MyProfile.UserName, "Type": "" }).then(function (respConsultant) {
            loginData = respConsultant;
            brandId  = loginData[0].BrandId;
            outletId = loginData[0].OutletId;

            
            if (brandId != null) {
                _loadMasterData().then(function () {

                    defer_login.resolve();

                });
            }

        });
    }
    

    var _loadLoginData = function loadLoginData1() {
        _loadLoginDatas();

        return $q.all([defer_login.promise]);

    }

    var _loadMasterDatas = function loadMasterDatas() {


        console.log("brandId : " + brandId);
        console.log("OutletId : " + outletId);

        //_loadLoginData();

        //Edited by Jerson
        //$q.all([defer_login.promise]).then( function () {

            defer_outlets = $q.defer();
            
            

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl'), { "referId": brandId }).then(function (respOutlets) {
                masterData.Outlets = respOutlets;

                defer_outlets.resolve();
            });

            defer_outletdata = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl') + "/" + outletId).then(function (respOutlets) {
                masterData.OutletData = respOutlets;

                defer_outletdata.resolve();
            });

            //defer_outlets = $q.defer();

            //dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl'), { "referId": brandId }).then(function (respOutlets) {
            //    masterData.outlets = respOutlets;

            //    defer_outlets.resolve();
            //});

       
            defer_remindertype = $q.defer();
        
            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrReminderTypeUrl'), { "referId": brandId }).then(function (respReminderType) {
                masterData.ReminderTypes = respReminderType;
                defer_remindertype.resolve();
            });

       
            defer_brandsetting = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandSettingUrl'), { "referId": brandId }).then(function (resprowBrandSetting) {
                masterData.BrandSettting = resprowBrandSetting;

                defer_brandsetting.resolve();
            });


          

            defer_generalslotsetting = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'), { "referId": outletId }).then(function (respGeneralSlotSetting) {
                masterData.GeneralSlotSetting = respGeneralSlotSetting;
                defer_generalslotsetting.resolve();
            });

           

            defer_displaysetting = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrDisplaySettingUrl'), { "referId": outletId }).then(function (respDisplaySetting) {
                masterData.DisplaySetting = respDisplaySetting;
                defer_displaysetting.resolve();
            });

            defer_region = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrRegionUrl'), { "referId": outletId }).then(function (respRegion) {
                masterData.Region = respRegion;
                defer_region.resolve();
            });


            defer_holiday = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'), { "referId": outletId }).then(function (respHoliday) {
                masterData.Holiday = respHoliday;
                defer_holiday.resolve();
            });


            defer_outletsetting = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletSettingUrl'), { "referId": outletId }).then(function (respOutletSetting) {
                masterData.OutletSetting = respOutletSetting;
                defer_outletsetting.resolve();
            });

            defer_vipcategory = $q.defer();

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrVipCategoryUrl'), { "referId": brandId }).then(function (resprowHeader) {
                masterData.VipCategory = resprowHeader;

                defer_vipcategory.resolve();
            });

        // });

            

        }


    

   


    //var _loadOutletData = function loadOutletData(outletId){
    //    _loadOutletDatas(outletId);

    //    return $q.all([
    //          defer_consultants.promise,
    //          defer_generalslotsetting.promise,
    //          defer_weekdayslotsetting.promise,
    //          defer_preferredslotsetting.promise,
    //          defer_displaysetting.promise,
    //          defer_region.promise,
    //          defer_holiday.promise,
    //          defer_outletsetting.promise
    //    ]);
              
    //}
    
    var _loadMasterData = function loadMasterData() {
        _loadMasterDatas();

        return $q.all([
               defer_brandsetting.promise,
               defer_generalslotsetting.promise,
               defer_outlets.promise,
               defer_outletdata.promise,
               defer_displaysetting.promise,
               defer_region.promise,
               defer_holiday.promise,
               defer_outletsetting.promise,
               defer_vipcategory.promise
        ]);

    }

    
    var _loadApptData = function loadApptData(date,brandId,outletId,outletName) {
        _loadApptDatas(date, brandId, outletId, outletName);

        return $q.all([
              defer_dailyappt.promise,
              defer_blockslot.promise,
              defer_c1appt.promise,
              defer_consultants.promise,
              defer_weekdayslotsetting.promise,
              defer_preferredslotsetting.promise
        ]);

    }

    //var _loadLoginData = function loadLoginData(){
    //    _loadLoginDatas($rootScope.MyProfile.UserName);
    //}


    //var _getBrandData = function () {
    //    return data.brandData;
    //}

    //var _getOutletData = function () {
    //    return data.outletData;
    //}

    var _getApptData = function () {
        return apptData;
    }

    var _getLoginData = function () {
        return loginData;
    }

    var _getMasterData = function () {
        return masterData;
    }

    //_loadLoginData();

    //_loadMasterData();
   


    //dataServiceFactory.loadOutletData = _loadOutletData;
    //dataServiceFactory.getOutletData = _getOutletData;

    //dataServiceFactory.loadBrandData = _loadBrandData;
    //dataServiceFactory.getBrandData = _getBrandData;

    dataServiceFactory.loadMasterData = _loadMasterData();
    dataServiceFactory.getMasterData = _getMasterData;

    dataServiceFactory.loadApptData = _loadApptData;
    dataServiceFactory.getApptData = _getApptData;

    dataServiceFactory.loadLoginData = _loadLoginData;
    dataServiceFactory.getLoginData = _getLoginData;

    return dataServiceFactory;


}]);