angular.module("zSrv_ResourceServer", [])
.service("zSrv_ResourceServer", ['zSrv_InputCustom', '$q', 'zSrv_OAuth2', 'zApp_Config', function (zSrv_InputCustom, $q, zSrv_OAuth2, zApp_Config) {

    //service factory
    var sf = {};

    var data = {};

    var _loadData = function (clientId) {
        var oauth2URL = zSrv_OAuth2.OAuth2.BaseUri;
        var deferred = $q.defer();
        zSrv_InputCustom.httpPost(oauth2URL + "admin/ResourceServers").then(function (result) {
            if (result.status == 'success') {
                //data = removeDuplicate(result.data);
                data = result.data;
                zSrv_OAuth2.postCookieStore('resourceServer::', JSON.stringify(result.data));
            } else if (result.status == 'serialize') {
                data = JSON.parse(result.data);
            }

           // data = result.data;

            if (zApp_Config.TestResourceServer.length > 0) {
                var dataStr = JSON.stringify(data);
                for (var i = 0; i < zApp_Config.TestResourceServer.length; i++) {
                    dataStr = dataStr.replace(new RegExp(zApp_Config.TestResourceServer[i].LiveUrl, 'g'), zApp_Config.TestResourceServer[i].LocalUrl);  //.replace('http://192.168.1.33:5013',);
                }

                data = JSON.parse(dataStr);
            }
            deferred.resolve();
            console.log('data load for Resource Servers completed.')
        }, function (err) {
            deferred.reject();
            console.log('Error at zSrv_ResourceServer (loadData): ' + err);
            data = {};
        });
        return deferred.promise;
    }
 
    var _getURL = function (name) {
        var oauth2URL = zSrv_OAuth2.OAuth2.BaseUri;
        for (i in data) {
            if (data[i].Name == name) {
                if (data[i].URL.indexOf("http://oauth2/") == 0)
                    return data[i].URL.replace("http://oauth2/", oauth2URL)
                else
                    return data[i].URL;
            }
        }
        return null;
        //var oauth2URL = zSrv_OAuth2.OAuth2.BaseUri;
        //zSrv_InputCustom.httpGet( oauth2URL + "api/ResourceServerApi", { name: name }).then(function (data) {
        //    return data;
        //}, function (err) {
        //    console.log('Error at zSrv_ResourceServer (getURL): ' + err);
        //    return null;
        //});
    }

    sf.loadData = _loadData;
    sf.getURL = _getURL;

    return sf;
}]);
