angular.module("zDir_zErrorMessage", [])
.directive("zerrormessage", ["$compile", "$rootScope", "$timeout", function ($compile, $rootScope, $timeout) {
    return {
        link: function (scope, element, attrs, ngModelCtrl) {
            var n = attrs['fieldname'];
            var generateMsg = function () {
                //element.html("");
                if (scope.F1.$valid == true) {
                    element.parent().find('.zerror-message').remove();
                    //element.html("");
                } else {
                    //element.html("");
                    element.parent().find('.zerror-message').remove();
                    var divErrMessage = angular.element('<div class="zerror-message">');
                    var errMessage = angular.element('<em class="state-zerror">')
                    divErrMessage.append(errMessage);
                    var errors = scope.F1.$error;
                    for (e in errors) {
                        switch (e) {
                            case 'required':
                                errMessage.text('cannot be blank');
                                break;
                            case 'minlength':
                                var minL = attrs['minlength']
                                errMessage.text('>= ' + minL + ' chars');
                                break;
                            case 'email':
                                errMessage.text('invalid email');
                                break;
                            case 'url':
                                errMessage.text('Start with http ...');
                                break;
                            case 'customvalidate01':
                                errMessage.text(attrs['zvalidate'].split(';')[0]);
                                break;
                            case 'customvalidate02':
                                errMessage.text(attrs['zvalidate'].split(';')[1]);
                                break;
                            case 'customvalidate03':
                                errMessage.text(attrs['zvalidate'].split(';')[2]);
                                break;
                            case 'customvalidate04':
                                errMessage.text(attrs['zvalidate'].split(';')[3]);
                                break;
                            case 'customvalidate05':
                                errMessage.text(attrs['zvalidate'].split(';')[4]);
                                break;
                        }
                        break;
                    }
                    divErrMessage.insertAfter(element);
                }
                //$compile(element.contents())(scope);
                $compile(divErrMessage)(scope);
            }

            //ngModelCtrl.$render = function () {
            //    var newValue = ngModelCtrl.$viewValue;
                
            //    if(ngModelCtrl.$dirty)
            //        generateMsg();
            //};

            //scope.$watch(function() {return element.attr('ngModel'); }, function(newValue){
            //    if (newValue)
            //        generateMsg();
            //});


            scope.$watch('[group.formChecked, F1.$valid, ' + attrs.ngModel + ']', function (newValue, oldValue) {
                //F1["' + n + '"].$valid,
                //F1["' + n + '"].$viewValue 
                //if (!angular.equals(newValue, oldValue)) {
                if(newValue != oldValue && newValue[1] != undefined) {
                //if(newValue != oldValue) {
                    generateMsg();
                }
            });
           

        },
        restrict: "A",
        require: 'ngModel',
        replace: true
    }
}]);