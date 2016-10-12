angular.module("zSrv_CookieStore", [])

.service("zSrv_CookieStore", ['$q', '$http', 'zApp_Config',
function ($q, $http, zApp_Config) {

    //service factory
    var sf = {};

    var hostUri = zApp_Config.Client.CookieStoreUri || '/';

    var _httpPost = function (serviceURL, parameters) {
        var deferred = $q.defer();

        $http.post(serviceURL, parameters).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }


    var _getObject = function (id) {
        return _httpPost(hostUri + 'CookieStore/getObject', { id: id });
    }
   
    var _putObject = function (name, value) {
        var v = angular.toJson(value);
        return _httpPost(hostUri + 'CookieStore/putObject', { Name: name, Value: v });
    }

    var _remove = function (id) {
        return _httpPost(hostUri + 'CookieStore/removeObject', { id: id });
    }

    sf.getObject = _getObject;
    sf.putObject = _putObject;
    sf.remove = _remove;

    return sf;
}]);
