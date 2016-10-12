'use strict';
//zSrv_eSupportMasterData
define(['app'], function (app) {

    var injectParams = ['zSrv_ResourceServer', 'zSrv_InputCustom','$q'];
    var zs = function (zSrv_ResourceServer, zSrv_InputCustom,$q) {
        //service factory
        var sf = {};

        var data = {};

        var _loadData_Dept = function loadData_Dept() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportDeptsUrl'), {}).then(function (respDept) {
                data.Depts = respDept;
            });
        }

        var _loadData_Status = function loadData_Status() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl')+'?referId=1', {}).then(function (respStatus) {
                data.Status = respStatus;
            });
        }

        var _loadData_Outlets = function loadData_Outlets() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportOutletsUrl'), {}).then(function (respOutlets) {
                data.Outlets = respOutlets;
                data.AllOutlets = respOutlets;
            });
        }

        var _loadData_Priorities = function loadData_Priorities() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportPriorityDetailsUrl')+'?referId=1', {}).then(function (respPriorities) {
                data.Priorities = respPriorities;
            });
        }

        var _loadData_Categories = function loadData_Categories() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportIssueCategoryUrl')+'?referId=1', {}).then(function (respCategories) {
                data.Categories = respCategories;
            });
        }

        var _loadData_Users = function loadData_Users() {

            var queue0 = $q.defer();
            var process0 = queue0.promise;
            var Allusers = [];

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('clientUserURL'), {}).then(function (respUsers) {
                data.Users = respUsers;
                //console.log("Users : " + JSON.stringify(respUsers));
                //Allusers = respUsers;
                queue0.resolve();
            });
            /*
            $q.all([process0]).then(function () {
                data.Users = [];
                //for (var x in Allusers) {
                for (var i = 0; i < Allusers.length; i++) {
                    var user = Allusers[i];
                    data.Users.push({Id:user.Id,UserName:user.UserName});
                }

            });
            */
        }

        var _loadData_Brands = function loadData_Brands() {

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportBrandsUrl'), {}).then(function (respBrands) {
                data.Brands = respBrands;

            });

        }


        var _loadAllData = function loadAllData() {
            _loadData_Dept();
            _loadData_Status();
            _loadData_Outlets();
            _loadData_Priorities();
            _loadData_Categories();
            _loadData_Users();
            _loadData_Brands();
            //_loadData_eSuppFiles();
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

    app.register.service('zSrv_eSupportMasterData', zs);

});