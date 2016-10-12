var $routeRef = null;  //for dynamically create $routeProvider at app.run()

angular.module("zPage_Home_AccessPermit", ["ngResource", "ngRoute", "zSrv_OAuth2", "zSrv_InputCustom", "zApp_Config", "zMod_OAuth2Intercept", "zDir_PreLoader", "zDir_InputCustom", "zDir_NavBar",
  //  "angularjs-dropdown-multiselect",
  //  "ui.bootstrap",
    "zSrv_Field",
    "ui.grid", "ui.grid.edit", "ui.grid.pagination", "ui.grid.exporter", "ui.grid.saveState", "ui.grid.selection", "ui.grid.pinning", "ui.grid.resizeColumns", "ui.grid.moveColumns", "ui.grid.cellNav",
    "zFilter_ArrayToString", "ui.tree", "ng-mfb",
   // "ngMaterial",
   // "zSrv_Dialog",
    "ngFileUpload", "ngImgCrop", "zSrv_CookieStore", "zDir_zuiDatePicker", "zDir_zuiMonthPicker", "zDir_zuiDateTimePicker",
    "zDir_zuiCheckBox", "zSrv_MagnificPopUp", "zDir_zuiSelectMultiple", "zDir_zFileUpload", "zDir_zImg", "zSrv_ResourceServer", "zDir_zTab", "zSrv_zNotify"
    //"zDir_zJsonText"
])


.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    
    $locationProvider.html5Mode(true);

    $routeRef = $routeProvider;
    
    $httpProvider.interceptors.push('zFtr_OAuth2BearerInject');
    
    $httpProvider.interceptors.push('zFtr_OAuth2RefreshInject');
    $httpProvider.interceptors.push('zFtr_TimeStampMarker');
    
    

}])

