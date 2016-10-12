'use strict';
//zSrv_eApptMasterData
define(['app'], function (app) {

    var injectParams = ['zSrv_ResourceServer', 'zSrv_InputCustom'];
    var zs = function (zSrv_ResourceServer, zSrv_InputCustom) {
        //service factory
        var sf = {};

        var data = {};

        var _loadData_Brand = function loadData_Brand() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandUrl'), {}).then(function (respBrand) {
                data.BrandOptions = respBrand;
            });
        }

        var _loadData_Outlet = function loadData_Outlet() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl'), {}).then(function (respOutlet) {
                data.OutletOptions = respOutlet;
            });
        }
		
		var _loadData_Consultant = function loadData_Consultant() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), {}).then(function (respConsultant) {
                data.ConsultantOptions = respConsultant;
            });
        }
		  
		var _loadData_GeneralSlotSetting = function loadData_GeneralSlotSetting() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrSettingUrl'), {}).then(function (respGeneralSlotSetting) {
                data.GeneralSlotSetting = GeneralSlotSetting;
            });
        }
		
		var _loadData_WeekdaySlotSetting = function loadData_WeekdaySlotSetting() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), {}).then(function (respWeekdaySlotSetting) {
                data.WeekdaySlotSetting = respWeekdaySlotSetting;
            });
        }
		
		var _loadData_PreferredSlotSetting = function loadData_PreferredSlotSetting() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'), {}).then(function (respPreferredSlotSetting) {
                data.PreferredSlotSetting = PreferredSlotSetting;
            });
        }
		
		var _loadData_DisplaySetting = function loadData_DisplaySetting() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrDisplaySettingUrl'), {}).then(function (respDisplaySetting) {
                data.DisplaySetting = respDisplaySetting;
            });
        }
		
	   var _loadData_Region = function loadData_Region() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrRegionUrl'), {}).then(function (respRegion) {
                data.Region = respRegion;
            });
        }
	   
	   
	    var _loadData_Holiday = function loadData_Holiday() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'), {}).then(function (respHoliday) {
                data.Holiday = respHoliday;
            });
        }
		
		var _loadData_VipCategory = function loadData_VipCategory() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrVipCategorytUrl'), {}).then(function (respVipCategory) {
                data.VipCategory = respVipCategory;
            });
        }
	
		var _loadData_ApptStatus = function loadData_ApptStatus() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrApptStatusUrl'), {}).then(function (respApptStatus) {
                data.ApptStatus = respApptStatus;
            });
        }
		
		var _loadData_ReminderType = function loadData_ReminderType() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrReminderTypeUrl'), {}).then(function (respReminderType) {
                data.ReminderType = respReminderType;
            });
        }
		

        var _loadAllData = function loadAllData() {
            _loadData_Brand();
            _loadData_Outlet();
		    _loadData_Consultant();
		    _loadData_GeneralSlotSetting();
		    _loadData_WeekdaySlotSetting();
		    _loadData_PreferredSlotSetting();
		    _loadData_DisplaySetting();
		    _loadData_Region();
		    _loadData_Holiday();
		    _loadData_VipCategory();
		    _loadData_ApptStatus();
		    _loadData_ReminderType();
        }
		
        _loadAllData();

        var _getAllData = function (name) {
            return data;
        }

        sf.loadAllData = _loadAllData;
        sf.getAllData = _getAllData;

        return sf;
    }
    zs.$inject = injectParams;

    app.register.service('zSrv_eApptMasterData', zs);

});