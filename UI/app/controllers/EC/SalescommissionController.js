'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', '$rootScope','zSrv_eCommissionData'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, $rootScope, zSrv_eCommissionData) {

        var vm = this;


        $scope.group = {
            name: 'Salescommission',

            gridResourceURL: zSrv_ResourceServer.getURL('SalesTransactionUrl'),
            listModelURL: '/Salescommission',
            formHeader: 'Real Time Commission :: Sales Commission',
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
            var hederdata = grp.zData.SalesTransaction;
            var detaildata = grp.zData.SalesTransactionDetail;
        }
            
        grp.LoadMonthView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissionview/' + Id);
        }

        grp.LoadDateView = function (item) {
            var Id = item.Comm_Month + "-" + item.Comm_Year;
            grp.ngLocation.path('/Salescommissiondailyview/' + Id);
        }
    }

    zc.$inject = injectParams;

    app.register.controller('SalescommissionController', zc);

});
