angular.module("zDir_zValidate", [])
.directive("zvalidate", [function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            //var validateName = attrs['zvalidate'];
            var validateEvent = attrs['zvalidateEvent'];


            //For DOM -> model validation
            ngModelCtrl.$parsers.unshift(function (newValue) {
                //var valid = blacklist.indexOf(value) === -1;
                var valid = (function (newValue) { return scope.$eval(validateEvent + '("' + newValue + '")') })(newValue);
                for (var error in ngModelCtrl.$error) {
                    if(error.indexOf('customvalidate')==0)
                        ngModelCtrl.$setValidity(error, true);
                }
                if (valid > 0)
                    ngModelCtrl.$setValidity('customvalidate0' + valid, false);
               
                return newValue ? newValue : undefined;
            });

            //For model -> DOM validation
            //ngModelCtrl.$formatters.unshift(function (value) {
            //    var valid = (function (newValue) { scope.$eval(validateEvent) })(value);
            //    ngModelCtrl.$setValidity(validateName, valid);
            //    return value;
            //});

        },
    }
}]);