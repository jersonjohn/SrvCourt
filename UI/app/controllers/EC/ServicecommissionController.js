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
            formHeader: 'Real Time Commission :: Service Commission',
            zModel: {},
            zData: {},
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,

        }

        var grp = $scope.group;
        var param = grp.ngRouteParams["param"];
        var defer_prefer = null;

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
            grp.zModel.SalesTransaction = grp.zData.SalesTransaction;
            grp.zModel.SalesTransactionDetail =grp.zData.SalesTransactionDetail;
        }
     
        grp.LoadMonthView = function (item) {
            var Id = item.Transaction_Date;
            grp.ngLocation.path('/Servicecommissionview/' + Id);
        }

        grp.LoadDateView = function (item) {
          
            var Id = grp.GetDate(item.Transaction_Date);
            grp.ngLocation.path('/Servicecommissiondailyview/' + Id);
        }

        grp.GetDate =function (itemValue) {
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

    app.register.controller('ServicecommissionController', zc);

});