.controller("defaultCtrl", ['$route', '$scope', '$http', '$window', '$location', '$q', //'zVal_Token',
    '$rootScope', '$timeout', 'zSrv_OAuth2', 'zSrv_InputCustom', 'zSrv_ResourceServer', 'zSrv_MagnificPopUp',
    function ($route, $scope, $http, $window, $location, $q, //zVal_Token,
        $rootScope, $timeout, zSrv_OAuth2, zSrv_InputCustom, zSrv_ResourceServer, zSrv_MagnificPopUp) {

        
            
        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        //load field elements from FORM and LIST in local script
        zSrv_InputCustom.formFields_Initial();
        zSrv_InputCustom.listFields_Initial();

        var removeDuplicate = function (data) {
            var result = []
            var indexKey = [];
            for (d in data) {
                
                var key = data[d]['Id'] + ':' + data[d]['Parent'];
                if(!indexKey[key] || data[d]['Type']=='divider') {
                    indexKey[key] = true;
                    result.push(data[d]);
                }
            }
            return result;
        }


        $scope.refreshToken = function () {
            var result = {};
            zSrv_OAuth2.refreshToken($rootScope.thisToken).then(function (result) {
                if (result.token) {
                    $rootScope.thisToken = result;
                }
            })
        }

        $scope.logOut = function () {
            zSrv_OAuth2.logOut().then(function () {
                $window.location.href = "/";
            }, function () {
                $window.location.href = "/";
            });
            //$window.location.href = "/";
        }

        $scope.startUp = function () {
            //===================== Process 0 ========================
            var queue0 = $q.defer();
            var process0 = queue0.promise;

            zSrv_OAuth2.getRouteForThisClient().then(function (response) {
                routes = response.data;
                console.log('** Startup location.path() is ' + $location.path());
                for (var i = 0; i < routes.length; i++) {
                    $routeRef.when(routes[i]['Path'], {
                        templateUrl: routes[i]['TemplateUrl'],
                        controller: routes[i]['Controller']
                    });
                }
                $route.reload();
                queue0.resolve();
            });



            //===================== Process 1 ========================
            var queue1 = $q.defer();
            var process1 = queue1.promise;

            zSrv_OAuth2.getProfile($rootScope.thisToken.userName).then(function (response) {
                $rootScope.MyProfile = response.data;
                $rootScope.MyProfile.Power = response.maxPower;
                $rootScope.MyProfile.Roles = response.roles;

                queue1.resolve();

            }, function (err) { console.log('Process 1 (zSrv_OAuth2.getProfile) error: ' + err) });

            //===================== Process 2 ========================
            var queue2 = $q.defer();
            var process2 = queue2.promise;
            zSrv_ResourceServer.loadData().then(function () {
                $scope.ProfileImg_ApiSource = zSrv_ResourceServer.getURL('profileImageURL');
                queue2.resolve();
            }, function (err) {
                console.log("Process 2 (zSrv_ResourceServer.loadData) error: " + err);
            });

            //===================== Process 3 ========================       
            var queue3 = $q.defer();
            var process3 = queue3.promise;
            zSrv_OAuth2.getMenus().then(function (result) {
                if (result.status != 'success') {
                    var ev = null;
                    mg.showMustOk(ev, result.status, result.data).then(function () {
                        $scope.logOut();
                    }, function (err) {
                        $scope.logOut();
                    });
                }

                var data = removeDuplicate(result.data);
                $scope.menus = data;
                $rootScope.menus = data;
                zSrv_OAuth2.createAccessGrants();
                queue3.resolve();

            }, function (err) {
                console.log("Process 3 (zSrv_OAuth2.getMenus) error: " + err);
            });

            //===================== Final Process ========================
            $q.all([process0, process1, process2, process3]).then(function () {
                if ($rootScope.thisToken.directURL != "null") {
                    $location.path($rootScope.thisToken.directURL);
                    console.log("** Redirect to: >>" + $rootScope.thisToken.directURL + "<<");
                } else {
                    if ($rootScope.MyProfile.StartUpPage) {
                        $location.path($rootScope.MyProfile.StartUpPage);
                    }
                }
            });
        }

        var _closeTopRightMenuDropDown = function () {
            var element = angular.element(document.getElementById("userNameDropDown"));
            element.toggleClass('open');
        }

        $scope.friendGroupList = function () {
            //mg.modalFields = zSrv_InputCustom.formFields({ name: 'ibudgetIssueDetailBatchSystemVersion' });
            mg.isModalEdit = false;
            //mg.modalHeader = 'Batch Update';
            var view = '/Templates/OA2/zMV_FriendGroupList.html';
            var ev = null;
            mg.zModal = {};
            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('userURL')).then(function (resp) {
                if (resp.status == 'success') {
                    mg.zModal = resp.data;
                    
                    mg.showModal($scope, ev, view, false).then(function (answer) {
                

                    }, function (err) {
                        grp.alerts.push({ type: "danger", msg: err });
                    });
                }
                    
            }, function (err) {
                grp.alerts.push({ type: "danger", msg: err });
            });
            //mg.gridOptions = {};
            //mg.gridOptions.data = [];
            //for (r in grp.gridOptions.selectedRows)
            //    mg.gridOptions.data.push(grp.gridOptions.selectedRows[r]);
            //mg.gridOptions.columnDefs = [
            //  { name: 'Id', width: 70 },
            //  { name: 'UserIssueLogId', displayName: 'Issue Log Id', width: 150 },
            //  { name: 'IBudgetSystemVersionName', displayName: 'System Version', width: 160 },
            //  //{ name: 'IBudgetStatusName', displayName: 'Status', width: 100 },
            //  //{ name: 'Description' },
            //];

            
        }

        

        $scope.gotoMyProfile = function (myprofileURL) {
            $location.path('/myProfile');
            _closeTopRightMenuDropDown();
        }

        $scope.alerts = [];
        mg.login = function (loginData) {
            zSrv_OAuth2.logIn(loginData).then(function (OAuth2_Token) {
                console.log("Logged In successfully.");
                $rootScope.thisToken = OAuth2_Token;
                $rootScope.thisToken.directURL = "null";
                $scope.isLoading = false;
                $scope.startUp();
                mg.close();
                $scope.alerts = [];
            }, function (err) {
                //$scope.message = err.error_description;
                if (err != null)
                    $scope.alerts.push({ type: 'warning', msg: (err.error ? err.error : 'Invalid Username or Password!') });
                $scope.isLoading = false;
            });
        }

        $scope.goForgetPasswordPage = function () {
            //$window.location.href = '/forgetPassword';
            $location.path('/forgetPassword')
        }

        //passing variable from asp.net to angular
        $rootScope.thisToken = "Some Token"; //zVal_Token;
        $rootScope.MyProfile = {};

        
        switch ($location.path()) {
            case '/':
                mg.showModal($scope, null, '/Templates/OA2/zMV_Login.html', true, 'mfp-fullscale mfp-login', 'username').then(function (loginData) {

                }, function (err) {
                    grp.alerts.push({ type: "danger", msg: err });
                });
                break;
            case '/forgetPassword':
                mg.showModal($scope, null, '/Templates/OA2/zMV_ForgetPassword.html', true, 'mfp-fullscale mfp-login', 'username').then(function (answer) {

                }, function (err) {
                    grp.alerts.push({ type: "danger", msg: err });
                });
                break;
        }

        

        
    }])
 
.run(['$route', '$http', '$rootScope', 'zSrv_OAuth2', '$location', function ($route, $http, $rootScope, zSrv_OAuth2, $location) {

    
    $routeRef.when('/forgetPassword', {
        templateUrl: '/Templates/OA2/zView1.html',
        controller: 'defaultCtrl'
    });
   
}]);
