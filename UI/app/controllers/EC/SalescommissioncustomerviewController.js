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
            formHeader: 'Real Time Commission :: Sales Customer Daily',
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

            $scope.CommDate = result[0];
            $scope.CommMonth = result[1];
            $scope.CommYear = result[2];

            var parts = param.split('-');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            $scope.Transaction_Date = mydate;

            $scope.Customer_ID = result[3];

            grp.zData = zSrv_eCommissionData.getAllData();
            grp.zModel.SalesCustomer = grp.LoadTransactiondata(grp.zData.SalesCustomer);
            grp.zModel.SalesTransactionCustomerDetail = grp.LoadTransactiondataDetail(grp.zData.SalesTransactionCustomerDetail);

        }


        grp.LoadTransactiondata = function (options) {
            var tempdata = [];
            for (i in options) {
                if (options[i].Transaction_Date.toDateString() == $scope.Transaction_Date.toDateString() && options[i].Customer_ID == $scope.Customer_ID)
                    tempdata.push(options[i]);
            }
            return tempdata;
        }

        grp.LoadTransactiondataDetail = function (options) {
            var tempdata = [];
            for (i in options) {
                if (options[i].Transaction_Date.toDateString() == $scope.Transaction_Date.toDateString() && options[i].Customer_ID == $scope.Customer_ID)
                    tempdata.push(options[i]);
            }
            return tempdata;
        }

    }

    zc.$inject = injectParams;

    app.register.controller('SalescommissioncustomerviewController', zc);

});
