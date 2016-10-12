'use strict';
define(['app'], function (app) {

    var injectParams = ['zSrv_ResourceServer', 'zSrv_InputCustom'];
    var zs = function (zSrv_ResourceServer, zSrv_InputCustom) {
     
        var sf = {};
        var staffid = "BJ131";
        var companyid = "SG02";

        var data = {};

        var _loadData_Month = function loadData_Month() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('MonthUrl'), {}).then(function (respdata) {
                data.MonthOptions = respdata;
            });
        }

        var _loadData_SalesTransaction = function loadData_SalesTransaction() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesTransactionUrl'), {  "staffid": staffid, "companyid": companyid }).then(function (respdata) {
                data.SalesTransaction = respdata;
            });
        }
        var _loadData_SalesTransactionDetail = function loadData_SalesTransactionDetail() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesTransactionDetailUrl'), {  "staffid": staffid, "companyid": companyid }).then(function (respdata) {
                data.SalesTransactionDetail = respdata;
            });
        }
        var _loadData_SalesTransactionDaily = function loadData_SalesTransactionDaily() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesDetailUrl'), { "staffid": staffid, "companyid": companyid }).then(function (respdata) {
                data.SalesTransactionDaily = respdata;
            });
        }
        var _loadData_SalesCustomer = function loadData_SalesCustomer() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesCustomerUrl'), { "staffid": staffid, "companyid": companyid, "type": "Head" }).then(function (respdata) {
                data.SalesCustomer = respdata;
            });
        }
        var _loadData_SalesTransactionCustomer = function loadData_SalesTransactionCustomer() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesCustomerUrl'), { "staffid": staffid, "companyid": companyid, "type": "Header" }).then(function (respdata) {
                data.SalesTransactionCustomer = respdata;
            });
        }
        var _loadData_SalesTransactionCustomerDetail = function loadData_SalesTransactionCustomerDetail() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('SalesCustomerUrl'), { "staffid": staffid, "companyid": companyid, "type": "Detail" }).then(function (respdata) {
                data.SalesTransactionCustomerDetail = respdata;
            });
        }
       
        var _loadAllData = function loadAllData() {
            _loadData_Month();
            _loadData_SalesTransaction();
            _loadData_SalesTransactionDetail();
            _loadData_SalesTransactionDaily();
            _loadData_SalesCustomer();
            _loadData_SalesTransactionCustomer();
            _loadData_SalesTransactionCustomerDetail();

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

    app.register.service('zSrv_eCommissionData', zs);

});