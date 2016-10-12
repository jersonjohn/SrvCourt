angular.module("zDir_zNoDirty", [])
.directive("znodirty", [ function () {
    return {
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$setDirty = angular.noop;

        },
        restrict: "A",
        require: 'ngModel',
        //replace: true
    }
}]);