'use strict';
//zSrv_MasterData

//angular.module("zSrv_MasterData", [])
//.factory('zSrv_MasterData', ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'dataService', '$rootScope',function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer, dataService,$rootScope) {
define(['app'], function (app) {

    var injectParams = ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_DataService', '$rootScope'];
    var zs = function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_DataService, $rootScope) {


        var dataService = zSrv_DataService;
    var dataServiceFactory = {};

    var defer_brand = null;
    var defer_brands = null;

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
    var defer_status = null;
    var defer_accesssetting = null;

    

    
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
	  
	  
        //var weekday = daysOfWeek[new Date(date).getDay()];
	  
	    var d = date.split("-");
        var m = d[0] - 1;
        var newDate = new Date(d[2], m, d[1]);
        var weekday = daysOfWeek[newDate.getDay()];
	  
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), { "weekday": weekday, "referId": outletId }).then(function (respWeekdaySlotSetting) {
            apptData.WeekdaySlotSetting = respWeekdaySlotSetting;
            defer_weekdayslotsetting.resolve();
        });


        defer_preferredslotsetting = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'), {"referId": outletId  , "sdate": date }).then(function (respPreferredSlotSetting) {
            apptData.PreferredSlotSetting = respPreferredSlotSetting;
            defer_preferredslotsetting.resolve();
        });

       

    }

    var _loadLoginDatas = function loadLoginDatas(){
        defer_login = $q.defer();
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "Name": $rootScope.MyProfile.UserName, "Type": "" }).then(function (respConsultant) {
            loginData = respConsultant;
		  
		   if (loginData.length > 0){
            brandId  = loginData[0].BrandId;
            outletId = loginData[0].OutletId;

            
           
            _loadMasterData(brandId, outletId).then(function () {

                    defer_login.resolve();

                });
			}
		    else{
			  console.log('default outlet/brand not set for the consultant');
			}

        });
    }
    

    var _loadLoginData = function loadLoginData1() {
        _loadLoginDatas();

        return $q.all([defer_login.promise]);

    }


    var _loadMasterData = function loadMasterData(brandId, outletId) {
        _loadMasterDatas(brandId, outletId);

        return $q.all([
               defer_brand.promise,
               defer_brands.promise,
               defer_brandsetting.promise,
               defer_generalslotsetting.promise,
               defer_outlets.promise,
               defer_outletdata.promise,
               defer_displaysetting.promise,
               defer_region.promise,
               defer_holiday.promise,
               defer_outletsetting.promise,
               defer_vipcategory.promise,
               defer_status.promise,
               defer_accesssetting.promise
        ]);

    }




    var _loadMasterDatas = function loadMasterDatas(brandId, outletId) {


        console.log("brandId : " + brandId);
        console.log("outletId : " + outletId);

        

        defer_brand = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandUrl') + "/" +  brandId ).then(function (respBrand) {
            masterData.brand = respBrand;

            defer_brand.resolve();
        });

        defer_brands = $q.defer();

        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandUrl'), {}).then(function (respBrand) {
            masterData.brands = respBrand;

            defer_brands.resolve();
        });


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

          

       
            defer_remindertype = $q.defer();
            //{ "referId": brandId }
            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrReminderTypeUrl'), {}).then(function (respReminderType) {
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

            dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'), { "outletId": outletId }).then(function (respHoliday) {
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

       
          defer_status = $q.defer();

          dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrApptStatusUrl'), {}).then(function (respStatus) {
            masterData.status = respStatus;

            defer_status.resolve();
         });
            

          defer_accesssetting = $q.defer();

          dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrAccessSettingUrl'), {"name": $rootScope.MyProfile.UserName}).then(function (respSetting) {
            masterData.AccessSetting = respSetting;

            defer_accesssetting.resolve();
         });
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

    

    var _getApptData = function () {
        return apptData;
    }

    var _getLoginData = function () {
        return loginData;
    }

    var _getMasterData = function () {
        return masterData;
    }

   

    dataServiceFactory.loadMasterData = _loadMasterData;
    dataServiceFactory.getMasterData = _getMasterData;

    dataServiceFactory.loadApptData = _loadApptData;
    dataServiceFactory.getApptData = _getApptData;

    dataServiceFactory.loadLoginData = _loadLoginData;
    dataServiceFactory.getLoginData = _getLoginData;

    return dataServiceFactory;

    }
    zs.$inject = injectParams;

    app.register.service('zSrv_MasterData', zs);

});