'use strict';
//mainController
define(['app'], function (app) {

    var injectParams = ['$route', '$scope', '$http', '$window', '$location', '$q', 'routeResolver', //'zVal_Token',
                        '$rootScope', '$timeout', 'zSrv_OAuth2', 'zSrv_InputCustom', 'zSrv_ResourceServer', 'zSrv_Field', 'zSrv_MagnificPopUp', 'zSrv_zNotify'];

    var mainController = function ($route, $scope, $http, $window, $location, $q, routeResolver,  //zVal_Token,
                        $rootScope, $timeout, zSrv_OAuth2, zSrv_InputCustom, zSrv_ResourceServer, zSrv_Field, zSrv_MagnificPopUp, zSrv_zNotify) {

        var vm = this;

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;
        $scope.loginButtonLabel = 'LOG IN';
        $scope.btnResetName = "Reset";

        //load field elements from FORM and LIST in local script
        zSrv_InputCustom.formFields_Initial();
        zSrv_InputCustom.listFields_Initial();

        var removeDuplicate = function (data) {
            var result = []
            var indexKey = [];
            for (var d in data) {

                var key = data[d]['Id'] + ':' + data[d]['Parent'];
                if (!indexKey[key] || data[d]['Type'] == 'divider') {
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

        $rootScope.logOut = function () {
            zSrv_OAuth2.logOut().then(function () {
                $window.location.href = "/";
            }, function () {
                $window.location.href = "/";
            });
        }

        $scope.startUp = function () {
            //===================== Process 0 ========================
            var queue0 = $q.defer();
            var process0 = queue0.promise;

            zSrv_OAuth2.getRouteForThisClient().then(function (response) {
                var routes = null;
                if (response.status == 'success') {
                    routes = response.data;
                    zSrv_OAuth2.postCookieStore('route::' + zSrv_OAuth2.getClientId(), JSON.stringify(routes));
                } else if (response.status == 'serialize') {
                    routes = JSON.parse(response.data);
                }

                var routeRef = app.register.route;
                //var r = routeResolver;
                console.log('** Startup location.path() is ' + $location.path());
                for (var i = 0; i < routes.length; i++) {
                    //routeRef.when(routes[i]['Path'], {
                    //    templateUrl: routes[i]['TemplateUrl'],
                    //    controller: routes[i]['Controller']
                    //});

                    routeRef.when(routes[i]['Path'], routeResolver.route.resolve(routes[i]['GroupName'], routes[i]['ProjectName'] + '/', 'vm', routes[i]['TemplateUrl'], routes[i]['Dependencies']));
                }
                $route.reload();
                queue0.resolve();
            });



            //===================== Process 1 ========================
            var queue1 = $q.defer();
            var process1 = queue1.promise;

            zSrv_OAuth2.fetchProfile($rootScope.thisToken.userName).then(function (response) {
                if (response.status == 'success') {
                    var cookieValue = { applicationUser: response.data, power: response.maxPower, applicationRoles: response.roles };
                    zSrv_OAuth2.postCookieStore('user::' + $rootScope.thisToken.userName, JSON.stringify(cookieValue));
                    $rootScope.MyProfile = response.data;
                    $rootScope.MyProfile.Power = response.maxPower;
                    $rootScope.MyProfile.Roles = response.roles;
                } else if (response.status == 'serialize') {
                    var obj = JSON.parse(response.data);
                    $rootScope.MyProfile = obj.applicationUser;
                    $rootScope.MyProfile.Power = obj.power;
                    $rootScope.MyProfile.Roles = obj.applicationRoles;
                }

                queue1.resolve();

            }, function (err) { console.log('Process 1 (zSrv_OAuth2.getProfile) error: ' + err) });

            //===================== Process 2 ========================
            var queue2 = $q.defer();
            var process2 = queue2.promise;
            zSrv_ResourceServer.loadData().then(function () {
                $rootScope.ProfileImg_ApiSource = zSrv_ResourceServer.getURL('profileImageURL');
                queue2.resolve();
            }, function (err) {
                console.log("Process 2 (zSrv_ResourceServer.loadData) error: " + err);
            });

            //===================== Process 2.1 ========================
            var queue2_1 = $q.defer();
            var process2_1 = queue2_1.promise;
            zSrv_Field.loadData($rootScope.thisToken.userName).then(function () {
                
                queue2_1.resolve();
            }, function (err) {
                console.log("Process 2.1 (zSrv_Field.loadData) error: " + err);
            });

            //===================== Process 3 ========================       
            var queue3 = $q.defer();
            var process3 = queue3.promise;
            var data = null;
            zSrv_OAuth2.getMenus().then(function (result) {
                if (result.status == 'success') {
                    data = removeDuplicate(result.data);
                    zSrv_OAuth2.postCookieStore('menu::' + $rootScope.thisToken.userName, JSON.stringify(data));
                } else if (result.status == 'serialize') {
                    data = JSON.parse(result.data);
                } else {
                    var ev = null;
                    mg.showMustOk(ev, result.status, result.data).then(function () {
                        $scope.logOut();
                    }, function (err) {
                        $scope.logOut();
                    });
                }

                // var data = removeDuplicate(result.data);
                $scope.menus = data;
                $rootScope.menus = data;
                zSrv_OAuth2.createAccessGrants();
                // debugger;
                queue3.resolve();

            }, function (err) {
                console.log("Process 3 (zSrv_OAuth2.getMenus) error: " + err);
            });

            //===================== Final Process ========================
            $q.all([process0, process1, process2, process2_1, process3]).then(function () {
                // debugger;
                $rootScope.refreshImage = true;
                $scope.group = {
                    'ngLocation': $location
                }
                zSrv_OAuth2.getMenuAccessGrants($scope.group);
                var startPage = $scope.directLink ? $scope.directLink : $rootScope.MyProfile.StartUpPage;
                //if ($rootScope.thisToken.directURL != 'null') {

                //  var directLink = $rootScope.thisToken.directURL;
                //  $rootScope.thisToken.directURL = 'null';
                if (startPage) {
                    //     debugger;
                    $location.path(startPage);
                    console.log("** Redirect to: >>" + startPage + "<<");
                }
                //} else {
                //    if ($rootScope.MyProfile.StartUpPage) {
                //        $location.path($rootScope.MyProfile.StartUpPage);
                //    }
                //}
            });
        }

        $scope.startUpDirectLink = function () {
            //===================== Process 0 ========================
            var queue0 = $q.defer();
            var process0 = queue0.promise;

            zSrv_OAuth2.getRouteForThisClient().then(function (response) {
                var routes = null;
                if (response.status == 'success') {
                    routes = response.data;
                    zSrv_OAuth2.postCookieStore('route::' + zSrv_OAuth2.getClientId(), JSON.stringify(routes));
                } else if (response.status == 'serialize') {
                    routes = JSON.parse(response.data);
                }

                var routeRef = app.register.route;
                //var r = routeResolver;
                console.log('** Startup location.path() is ' + $location.path());
                for (var i = 0; i < routes.length; i++) {
                    //routeRef.when(routes[i]['Path'], {
                    //    templateUrl: routes[i]['TemplateUrl'],
                    //    controller: routes[i]['Controller']
                    //});

                    routeRef.when(routes[i]['Path'], routeResolver.route.resolve(routes[i]['GroupName'], routes[i]['ProjectName'] + '/', 'vm', routes[i]['TemplateUrl'], routes[i]['Dependencies']));
                }
                $route.reload();
                queue0.resolve();
            });

            //===================== Process 1 ========================
            //var queue1 = $q.defer();
            //var process1 = queue1.promise;

            //zSrv_OAuth2.getProfile($rootScope.thisToken.userName).then(function (response) {
            //    $rootScope.MyProfile = response.data;
            //    $rootScope.MyProfile.Power = response.maxPower;
            //    $rootScope.MyProfile.Roles = response.roles;


            //    queue1.resolve();

            //}, function (err) { console.log('Process 1 (zSrv_OAuth2.getProfile) error: ' + err) });

            //===================== Process 2 ========================
            var queue2 = $q.defer();
            var process2 = queue2.promise;
            zSrv_ResourceServer.loadData().then(function () {
                // $rootScope.ProfileImg_ApiSource = zSrv_ResourceServer.getURL('profileImageURL');
                queue2.resolve();
            }, function (err) {
                console.log("Process 2 (zSrv_ResourceServer.loadData) error: " + err);
            });

            //===================== Process 2.1 ========================
            var queue2_1 = $q.defer();
            var process2_1 = queue2_1.promise;
            zSrv_Field.loadData($rootScope.thisToken.userName).then(function () {

                queue2_1.resolve();
            }, function (err) {
                console.log("Process 2.1 (zSrv_Field.loadData) error: " + err);
            });

            //===================== Process 3 ========================       
            //var queue3 = $q.defer();
            //var process3 = queue3.promise;
            //zSrv_OAuth2.getMenus().then(function (result) {
            //    if (result.status != 'success') {
            //        var ev = null;
            //        mg.showMustOk(ev, result.status, result.data).then(function () {
            //            $scope.logOut();
            //        }, function (err) {
            //            $scope.logOut();
            //        });
            //    }

            //    var data = removeDuplicate(result.data);
            //    $scope.menus = data;
            //    $rootScope.menus = data;
            //    zSrv_OAuth2.createAccessGrants();
            //    // debugger;
            //    queue3.resolve();

            //}, function (err) {
            //    console.log("Process 3 (zSrv_OAuth2.getMenus) error: " + err);
            //});

            //===================== Final Process ========================
            $q.all([process0, process2, process2_1]).then(function () {
                // debugger;
                $rootScope.refreshImage = true;
                $rootScope.byPassAccessGrants = "Admin";
                $scope.group = {
                    'ngLocation': $location
                }
                zSrv_OAuth2.getMenuAccessGrants($scope.group);
                var startPage = $scope.directLink ? $scope.directLink : $rootScope.MyProfile.StartUpPage;
                //if ($rootScope.thisToken.directURL != 'null') {

                //  var directLink = $rootScope.thisToken.directURL;
                //  $rootScope.thisToken.directURL = 'null';
                if (startPage) {
                    //     debugger;
                    $location.path(startPage);
                    console.log("** Redirect to: >>" + startPage + "<<");
                }
                //} else {
                //    if ($rootScope.MyProfile.StartUpPage) {
                //        $location.path($rootScope.MyProfile.StartUpPage);
                //    }
                //}
            });
        }


        var _closeTopRightMenuDropDown = function () {
            var element = angular.element(document.getElementById("userNameDropDown"));
            element.toggleClass('open');
        }

        $scope.friendGroupList = function () {
            mg.isModalEdit = false;
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
        }

        $rootScope.gotoMyProfile = function rootScope_gotoMyProfile() {
            $location.path('/myProfile');
            _closeTopRightMenuDropDown();
        }

        $scope.alerts = [];
        mg.login = function (loginData) {
            //$rootScope.loginStatus = 'logging';
            $scope.loginButtonLabel = 'Logging ...';
            $scope.submittedLogin = true;
            zSrv_OAuth2.logIn(loginData).then(function (OAuth2_Token) {
                //$rootScope.loginStatus = 'success';
                console.log("Logged In successfully.");
                $rootScope.thisToken = OAuth2_Token;
                $rootScope.thisToken.directURL = "null";
                $scope.isLoading = false;
                $scope.startUp();
                mg.close();
                $scope.alerts = [];
            }, function (err) {
                //$rootScope.loginStatus = 'failed';
                //$scope.message = err.error_description;
                $scope.submittedLogin = false;
                $scope.loginButtonLabel = 'TRY AGAIN';
                //if (err != null)
                $scope.alerts.push({ type: 'warning', msg: 'Invalid Username or Password!' });
                $scope.isLoading = false;
            });
        }

        $scope.forgetPassword = function () {
            $scope.alerts = [];
            if ($scope.btnResetName == 'Processing...') return;
            else if ($scope.btnResetName == 'Email sent') {
                $location.path('/');
                return;
            } else {
                $scope.btnResetName = 'Processing...';
            }
            zSrv_OAuth2.forgetPassword($scope.loginData.userName).then(function (response) {
                $scope.btnResetName = 'Email sent';
                $scope.resetPasswordCode = response.data;
                $scope.alerts.push({ type: response.status, msg: 'Reset successful, pls check your email to set new password.' });

            }, function (err) {
                $scope.btnResetName = 'Try Again';
                if (!err)
                    $scope.alerts.push({ type: "warning", msg: "Server no response or timeout." });
                else
                    $scope.alerts.push({ type: 'warning', msg: err });
            });
        };

        $scope.goForgetPasswordPage = function () {
            //$window.location.href = '/forgetPassword';
            $location.path('/forgetPassword')
        }

        //passing variable from asp.net to angular
        // $rootScope.thisToken = $rootScope.thisToken || null; //zVal_Token;
        // $rootScope.MyProfile = $rootScope.MyProfile || {};


        if (!$rootScope.thisToken.token) {
            switch ($location.path()) {
                case '/':
                    if ($rootScope.loginStatus != 'ready') {
                        $rootScope.loginStatus = 'ready';
                        $scope.submittedLogin = false;
                        mg.showModal($scope, null, '/Scripts/app/views/oauth/zMV_Login.html', true, 'mfp-fullscale mfp-login', 'username').then(function (loginData) {

                        }, function (err) {
                            grp.alerts.push({ type: "danger", msg: err });
                        });
                    }
                    break;
                case '/forgetPassword':
                    $rootScope.loginStatus = 'forgetPassword';
                    mg.showModal($scope, null, '/Scripts/app/views/oauth/zMV_ForgetPassword.html', true, 'mfp-fullscale mfp-login', 'username').then(function (answer) {

                    }, function (err) {
                        grp.alerts.push({ type: "danger", msg: err });
                    });
                    break;
            }
        }
        //else {
        //    if($rootScope.thisToken.directURL != "null")
        //        $scope.startUp();
        //}
        // $scope.runStartUp = true;
        $scope.$on("$routeChangeSuccess", function () {
            //zSrv_InputCustom.routeChangeSuccess($scope.group);

            $timeout(function () {
                if ($rootScope.thisToken.directURL && $rootScope.thisToken.directURL != "null") {
                    //    debugger;
                    $scope.directLink = $rootScope.thisToken.directURL;
                    $rootScope.thisToken.directURL = "null";
                    $scope.startUpDirectLink();
                }
            }, 0);
        });

    };

    mainController.$inject = injectParams;

    app.register.controller('mainController', mainController);

});
