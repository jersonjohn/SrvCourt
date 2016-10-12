angular.module("zSrv_Field", [])
.service("zSrv_Field", ['$http', '$q', '$rootScope', 'zSrv_OAuth2', function ($http, $q, $rootScope, zSrv_OAuth2) {

    var sF = {};

    var _getFormFieldCode = function (name) {
        return $rootScope.dataFormFields[name];
    }

    var _addFormField = function (name, fields) {
        $rootScope.dataFormFields[name] = [];
        angular.copy(angular.fromJson(fields), $rootScope.dataFormFields[name]);
    }

    var _downloadFormFields = function (q) {
        //if($rootScope.dataFormFields[q.data] == undefined) {
            //get and set the value to the group variables without return the value
        _httpGet("oauth2/api/Fields", { name: q.data, type: 'FormField' }).then(function (d) {
            _addFormField(q.data, d['Code']);
            q.copyToGroup[q.groupItem] = [];
            angular.copy($rootScope.dataFormFields[q.data], q.copyToGroup[q.groupItem]);
            q.deferred.resolve();
        });
        //} else {
        //    q.copyToGroup[q.groupItem] = [];
        //    angular.copy($rootScope.dataFormFields[q.data], q.copyToGroup[q.groupItem]);
        //    q.deferred.resolve();
        //}
    }

    var _getFormFields = function (grp) {
        var queue0 = $q.defer();
        var process0 = queue0.promise;

        var downloadList = [];
        var list_toLoad = [];
        var promiseArray = []
        //var deferredName = $q.defer();
        //downloadList.push({deferred: deferredName, promise: deferredName.promise, data: grp.name });

        if (grp == null) {
            queue0.resolve();
        } else if (angular.isArray(grp)) {
            queue0.resolve(grp);
        } else if (angular.isString(grp)) {
            var t = grp;
            if (t.indexOf('~>') == 0) {
                t = t.slice(2);
                //get and return the value
                _httpGet("oauth2/api/Fields", { name: t, type: 'FormField' }).then(function (d) {
                    _addFormField(t, d['Code']);
                    queue0.resolve($rootScope.dataFormFields[t]);
                    //q.copyToGroup[q.groupItem] = [];
                    //angular.copy($rootScope.dataFormFields[q.data], q.copyToGroup[q.groupItem]);
                    //q.deferred.resolve();
                });
            } else
                queue0.resolve();

        } else if(angular.isObject(grp)) {
            //auto check grp.name field is download without requesting
            //var downloadName = [];
            //var formName = grp['name'];
            //if ($rootScope.dataFormFields[formName] == undefined) {
            //    var deferred = $q.defer();
            //    downloadList.push({ deferred: deferred, data: grp.name, copyToGroup: grp, groupItem: 'formfields' });
            //    promiseArray.push(deferred.promise);
            //};
            for (var item in grp) {
                if (angular.isString(grp[item])) {
                    if (grp[item].indexOf('~>') == 0) {
                        var deferred = $q.defer();
                        downloadList.push({ deferred: deferred, data: grp[item].slice(2), copyToGroup: grp, groupItem: item });
                        promiseArray.push(deferred.promise);
                    } else if (grp[item].indexOf('~-') == 0) {
                        var deferred = $q.defer();
                        list_toLoad.push({ deferred: deferred, data: grp[item].slice(2) });
                        promiseArray.push(deferred.promise);
                    }
                }
            }

            for (var d = 0; d < downloadList.length; d++) {
                _downloadFormFields(downloadList[d]);
            }

            for (var L = 0; L < list_toLoad.length; L++) {
                _downloadListFields(list_toLoad[L]);
            }

            $q.all(promiseArray).then(function () {
                queue0.resolve();
            });
        } else {
            queue0.resolve();
        }
        //if (_formFields({ name: grp.name }) == undefined) {
        //    _httpGet("oauth2/api/Fields", { name: grp.name }).then(function (d) {
        //        _addFormField(grp.name, d['Code']);
        //        queue0.resolve();
        //    });
        //} else {
        //    queue0.resolve();
        //}
        return process0
    }

    var _getDataFormFieldArray = function () {
        var a = []
        for (f in $rootScope.dataFormFields) {
            var elem = { Id: f, Name: f };
            a.push(elem);
        }
        return a;
    }



    //---------------- LISTFIELDS ----------------------

    var _getListFieldCode = function (name) {
        return $rootScope.dataListFields[name];
    }

    var _addListFieldItems = function (name, fields) {
        $rootScope.dataListFieldItems[name] = [];
        angular.copy(angular.fromJson(fields), $rootScope.dataListFieldItems[name]);
    }
    
    var _downloadListFields = function (q) {
        if ($rootScope.dataListFields[q.data])
            q.deferred.resolve();
            
        _httpGet("oauth2/api/FieldElementMappings", { name: q.data }).then(function (d) {
            var id = d['FieldElementMasterId'] + '';
            $rootScope.dataListFields[q.data] = id;
            if ($rootScope.dataListFieldItems[id] == undefined) {
                _httpGet("oauth2/api/Fields", { id: id }).then(function (f) {
                    _addListFieldItems(id, f['Code']);
                    q.deferred.resolve();
                });
            } else
                q.deferred.resolve();

        }, function () {
            q.deferred.resolve();
        });
    }

    //load into rootScope.dataListFields first - Not required - build together into getFormField
    //var _getListFields = function (grp) {
    //    var queue0 = $q.defer();
    //    var process0 = queue0.promise;
    //    var downloadList = [];
    //    var promiseArray = []
    //    if (angular.isString(grp)) {
    //        var t = grp;
    //        if (t.indexOf('~-') == 0) {
    //            t = t.slice(2);
    //            //get and return the value
    //            _httpGet("oauth2/api/Fields", { name: t, type: 'ListField' }).then(function (d) {
    //                _addListField(t, d['Code']);
    //                queue0.resolve($rootScope.dataListFields[t]);
    //            });
    //        } else
    //            queue0.resolve();
    //    } else if (angular.isObject(grp)) {
    //        for (var item in grp) {
    //            if (angular.isString(grp[item])) {
    //                if (grp[item].indexOf('~-') == 0) {
    //                    var deferred = $q.defer();
    //                    downloadList.push({ deferred: deferred, data: grp[item].slice(2), copyToGroup: grp, groupItem: item });
    //                    promiseArray.push(deferred.promise);
    //                }
    //            }
    //        }
    //        for (var d = 0; d < downloadList.length; d++) {
    //            _downloadListFields(downloadList[d]);
    //        }
    //        $q.all(promiseArray).then(function () {
    //            queue0.resolve();
    //        });
    //    } else {
    //        queue0.resolve();
    //    }
    //    return process0
    //}


    var _loadData = function (userId) {
       // var oauth2URL = zSrv_OAuth2.OAuth2.BaseUri;
        var deferred = $q.defer();
        zSrv_OAuth2.httpPost("admin/FieldElementCache", { userName: userId }).then(function (result) {
            if (result.status == 'serialize') {
                var f = JSON.parse(result.data);
                if(f.dataFormFields)
                    $rootScope.dataFormFields = f.dataFormFields;
                if(f.dataListFields)
                    $rootScope.dataListFields = f.dataListFields;
                if (f.dataListFieldItems)
                    $rootScope.dataListFieldItems = f.dataListFieldItems;
            }
            deferred.resolve();
            console.log('data load for Fields & List Elements completed.')
        }, function (err) {
            deferred.reject();
            console.log('Error at zSrv_Field (loadData): ' + err);
            data = {};
        });
        return deferred.promise;
    }


    var _httpGet = function (serviceURL, parameters) {
        var deferred = $q.defer();

        if (serviceURL.indexOf('oauth2/') == 0)
            serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

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




    sF.getFormFields = _getFormFields;
    sF.getDataFormFieldArray = _getDataFormFieldArray;
    sF.getFormFieldCode = _getFormFieldCode;
    sF.addFormField = _addFormField;
    sF.loadData = _loadData;

    //sF.getDataListFieldArray = _getDataListFieldArray;
    sF.getListFieldCode = _getListFieldCode;
    //sF.addListFieldItems = _addListFieldItems;

    return sF;

}]);