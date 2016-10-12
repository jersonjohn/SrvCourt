angular.module("zPage_OA2_ResetPassword", ["ngRoute", "zSrv_OAuth2"])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });


    $routeProvider.when("/resetPasswordConfirm", {
        templateUrl: "/Templates/OA2/resetPasswordConfirmView.html"
    });

    $routeProvider.otherwise({
        templateUrl: "/Templates/OA2/resetPasswordView.html"
    });
}])

.controller("mainCtrl", ['$scope', '$http', '$window', '$location', 'zVal_Model', 'zSrv_OAuth2',
    function ($scope, $http, $window, $location, zVal_Model, zSrv_OAuth2) {

        $scope.alerts = [];

        $scope.$on("$routeChangeSuccess", function () {

            //if ($location.path().indexOf('Confirm') > 0) {
            //    CanvasBG.init({
            //        Loc: {
            //            x: window.innerWidth / 2.1,
            //            y: window.innerHeight / 2.1
            //        }
            //    });
            //}
            //else {
            //    CanvasBG.init({
            //        Loc: {
            //            x: window.innerWidth / 3,
            //            y: window.innerHeight / 7
            //        }
            //    });
            //}
        });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.formData = {
        email: "",
        password: "",
        resetUserId: "",
        confirmPassword: "",
        code: zVal_Model.code,
        userId: zVal_Model.userId
    };

    

    $scope.resetPassword = function (formData) {
        $scope.alerts = [];
        if (!formData.code) {
            $scope.alerts.push({ type: "warning", msg: 'No authorization code found! Please click on the reset password link found in your email again.' });
            return;
        }

        //if (formData.resetUserId != formData.userId) {
        //    $scope.alerts.push({ type: "warning", msg: 'You have entered a wrong login username.' });
        //    return;
        //}

        if (formData.password != formData.confirmPassword) {
            $scope.alerts.push({ type: "warning", msg: 'Password does not match, please enter new password twice and same.' });
            return;
        }

        $http.post(zSrv_OAuth2.OAuth2.BaseUri + 'Admin/ResetPasswordApi', { model: formData }).then(function (response) {
            $scope.resetPasswordResult = response;
            $scope.alerts.push({ type: response.data.status, msg: response.data.data });
            if (response.data.status == "success")
                $location.path("/resetPasswordConfirm");
        }, function (err) {
            //console.log(err.statusText);
            $scope.alerts.push({ type: "danger", msg: "[" + err.statusText + "] - " + err.data });
        });

    };

    $scope.goToLoginPage = function () {
        $window.location.href = zSrv_OAuth2.Client.BaseUri;
    };

    $location.search("");

}])

.directive('equalTo', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.equalTo;
            elem.bind('keyup', function () {
                scope.$apply(function () {
                    var v = $(firstPassword).val().indexOf(elem.val()) == 0;
                    //var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('equalto', v);
                });
            });
        }
    }
}]);