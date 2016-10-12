angular.module("zMod_OAuth2Intercept", [])
//.constant("zConst_LogInURL", "http://localhost:49591/home/login")
.factory('zFtr_OAuth2RefreshInject', ['$q', '$injector', '$rootScope', '$window', '$location', function ($q, $injector, $rootScope, $window, $location) {
    var zFtr_OAuth2RefreshInject = {
        responseError: function (response) {
            if (response.config.url.indexOf('LogUserActivity') > 0)
                return $q.reject(response);

            if (response.status === 400 || response.status === 401) {
                // set delay time
                var delayTime = 0;
                switch (response.status) {
                    case 400:
                        delayTime = 3000;
                        break;
                    case 401:
                        delayTime = 5000;
                        break;
                }
                

                var OAuth2Service = $injector.get('zSrv_OAuth2');
                if (!$rootScope.thisToken.token) {
                    //if ($location.absUrl() == OAuth2Service.Client.LogInUri)
                        return $q.reject(response);
                    //else {
                    //    //$window.location.href = OAuth2Service.Client.LogInUri + (($location.path() == '/') ? '' : '?accessTo=' + encodeURI($location.path()));
                    //    $window.location.href = (($location.path() == '/') ? '' : '?accessTo=' + encodeURI($location.path()));
                    //    return $q.reject(response);
                    //}
                }
                // if (response.config.url.indexOf('/token') < 0) {
                if (response.status != 401) {
                    //$window.location.href = OAuth2Service.Client.LogInUri;
                    return $q.resolve(response);
                }

                var $http = $injector.get('$http');
                var deferred = $q.defer();
                setTimeout(function () {
                    OAuth2Service.refreshToken($rootScope.thisToken).then(function (result) {
                        $rootScope.thisToken = result;
                        if (!result) alert('Your session has expired! Please re-login to access the system.');
                        return deferred.resolve();
                    }, function (err) {
                        //$rootScope.thisToken = null;
                        //$window.location.href = zConst_LogInURL + (($location.path() == '/') ? '' : '?accessTo=' + encodeURI($location.path()));
                        return deferred.reject(err);
                    });
                }, delayTime);

                return deferred.promise.then(function () {
                    response.config.headers['Authorization'] = 'Bearer ' + $rootScope.thisToken.token;
                    return $http(response.config);
                });
            }
            return $q.reject(response);
        }
    };
    return zFtr_OAuth2RefreshInject;
}])
.factory('zFtr_OAuth2BearerInject', ['$rootScope', function ($rootScope) {
    var zFtr_OAuth2BearerInject = {
        request: function (config) {
            if ($rootScope.thisToken) {
                if ($rootScope.thisToken.token) {

                    config.headers['Authorization'] = 'Bearer ' + $rootScope.thisToken.token;
                  //  config.headers['Cache-Control'] = 'no-cache';
                }
            }
            return config;
        }
    }
    return zFtr_OAuth2BearerInject;    
}])
.factory('zFtr_TimeStampMarker', ['$q', '$injector','$rootScope', '$location', function ($q, $injector, $rootScope, $location) {
    var timestampMarker = {
        request: function (config) {
            
            //if (config.url.indexOf('http') != 0)
            //    return config;
            if (config.cache)  //omit components calling; only interested with api or mvc calling
                return config;
            if (config.url.indexOf('LogUserActivity') > 0) {
                return config;
            }
            if (!$rootScope.MyProfile)
                return config;
            if ($rootScope.MyProfile.LogActivityTime || $rootScope.MyProfile.LogActivityData)
                config.requestTimestamp = new Date().getTime();
            if ($rootScope.MyProfile.LogActivityData)
                config.requestData = JSON.stringify(config.data);
            return config;
        },
        response: function (response) {
            
            if (response.config.cache)  //omit components calling; only interested with api or mvc calling
                return response;
            if (response.config.url.indexOf('LogUserActivity') > 0) {
                return response;
            }
            if (!$rootScope.MyProfile)
                return response;
            if ($rootScope.MyProfile.LogActivityData)
                response.config.responseData = JSON.stringify(response.data);
            var OAuth2LogService = $injector.get('zSrv_OAuth2');
            var sizeByte = OAuth2LogService.getStringByteLen(response.config.responseData);
            if (sizeByte > 10000)
                response.config.responseData = response.config.responseData.slice(0, 10000);
            var durationMSec = 0;
            
            if ($rootScope.MyProfile.LogActivityTime || $rootScope.MyProfile.LogActivityData) {
                
                response.config.responseTimestamp = new Date().getTime();
                durationMSec = response.config.responseTimestamp - response.config.requestTimestamp;
                var requestParams = JSON.stringify(response.config.params);
                
                var $http = $injector.get('$http');
                var logActivity = {
                    DurationMSec: durationMSec,
                    Host: $location.host(),
                    Path: response.config.url,
                    HttpMethod: response.config.method,
                    RequestData: (response.config.requestData ? response.config.requestData : requestParams),
                    ResponseData: (response.config.responseData ? response.config.responseData : ''),
                    SizeByte: sizeByte,
                    ResponseStatus: response.status
                };
                OAuth2LogService.logActivity(logActivity).then(function (value) { console.log("@@>" + value.data) });
                return response;

            } else
                return response;
        },
        responseError: function (response) {
            if (response.status === 401) {  //not include 500, include user login fail will also logged
                return $q.reject(response);
            }
            //var MaxRetry = 3;
            //if (!response.data)
            //    response.data = {};
            //if (response.data.retryCount)
            //    response.data.retryCount = 1 + Number(response.data.retryCount);
            //else
            //    response.data.retryCount = 0;
            //if (response.data.retryCount < MaxRetry) {
            if (response.config.url.indexOf('LogUserActivity') > 0 )
                return $q.reject(response);
                
            if (response.status === 400 && response.config.url.indexOf('/token') > 0) {
                return $q.reject(response);
            }

            var responseData = JSON.stringify(response.data);
            var OAuth2LogService = $injector.get('zSrv_OAuth2');
            var sizeByte = OAuth2LogService.getStringByteLen(responseData);
            if (sizeByte > 10000)
                responseData = responseData.slice(0, 10000);
            var durationMSec = 0;
            var requestParams = JSON.stringify(response.config.params);


            var $http = $injector.get('$http');
            var logActivity = {
                DurationMSec: durationMSec,
                Host: $location.host(),
                Path: response.config.url,
                HttpMethod: response.config.method,
                RequestData: (response.config.requestData ? response.config.requestData : requestParams),
                ResponseData: (responseData ? responseData : ''),
                SizeByte: sizeByte,
                ResponseStatus: response.status
        //        retryCount: response.data.retryCount
            };
            OAuth2LogService.logActivity(logActivity).then(function (value) { console.log("@@>" + value.data) });
            //}
            return $q.reject(response);
        }
    };
    return timestampMarker;
}]);


