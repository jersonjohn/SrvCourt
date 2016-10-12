angular.module("zDir_ConvertToNumber", [])
.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            //var formatting = function () {
            var lastValid;

            

            var toUser = function (val) {
                if (val != undefined) {
                    //if (angular.isNumber(val))
                        return { Id: '' + val };
                    //else
                    //    return val;
                }
            }

            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                lastValid = lastValid || newValue;
                var required = attrs['ngRequired'];
                if (newValue == undefined && oldValue == undefined) {
                    
                    if (required.indexOf('true') == 0) {
                        //ngModel.$setValidity('required', false);
                        fromUser(undefined);
                    }
                } else if (newValue != oldValue) {
                    if (newValue != undefined) {
                        //  if (attrs['convertToNumber'] == 'true')
                       // if (angular.isNumber(newValue))
                            ngModel.$setViewValue({ Id: '' + newValue });
                       // else
                       //     ngModel.$setViewValue(newValue);
                        //else
                         //   ngModel.$setViewValue(newValue);
                    }
                    // if not required and set to none then set to validity
                    if (newValue == undefined && required.indexOf('false') == 0)
                        ngModel.$setValidity('parse', true);
                    
                    // TODO avoid this causing the focus of the input to be lost..
                    ngModel.$render();
                    if(oldValue == undefined) {
                        ngModel.$setPristine();
                        ngModel.$$parentForm.$setPristine();
                        ngModel.$$parentForm.$$parentForm.$setPristine();
                    }
                }

            }, true);

            var fromUser = function (val) {
                //scope.$apply(function () {
                //  scope[attrs.ngModel] = element.val();
                //});
                var required = attrs['ngRequired'];
                try {
                    if (required.indexOf('true') == 0)
                        ngModel.$setValidity('required', true);
                    //if (angular.isNumber(val.Id))
                    if (val && angular.isNumber(val.Id)) {
                        var s = parseInt(val.Id, 10);
                        //if (s)
                        return s;
                    }
                    else if (val) {
                        return val.Id;
                    }
                } catch (e) {
                    //return val;
                    //if (required.indexOf('true') == 0)
                    //    ngModel.$setValidity('required', false);
                    //throw (e.message);
                }
            }


            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);
            

        }
    };
});