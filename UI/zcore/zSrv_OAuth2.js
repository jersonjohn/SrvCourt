angular.module("zSrv_OAuth2", ["zApp_Config"])
//.constant("zConst_accessPermit", "AccessPermit")
//.constant('zConst_AuthSettings', {
//    apiServiceBaseUri: 'http://localhost:26264/',
//    //apiServiceBaseUri: 'http://192.168.1.41:5006/',
//    //apiServiceBaseUri: 'https://secure.amesunited.com/',
//    clientId: 'ngAuthApp'
//})
.service("zSrv_OAuth2", ['$rootScope', '$http', '$window', '$q', 'zApp_Config', // 'zConst_AuthSettings', 'zConst_accessPermit',
    function ($rootScope, $http, $window, $q, zApp_Config) { //, zConst_AuthSettings, zConst_accessPermit) {

    var authServiceFactory = {};
    var zConst_AuthSettings = zApp_Config.OAuth2;
    var zConst_accessPermit = zApp_Config.AccessPermit;
    var serviceBase = zConst_AuthSettings.BaseUri;
    
    var _OAuth2 = zApp_Config.OAuth2;
    var _Client = zApp_Config.Client;
    var _MyProfile = {};


    var _httpGet = function (serviceURL, parameters) {
        var deferred = $q.defer();

        $http.get(serviceBase + serviceURL, parameters).success(function (response) {
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

        $http.post(serviceBase + serviceURL, parameters).success(function (response) {
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

        $http.put(serviceBase + serviceURL, parameters).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _httpDelete = function (serviceURL) {
        var deferred = $q.defer();

        $http.delete(serviceBase + serviceURL).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _getClientId = function () {
        return zConst_AuthSettings.clientId;
    }

    var _logIn = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + encodeURIComponent(loginData.password);

        loginData.useRefreshTokens = true;    //always
        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + zConst_AuthSettings.clientId;
        }

        var deferred = $q.defer();
        var authorizationData;
        //var sentData = encodeURIComponent(data);

       // $http.post(serviceBase + 'token', sentData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': _Client.BaseUri  } }).success(function (response) {
        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Access-Control-Allow-Origin': _Client.BaseUri } }).success(function (response) {
            if (loginData.useRefreshTokens) {
                authorizationData = { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true, isAuth: true };
            }
            else {
                authorizationData = { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false, isAuth: true };
            }
            var status = 'In';
            $http.post(serviceBase + 'Admin/LogLogOn', { status: status }, {
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + authorizationData.token
                }
            }).success(function () { 
                
            });
            deferred.resolve(authorizationData);
        }).error(function (err, status) {
            //_logOut();
            var comment = 'LOGIN FAILED: userName: ' + loginData.userName + ' with password: ' + loginData.password;
            var logData = {
                Id: 0,
                DurationMSec: 0,
                Host: serviceBase,
                Path: '/token',
                HttpMethod: 'POST',
                RequestData: data,
                ResponseData: comment,
                ResponseStatus: '401',
                SizeByte: 999,
            }
            _logActivity(logData);
            deferred.reject(err);
        });
        //.then(function () {
        //    var status = 'In';
        //    _httpPost('Admin/LogLogOn', { status: status });
            //$http.post(serviceBase + 'Admin/LogLogOn', { status: status }, {
            //    headers: {
            //        'Content-Type': 'application/x-www-form-urlencoded',
            //        'Authorization': 'Bearer ' + token
            //    }
            //})
        //});

        return deferred.promise;
    };

    var _afterLogInEvent = function (promise, token) {
        
        promise.then(function () {
            $http.post(serviceBase + 'Admin/LogLogOn', {status: status}, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token
                }
            });
        });
    };

    var _logOut = function () {
        //localStorageService.remove('authorizationData');
        //authorizationData = {};
        var field_caching = {
            dataFormFields: $rootScope.dataFormFields,
            dataListFields: $rootScope.dataListFields,
            dataListFieldItems: $rootScope.dataListFieldItems
        };
        _postCookieStore('field::' + $rootScope.thisToken.userName, JSON.stringify(field_caching));
        var status = 'Out';
        return _httpPost('Admin/LogLogOn', {status: status});//, status, {
            //headers: {
                //'Content-Type': 'application/x-www-form-urlencoded'
                //'Authorization': 'Bearer ' + $rootScope.token
            //}
            //})
        //.success(function (value) { console.log(value); });
    };

    var _startAccess = function (directURL, authorizationData) {
        authorizationData.directURL = directURL;
        _postForm(zConst_accessPermit, authorizationData, "POST");
    };

    var _refreshToken = function (authorizationData) {
        var deferred = $q.defer();

        var authData = authorizationData;
        console.log("zSrv_OAuth2 - Refreshing Token.");
        if (authData) {
            if (authData.useRefreshTokens) {
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + zConst_AuthSettings.clientId;
                console.log("zSrv_OAuth2 - Refreshing Token data = " + data);

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                    authData = { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true, isAuth: true };
                    deferred.resolve(authData);
                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _forgetPassword = function (userName) {
        var deferred = $q.defer();
        if (userName) {
            //var data = "model=" + authorizationData;
            //$http.post(serviceBase + 'api/Account/ForgetPassword', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            $http.post(serviceBase + 'admin/ForgotPassword', {userName: userName}).success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

        };
        return deferred.promise;
    };

    var _getProfile = function (userName) {
        return _httpPost('Admin/MyProfile', { userName: userName });
    }

    var _fetchProfile = function (userName) {
        return _httpPost('Admin/GetProfile', { userName: userName });
    }

    var _postCookieStore = function (key, value) {
        return _httpPost('api/CookieStores', { Name: key, Value: value});
    }

    var _saveUserProfile = function (user) {
        return _httpPost('Admin/SaveUserProfile', user);
    }

    var _createUserProfile = function (user) {
        //return _httpPost('Admin/CreateUserProfile', user);
        var deferred = $q.defer();

        $http.post(serviceBase + 'Admin/CreateUserProfile', {user: user}).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _changePassword = function (changeData) {
        return _httpPost('Admin/ChangePassword', changeData);
    }

    var _listUsers = function (id) {
        return _httpPost('Admin/ListUsers', {referId: id});
    }

    var _deleteUser = function (userName) {
        return _httpPost('Admin/DeleteUserProfile', { userName: userName });
    }


    //functions for /Roles/...
    var _listRoles = function (id) {
        return _httpPost('Roles/List', {referId: id, power: $rootScope.MyProfile.Power});
    }

    var _listRolesOptionData = function () {
        return _httpPost('Roles/ListRolesOptionData', {});
    }

    var _getRole = function (roleId) {
        return _httpPost('Roles/Detail', { id: roleId });
    }

    var _updateRole = function (role) {
        return _httpPost('Roles/Update', role);
    }

    var _createRole = function (role) {
        return _httpPost('Roles/Create', role);
    }

    var _deleteRole = function (roleId) {
        return _httpPost('Roles/Delete', { id: roleId });
    }

    var _listUsersByRoleId = function (roleId) {
        return _httpPost('Roles/ListUsersByRoleId', { id: roleId });
    }

    var _listRolesByUserId = function (userId) {
        return _httpPost('Roles/ListRolesByUserId', { id: userId });
    }

    var _mapUserToRoles = function (userId, roles) {
        return _httpPost('Roles/MapUserToRoles', { userId: userId, selectedRoles: roles });
    }

    var _removeUserToRoles = function (userId, roles) {
        return _httpPost('Roles/RemoveUserToRoles', { userId: userId, selectedRoles: roles });
    }

    //var _addClientUser = function (clientUser) {
    //    return _httpPost('api/ClientUsers',  clientUser );
    //}

    //var _removeClientUser = function (id) {
    //    return _httpDelete('api/ClientUsers/' + id);
    //};

    //var _setUserRoles = function (userId, roles) {
    //    return _httpPost('Admin/SetUserRoles', { userId: userId, roles: roles });
    //};


    var _updateBatchUserRoles = function (changeDataSet) {
        return _httpPost('Admin/UpdateBatchUserRoles', { changeDataSet: changeDataSet });
    };
    
    var _updateBatchClientUser = function (changeAllowSet) {
        return _httpPost('api/ClientUsers', changeAllowSet );
    }

    var _getMenus = function () {
        return _httpGet('Admin/GetMenus', {});
    }

    var _createAccessGrants = function () {
        var result = [];
        for (m in $rootScope.menus) {
            if ($rootScope.menus[m].Type == 'item') {
                var accessGrants = $rootScope.menus[m].AccessGrants;
                result[$rootScope.menus[m].URL] = "";
                for (a in accessGrants) {
                    result[$rootScope.menus[m].URL] += accessGrants[a].accessGrant + ',';
                }
            }
        }
        $rootScope.menusAccessGrants = result;
    }

    var _getMenuAccessGrants = function (group) {
        if (!$rootScope.menusAccessGrants) {
            $rootScope.OAuthAccessGrants = null;
            return;
        }

        //group.OAuthAccessGrants = $rootScope.OAuthAccessGrants;
        var pathName = group.ngLocation.path().split('/');
        if (pathName[1].length > 0) {
            var p = '/' + pathName[1];
            if ($rootScope.menusAccessGrants[p]) {
          //      group.OAuthAccessGrants = $rootScope.menusAccessGrants[p];
                $rootScope.OAuthAccessGrants = $rootScope.menusAccessGrants[p];
            }
        } else {
                $rootScope.OAuthAccessGrants = "Admin";
        }
    }

    //var _accessGrantControl = function (btnName) {
    //    var acc = $rootScope.OAuthAccessGrants;
    //    switch (btnName) {
    //        case 'ZBtn_Save':
    //            if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
    //                return true;
    //            break;
    //        case 'ZBtn_Update':
    //            if (acc.indexOf('Admin') != -1 || acc.indexOf('Update') != -1 )
    //                return true;
    //            break;
    //        case 'ZBtn_New':
    //            if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
    //                return true;
    //            break;
    //        case 'ZBtn_CloneNew':
    //            if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
    //                return true;
    //            break;
    //        case 'ZBtn_Delete':
    //            if (acc.indexOf('Admin') != -1 || acc.indexOf('Delete') != -1)
    //                return true;
    //            break;
    //        default:
    //            return true;
    //    }
    //    return false;
    //}

    var _logActivity = function (data) {
        return _httpPost('Admin/LogUserActivity', { logData: data });
    };

    var _getStringByteLen = function (normal_val) {
        // Force string type
        normal_val = String(normal_val);

        var byteLen = 0;
        for (var i = 0; i < normal_val.length; i++) {
            var c = normal_val.charCodeAt(i);
            byteLen += c < (1 << 7) ? 1 :
                       c < (1 << 11) ? 2 :
                       c < (1 << 16) ? 3 :
                       c < (1 << 21) ? 4 :
                       c < (1 << 26) ? 5 :
                       c < (1 << 31) ? 6 : Number.NaN;
        }
        return byteLen;
    };

    var _getRouteForThisClient = function () {
        return _httpGet('Admin/GetAppRunRoutes', {});
    };

    var _storeModelInMemory = function (obj) {
        $rootScope.storedModel = obj;
    };

    var _restoreModelInMemory = function () {
        var obj = $rootScope.storedModel;
        $rootScope.storedModel = null;
        return obj;
    };

    var _storeInMemory = function (key, value) {
        if (!$rootScope.zData)
            $rootScope.zData = {};
        $rootScope.zData[key] = value;
    };

    var _restoreInMemory = function (key) {
        return $rootScope.zData[key];
    };

    var _isExistInMemory = function (key) {
        if ($rootScope.zData)
            return ($rootScope.zData[key]) ? true : false;
        else
            return false;
    };

    var _clearInMemory = function (key) {
        delete $rootScope.zData[key];
    }

    var _postForm = function (path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }

    authServiceFactory.OAuth2 = _OAuth2;
    authServiceFactory.Client = _Client;
    authServiceFactory.MyProfile = _MyProfile;
    authServiceFactory.fetchProfile = _fetchProfile;
    authServiceFactory.getClientId = _getClientId;
    authServiceFactory.getMenuAccessGrants = _getMenuAccessGrants;
 //   authServiceFactory.accessGrantControl = _accessGrantControl;
    authServiceFactory.logIn = _logIn;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.startAccess = _startAccess;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.forgetPassword = _forgetPassword;
    authServiceFactory.getProfile = _getProfile;
    authServiceFactory.postCookieStore = _postCookieStore;
    authServiceFactory.saveUserProfile = _saveUserProfile;
    authServiceFactory.createUserProfile = _createUserProfile;
    authServiceFactory.changePassword = _changePassword;
    authServiceFactory.listUsers = _listUsers;
    authServiceFactory.deleteUser = _deleteUser;

    authServiceFactory.listRoles = _listRoles;
    authServiceFactory.listRolesOptionData = _listRolesOptionData;
    authServiceFactory.getRole = _getRole;
    authServiceFactory.updateRole = _updateRole;
    authServiceFactory.createRole = _createRole;
    authServiceFactory.deleteRole = _deleteRole;
    authServiceFactory.listUsersByRoleId = _listUsersByRoleId;
    authServiceFactory.listRolesByUserId = _listRolesByUserId;
    authServiceFactory.mapUserToRoles = _mapUserToRoles;
    authServiceFactory.removeUserToRoles = _removeUserToRoles;
    //authServiceFactory.addClientUser = _addClientUser;
    //authServiceFactory.removeClientUser = _removeClientUser;
    //authServiceFactory.setUserRoles = _setUserRoles;
    authServiceFactory.updateBatchUserRoles = _updateBatchUserRoles;
    authServiceFactory.updateBatchClientUser = _updateBatchClientUser;
    authServiceFactory.getMenus = _getMenus;
    authServiceFactory.createAccessGrants = _createAccessGrants;
    authServiceFactory.logActivity = _logActivity;
    authServiceFactory.getStringByteLen = _getStringByteLen;
    authServiceFactory.getRouteForThisClient = _getRouteForThisClient;
    authServiceFactory.storeModelInMemory = _storeModelInMemory;
    authServiceFactory.restoreModelInMemory = _restoreModelInMemory;
    authServiceFactory.storeInMemory = _storeInMemory;
    authServiceFactory.restoreInMemory = _restoreInMemory;
    authServiceFactory.isExistInMemory = _isExistInMemory;
    authServiceFactory.clearInMemory = _clearInMemory;

    authServiceFactory.httpPost = _httpPost;

    return authServiceFactory;
}]);