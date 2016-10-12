angular.module("zSrv_ScheduleData", [])
.factory('scheduleData', ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'dataService', function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer, dataService) {



   
    var defer_consultants = null;
    var defer_generalslotsetting = null;
    var defer_weekdayslotsetting = null;
    var defer_preferredslotsetting = null;
    var defer_displaysetting = null;
    var defer_region = null;
    var defer_holiday = null;
    var defer_outletsetting = null;


    var dataServiceFactory = {};

    var data = {};

    var defer_queue = null;

  
    defer_consultants = $q.defer();
    var _loadData_Consultant = function loadData_Consultant(outletId) {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "referId": outletId }).then(function (respConsultant) {
            data.outlets.Consultants = respConsultant;
            defer_consultants.resolve();
        });
    }
    defer_generalslotsetting = $q.defer();
    var _loadData_GeneralSlotSetting = function loadData_GeneralSlotSetting() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrSlotSettingUrl'), { "referId": outletId }).then(function (respGeneralSlotSetting) {
            data.outlets.GeneralSlotSetting = respGeneralSlotSetting;
            defer_generalslotsetting.resolve();
        });
    }
    defer_weekdayslotsetting = $q.defer();
    var _loadData_WeekdaySlotSetting = function loadData_WeekdaySlotSetting() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrWkDaySettingUrl'), { "referId": outletId }).then(function (respWeekdaySlotSetting) {
            data.outlets.WeekdaySlotSetting = respWeekdaySlotSetting;
            defer_weekdayslotsetting.resolve();
        });
    }
    defer_preferredslotsetting = $q.defer();
    var _loadData_PreferredSlotSetting = function loadData_PreferredSlotSetting() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrPreferDaySettingUrl'), { "referId": outletId }).then(function (respPreferredSlotSetting) {
            data.outlets.PreferredSlotSetting = respPreferredSlotSetting;
            defer_preferredslotsetting.resolve();
        });
    }
    defer_displaysetting = $q.defer();
    var _loadData_DisplaySetting = function loadData_DisplaySetting() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrDisplaySettingUrl'), { "referId": outletId }).then(function (respDisplaySetting) {
            data.outlets.DisplaySetting = respDisplaySetting;
            defer_displaysetting.resolve();
        });
    }
    defer_region = $q.defer();
    var _loadData_Region = function loadData_Region() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrRegionUrl'), { "referId": outletId }).then(function (respRegion) {
            data.outlets.Region = respRegion;
            defer_region.resolve();
        });
    }

    defer_holiday = $q.defer();
    var _loadData_Holiday = function loadData_Holiday() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrHolidayUrl'), { "referId": outletId }).then(function (respHoliday) {
            data.outlets.Holiday = respHoliday;
            defer_holiday.resolve();
        });
    }
   
    defer_outletsetting = $q.defer();
    var _loadData_OutletSetting = function loadData_OutletSetting() {
        dataService.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletSettingUrl'), { "referId": outletId }).then(function (respOutletSetting) {
            data.outlets.OutletSetting = respOutletSetting;
            defer_outletsetting.resolve();
        });
    }


    var _loadScheduleData = function _loadScheduleData(outletId) {
      
        _loadData_Consultant(outletId);
        _loadData_GeneralSlotSetting(outletId);
        _loadData_WeekdaySlotSetting(outletId);
        _loadData_PreferredSlotSetting(outletId);
        _loadData_DisplaySetting(outletId);
        _loadData_Region(outletId);
        _loadData_Holiday(outletId);
        _loadData_OutletSetting(outletId);


        $q.all([
               
              
                defer_consultants.promise,
                defer_generalslotsetting.promise,
                defer_weekdayslotsetting.promise,
                defer_preferredslotsetting.promise,
                defer_displaysetting.promise,
                defer_region.promise,
                defer_holiday.promise,
                defer_outletsetting.promise

        ]).then(function () {

            return defer_queue.promise;
        });
    }

    _loadOutletData();


    var _getOutletData = function (name) {
        return data.outlets;
    }

    dataServiceFactory.loadOutletData = _loadOutletData;
    dataServiceFactory.getOutletData = _getOutletData;

    return dataServiceFactory;
}]);