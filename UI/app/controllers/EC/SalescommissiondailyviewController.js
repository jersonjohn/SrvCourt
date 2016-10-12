'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', '$rootScope', 'zSrv_eCommissionData'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, $rootScope, zSrv_eCommissionData) {

        var vm = this;


        $scope.group = {
            name: 'Salescommission',

            gridResourceURL: zSrv_ResourceServer.getURL('SalesTransactionUrl'),
            listModelURL: '/Salescommission',
            formHeader: 'Real Time Commission :: Sales Commission Daily',
            zModel: {},
            zData: {},
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,

        }

        var grp = $scope.group;
        var param = grp.ngRouteParams["param"];
        var defer_prefer = null;
        var result = param.split('-');

        grp.routeChangeCompleted = function () {
        };


        $scope.$on("$routeChangeSuccess", function () {
            var promise = zSrv_InputCustom.routeChangeSuccess($scope.group);
            promise.then(function () {
                _routeChangeStart();
            });
        });

        var _routeChangeStart = function () {

            $scope.CommMonth = result[0];
            $scope.CommYear = result[1];

            grp.zData = zSrv_eCommissionData.getAllData();
            grp.zModel.SalesTransactionDetail = grp.LoadTransactiondata(grp.zData.SalesTransactionDetail);
            grp.zModel.SalesTransactionDaily = grp.LoadTransactiondataDetail(grp.zData.SalesTransactionDaily);

        }


        grp.LoadTransactiondata = function (options) {
            var tempdata = [];
            for (i in options) {
                if (options[i].Comm_Month == $scope.CommMonth)
                    tempdata.push(options[i]);
            }
             return tempdata;
        }
        grp.LoadTransactiondataDetail = function (options) {
            var tempdata = [];
            for (i in options) {
                if (options[i].Comm_Month == $scope.CommMonth)
                    tempdata.push(options[i]);
            }
            return tempdata;
        }


        grp.LoadMonthView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissionview/' + Id);
        }

        grp.LoadDateView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissiondailyview/' + Id);
        }

        grp.LoadCutomerView = function (item) {

            var Id = grp.GetDate(item.Transaction_Date) + "-" + item.Customer_ID;
            grp.ngLocation.path('/Salescommissioncustomerview/' + Id);
        }

        grp.GetDate = function (itemValue) {
            var dateval = new Date();

            dateval = itemValue;
            var d = dateval.getDate();
            var m = dateval.getMonth() + 1;
            var y = dateval.getFullYear();
            var Id = d.toString() + "-" + m.toString() + "-" + y.toString();
            return Id;
        }
    }

    zc.$inject = injectParams;

    app.register.controller('SalescommissiondailyviewController', zc);

});
