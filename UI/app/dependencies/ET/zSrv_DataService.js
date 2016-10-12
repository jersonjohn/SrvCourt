'use strict';
//zSrv_DataService
//angular.module("zSrv_DataService", [])
//.factory('dataService', ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer) {
define(['app'], function (app) {

    var injectParams = ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer'];
    var zs = function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer) {
        //service factory
        //var sf = {};


        var dataServiceFactory = {};

        var _getBrandList = function () {
            return _httpGet(zSrv_ResourceServer.getURL('eApptMtrBrandUrl'), {});
        }

        var _getBrandDetails = function (serviceURL, parameters) {
            return _httpGet(serviceURL, parameters);
        }

        var _getBrandSetting = function (serviceURL, parameters) {
            return _httpGet(serviceURL, parameters);
        }


        var _getCustomerDetails = function (serviceURL, parameters) {
            return _httpGet(serviceURL, parameters);
        }

        var _checkAppointment = function () {

        }

        var _getAppointment = function (serviceURL, parameters) {
            return _httpGet(serviceURL, parameters);
        }


        var _changeAppointment = function (serviceURL, parameters) {
            return _httpPut(serviceURL, parameters);
        }




        var _getOutletList = function (brandId) {
            return _httpGet(zSrv_ResourceServer.getURL('eApptOutletUrl'), { "BrandId": brandId });
        }


        var _getConsultantList = function (outletId) {
            return _httpGet(zSrv_ResourceServer.getURL('eApptConsultantUrl'), { "OutletdId": outletId });
        }







        var _httpGet = function (serviceURL, parameters) {
            var deferred = $q.defer();

            $http({
                url: serviceURL,
                method: "GET",
                params: parameters
            }).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
                //console.log(err);
                //alert(err);
            });
            return deferred.promise;
        }

        var _httpPost = function (serviceURL, parameters) {
            var deferred = $q.defer();

            if (serviceURL.indexOf('oauth2/') == 0)
                serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

            $http.post(serviceURL, parameters).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
                //console.log(err);
                //alert(err);
            });
            return deferred.promise;
        }

        var _httpPut = function (serviceURL, parameters) {
            var deferred = $q.defer();

            if (serviceURL.indexOf('oauth2/') == 0)
                serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

            $http.put(serviceURL, parameters).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
                //console.log(err);
                //alert(err);
            });
            return deferred.promise;
        }

        var _httpDelete = function (serviceURL, parameters) {
            var deferred = $q.defer();

            if (serviceURL.indexOf('oauth2/') == 0)
                serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

            $http.delete(serviceURL, parameters).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
                //console.log(err);
                //alert(err);
            });
            return deferred.promise;
        }



        dataServiceFactory.httpGet = _httpGet;
        dataServiceFactory.getAppointment = _getAppointment;
        dataServiceFactory.changeAppointment = _changeAppointment;
        dataServiceFactory.getCustomerDetails = _getCustomerDetails;

        return dataServiceFactory;
    }
    zs.$inject = injectParams;

    app.register.service('zSrv_DataService', zs);

});