angular.module("eSupport_Services", [])
.service("eSupport_Services", ['zSrv_InputCustom', 'zSrv_ResourceServer', '$q', 'zSrv_OAuth2', function (zSrv_InputCustom,zSrv_ResourceServer, $q, zSrv_OAuth2) {

            //service factory
            var sf = {};

            var data = {};
            var eSupportDepts = {};
            var eSupportStatuses = {};
            var eSupportOutlets = {};
            var eSupportPriorities = {};
            var eSupportIssueCategories = {};
            var eSupportUsers = {};


            var _loadData = function (WorgroupId) {
                //var oauth2URL = zSrv_OAuth2.OAuth2.BaseUri;
                //var deferred = $q.defer();

                var eSuppUrl = zSrv_ResourceServer.getURL('eSupportDeptsUrl');

                console.log("eSuppUrl : " + eSuppUrl);


                /* Load Departments */
                var queue0 = $q.defer();
                var process0 = queue0.promise;

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportDeptsUrl'), {}).then(function (respDept) {
                    eSupportDepts = respDept;
                    queue0.resolve();
                }, function (err) {
                    queue0.reject();
                    console.log('Error at eSupport_Services (Depts loadData): ' + err);
                    data = {};
                });

                /* Load StatusS */
                var queue1 = $q.defer();
                var process1 = queue1.promise;

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportStatusDetailsUrl')+'?referId=1', {}).then(function (respStatuses) {
                    eSupportStatuses = respStatuses;
                    queue1.resolve();
                }, function (err) {
                    queue1.reject();
                    console.log('Error at eSupport_Services (Status loadData): ' + err);
                    data = {};
                });
        

                /* Load Otlets */
                var queue2 = $q.defer();
                var process2 = queue2.promise;

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportOutletsUrl'), {}).then(function (respOutlets) {
                    eSupportOutlets = respOutlets;
                    queue2.resolve();
                }, function (err) {
                    queue2.reject();
                    console.log('Error at eSupport_Services (Outlets loadData): ' + err);
                    data = {};
                });

                /* Load Otlets */
                var queue3 = $q.defer();
                var process3 = queue3.promise;

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportPriorityDetailsUrl')+'?referId=1', {}).then(function (respPriorities) {
                    eSupportPriorities = respPriorities;
                    queue3.resolve();
                }, function (err) {
                    queue3.reject();
                    console.log('Error at eSupport_Services (Priorities loadData): ' + err);
                    data = {};
                });
        

                /* Load IssueCategories  */
                var queue4 = $q.defer();
                var process4 = queue4.promise;

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eSupportIssueCategoryUrl')+'?referId=1', {}).then(function (respIssueCategories) {
                    eSupportIssueCategories = respIssueCategories;
                    queue4.resolve();
                }, function (err) {
                    queue4.reject();
                    console.log('Error at eSupport_Services (eSupportIssueCategories loadData): ' + err);
                    data = {};
                });


                /* Load Users */
                var queue5 = $q.defer();
                var process5 = queue5.promise;

                console.log("Client URL :" + zSrv_ResourceServer.getURL('clientUserURL'));

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('clientUserURL'), {}).then(function (respUsers) {
                    eSupportUsers = respUsers;
                    queue5.resolve();
                }, function (err) {
                    queue5.reject();
                    console.log('Error at eSupport_Services (eSupportIssueCategories loadData): ' + err);
                    data = {};
                });

                return $q.all([process0, process1, process2, process3,process4,process5]);
            }
 
            var _getDepts = function(){
                return eSupportDepts;
            }

            var _getStatus = function(){
                return eSupportStatuses;
            }

            var _getOutlets = function () {
                return eSupportOutlets;
            }

            var _getPriorities = function(){
                return eSupportPriorities;
            }

            var _getCategories = function(){
                return eSupportIssueCategories;
            }

            var _getUsers = function(){
                return eSupportUsers;
            }

            sf.loadData = _loadData;
            sf.getDepts = _getDepts ;
            sf.getStatus = _getStatus;
            sf.getOutlets = _getOutlets;
            sf.getPriorities = _getPriorities;
            sf.getCategories = _getCategories;
            sf.getUsers = _getUsers;

            return sf;
     
       
}]);
