//angular.module("zPage_Home_Login", ["ngRoute", "ngMaterial", "ngMessages", "zSrv_OAuth2", "zDir_PreLoader", "zApp_Config", "ui.bootstrap"])
//.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
angular.module("zPage_Home_Login", ["ngRoute", "zSrv_OAuth2", "zApp_Config"])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.when("/login", {
        templateUrl: "/Templates/Home/loginView.html"
    });

    $routeProvider.when("/forgetPassword", {
        templateUrl: "/Templates/Home/forgetPassword.html"
    });

    $routeProvider.otherwise({
        templateUrl: "/Templates/Home/loginView.html"
    });
}])

.controller("loginCtrl", ['$scope', '$http', '$window', '$location', 'zSrv_OAuth2', 'zVal_AccessTo',
    function ($scope, $http, $window, $location, zSrv_OAuth2, zVal_AccessTo) {

    $scope.isLoading = false;
    $scope.alerts = [];
    $scope.loginData = {
        userName: zSrv_OAuth2.Client.LoginUserId,
        password: zSrv_OAuth2.Client.LoginUserPassword,
        resetPasswordCode: "",
        useRefreshTokens: true
    };

    $scope.message = "";

    $scope.$on("$routeChangeSuccess", function () {
        
        if ($location.path().indexOf('forgetPassword') > 0) {
            CanvasBG.init({
                Loc: {
                    x: window.innerWidth / 2.1,
                    y: window.innerHeight / 2.1
                }
            });
        }
        else  {
            CanvasBG.init({
                Loc: {
                    x: window.innerWidth / 3,
                    y: window.innerHeight / 7
                }
            });
        }
    });

    $scope.$on('$viewContentLoaded', function () {
        // Init Theme Core
        Core.init();

        // Init Demo JS
        Demo.init();

        
    });

    
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.login = function (loginData) {
        $scope.alerts = [];
        $scope.isLoading = true;
        zSrv_OAuth2.logIn(loginData).then(function (OAuth2_Token) {
            console.log("Logged In successfully.");
            $scope.isLoading = false;
            var redirectURL = (zVal_AccessTo=="") ? 'Index' : zVal_AccessTo; 
                
            zSrv_OAuth2.startAccess(redirectURL, OAuth2_Token);
            //$window.location.href = '/home/index';
        },
         function (err) {
             //$scope.message = err.error_description;
             if (err.error)
                 $scope.alerts.push({ type: 'warning', msg: (err.error ? err.error : 'Invalid Username or Password!' )});
             $scope.isLoading = false;
         });
    };

    $scope.forgetPassword = function () {
        $scope.alerts = [];
        zSrv_OAuth2.forgetPassword($scope.loginData.userName).then(function (response) {
            $scope.resetPasswordCode = response.data;
            $scope.alerts.push({ type: response.status, msg: 'Reset passcode is received successfully.' });
            
        }, function (err) {
            if (!err)
                $scope.alerts.push({ type: "warning", msg: "Server no response or timeout." });
            else
                $scope.alerts.push({ type: 'warning', msg: err });
        });
    };

    $scope.resetPassword = function () {
        $window.location.href = $scope.resetPasswordCode;
    };
    
    $scope.historyBack = function () {
        $window.history.back();
    };

}]);