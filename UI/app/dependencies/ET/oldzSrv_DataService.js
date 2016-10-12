'use strict';
//zSrv_eApptMasterData
define(['app'], function (app) {

    var injectParams = ['zSrv_ResourceServer', 'zSrv_InputCustom','$http', '$q','zSrv_OAuth2'];
    var zs = function (zSrv_ResourceServer, zSrv_InputCustom,$http, $q,zSrv_OAuth2) {
        //service factory
    var sf = {};

   

    var _getCustomerDetails = function(serviceURL,parameters)
    {
        return _httpGet(serviceURL, parameters);
    }

    var _getAppointment = function (serviceURL,parameters)
    {
        return _httpGet(serviceURL, parameters);
    }


    var _changeAppointment = function (serviceURL, parameters)
    {
        return _httpPut(serviceURL, parameters);
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


   
    sf.httpGet = _httpGet;
	sf.httpPost= _httpPost;
	sf.httpPut = _httpPut;
	sf.httpDelete = _httpDelete;
    sf.getAppointment = _getAppointment;
    sf.changeAppointment = _changeAppointment;
    sf.getCustomerDetails = _getCustomerDetails;

    
     return sf;
	  
    }
	
    zs.$inject = injectParams;

    app.register.service('zSrv_eApptMasterData', zs);

});