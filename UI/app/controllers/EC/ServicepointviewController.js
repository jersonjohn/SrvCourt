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
            formHeader: 'Real Time Commission :: Service Point Monthly View',
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
        var month = "";


        $scope.showingView = "month";
        $scope.showingDate = moment().format();
        $scope.showingTitle = "test";

        grp.routeChangeCompleted = function () {
        };


        $scope.$on("$routeChangeSuccess", function () {
            var promise = zSrv_InputCustom.routeChangeSuccess($scope.group);
            promise.then(function () {
                _routeChangeStart();
            });
        });

        var _routeChangeStart = function () {
            grp.zData = zSrv_eCommissionData.getAllData();

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();


            $scope.CommMonth = result[0];
            $scope.CommYear = result[1];

            grp.zModel.MonthOptions = grp.zData.MonthOptions
            grp.zModel.SalesTransactionMonth = grp.LoadTransactiondata(grp.zData.SalesTransaction);
            grp.zModel.SalesTransactionDetail = grp.RemoveNullTransaction(grp.zData.SalesTransactionDetail);
            grp.zModel.SalesTransactionDetailMonth = grp.LoadTransactionDetaildata(grp.zData.SalesTransactionDetail);


            if (grp.zModel.SalesTransactionDetailMonth) {
                $scope.showingView = "month";
                $scope.showingDate = moment(grp.zModel.SalesTransactionMonth[0].Monthname + "-" + grp.zModel.SalesTransactionMonth[0].Comm_Year).format("15-MMM-YYYY");
                $scope.events = grp.zModel.SalesTransactionDetailMonth;
                $scope.changemonth(grp.zModel.SalesTransactionMonth[0].Monthname);
            }

        }
        grp.LoadTransactiondata = function (options) {
            var tempdata = [];
            for (i in options) {
                if (options[i].Comm_Month == $scope.CommMonth && options[i].Comm_Year == $scope.CommYear)
                    tempdata.push(options[i]);
            }
            return tempdata;
        }

        grp.RemoveNullTransaction = function (options) {
            var tempdata = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].Transaction_Date)
                    tempdata.push(options[i]);
            }
            return tempdata;
        }
        grp.LoadTransactionDetaildata = function (options) {

            for (var i = 0; i < options.length; i++) {
                var happyValue = "$" + options[i].Total_Collection;
                var sadValue = "$" + options[i].IS_Closing_Rate;
                var Amount = "$" + options[i].Service_Point;
                var eventdate = options[i].Transaction_Date;
                options[i].id = i;
                options[i].AmountValue = Amount;
                options[i].HappyValue = "";
                options[i].SadValue = "";
                options[i].start = eventdate;
                options[i].end = eventdate;
            }

            return options;
        }


        grp.LoadMonthView = function (item) {
            var Id = item.Month + "-" + item.Year;
            grp.ngLocation.path('/Servicepointview/' + Id);
        }

        grp.LoadDateView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissiondailyview/' + Id);
        }

        grp.LoaddataSales = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissionview/' + Id);
        }
        grp.LoaddataService = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Servicecommissionview/' + Id);
        }
        grp.LoaddataServicepoint = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Servicepointview/' + Id);
        }
    }

    zc.$inject = injectParams;

    app.register.controller('ServicepointviewController', zc);

});
