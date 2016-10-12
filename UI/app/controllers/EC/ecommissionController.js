'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify', '$q', '$rootScope'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify, $q, $rootScope) {

        var vm = this;


        $scope.group = {

            formHeader: 'Outlet Daily Appointment - Admin',

            name: 'ecommission',


            gridResourceURL: zSrv_ResourceServer.getURL('cpCommissionUrl'),
            createModelURL: '/createcommission',
            listModelURL: '/listcommissions',



            zModel: {},
            zData: {},
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,
        }


        var grp = $scope.group;

       
    
      
    }

    zc.$inject = injectParams;

    app.register.controller('cpcommissionController', zc);

});
