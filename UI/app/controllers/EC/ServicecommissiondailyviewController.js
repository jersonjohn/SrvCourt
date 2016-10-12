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
            formHeader: 'Real Time Commission :: Service Commission Daily',
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
            var mydate = new Date(parts[2],parts[1]-1,parts[0]); 
            $scope.Transaction_Date = mydate;

            grp.zData = zSrv_eCommissionData.getAllData();
            grp.zModel.SalesTransaction = grp.zData.SalesTransaction;
            grp.zModel.SalesTransactionDetail = grp.LoadTransactiondata(grp.zData.SalesTransactionDetail);
            grp.zModel.SalesTransactionCustomer = grp.zData.SalesTransactionCustomer;
        }
       
        grp.LoadTransactiondata = function (options) {
            var tempdata = [];
            for (i in options) {              
                if (options[i].Transaction_Date.toDateString() == $scope.Transaction_Date.toDateString())
                    tempdata.push(options[i]);
            }
            return tempdata;
        }
      

        grp.LoadMonthView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Servicecommissionview/' + Id);
        }

        grp.LoadDateView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Servicecommissiondailyview/' + Id);
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

    app.register.controller('ServicecommissiondailyviewController', zc);

});
