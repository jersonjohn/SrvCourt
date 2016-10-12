angular.module("zDir_zJsonText", [])
.directive("zjsontext",function() {
    return {
        restrict: "A", // only activate on element attribute
        require: 'ngModel', // get a hold of NgModelController
        //scope: {},
        link: function (scope, element, attrs, ngModelCtrl) {

            var lastValid;

            // push() if faster than unshift(), and avail. in IE8 and earlier (unshift isn't)
            ngModelCtrl.$parsers.push(fromUser);
            ngModelCtrl.$formatters.push(toUser);

            // clear any invalid changes on blur
            //element.bind('blur', function() {
            //    element.val(toUser(scope.$eval(attrs.ngModel)));
            //});

            // $watch(attrs.ngModel) wouldn't work if this directive created a new scope;
            // see http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope how to do it then
            // http://stackoverflow.com/questions/17893708/angularjs-textarea-bind-to-json-object-shows-object-object
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                lastValid = lastValid || newValue;

                if (newValue != oldValue) {
                    ngModelCtrl.$setViewValue(toUser(newValue));

                    // TODO avoid this causing the focus of the input to be lost..
                    //ngModelCtrl.$render();
                }
            }, true); // MUST use objectEquality (true) here, for some reason..

            function fromUser(viewValue) {
                // Beware: trim() is not available in old browsers
                if (!viewValue || viewValue.trim() === '') {
                    return {};
                } else {
                    try {
                        lastValid = angular.fromJson(viewValue);
                        ngModelCtrl.$setValidity('Json', true);
                        return viewValue.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
                        //console.log('ok ngModelCtrl.$valid > ' + ngModelCtrl.$valid)
                    } catch (e) {
                        ngModelCtrl.$setValidity('Json', false);
                        return viewValue;
                        //console.log('nk ngModelCtrl.$valid > ' + ngModelCtrl.$valid)
                    }
                    
                    //return angular.fromJson(viewValue);
                }
            }

            function toUser(modelValue) {
                // better than JSON.stringify(), because it formats + filters $$hashKey etc.
                // console.log(modelValue);
                //var mv;
                try {
                    return angular.toJson(angular.fromJson(modelValue, true), true);
                //    return mv;
                } catch (e) {
                    throw ('info only (Ignore this error): ' + e.message);
                }
            }
        }
    };
});
