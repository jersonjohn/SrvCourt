angular.module("zDir_zuiTimePicker", [])
.directive("zuitimepicker", [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        //scope: {
        //    pick12HourFormat: '@'
        //},
        link: function (scope, elem, attrs, ctrl) {

            //detech touch device
            if (('ontouchstart' in window || navigator.maxTouchPoints) && document.documentElement.clientWidth < 600) {
                function highlightValue() {
                    var newValue = scope.$eval(attrs.ngModel);
                    var date = (newValue instanceof Date) ? newValue : moment(newValue, 'hh:mm A');
                    var totalMins = date.hours() * 60 + date.minutes();
                    elem.pickatime('picker').set('highlight', totalMins);
                }

                elem.pickatime({
                    min: attrs.mintime ? attrs.mintime : [10, 30],   //10.30am
                    max: attrs.maxtime ? attrs.maxtime : [22, 30],    //10.30pm
                    onOpen: function () {
                        console.log('onOpen - pickatime');
                        highlightValue();
                    },
                    onClose: function () {
                        console.log('onClose - pickatime');
                        elem.blur();
                    }
                });

            } else {

                var a = attrs.zuitimepicker;
                if (a)
                    a = a.toUpperCase();

                if (attrs.ignoreReadonly != "false")
                    elem.attr('readonly', 'readonly');

                //https://eonasdan.github.io/bootstrap-datetimepicker/Options/
                var e = elem.datetimepicker(
                    {
                        format: 'hh:mm A',
                        ignoreReadonly: attrs.ignoreReadonly == "false" ? false : true,
                        widgetParent: (a == 'MODAL') ? null : 'body'
                    }).on('dp.change', function (newDate, oldDate) {
                        angular.element(newDate.currentTarget).triggerHandler('input')
                    });
                if (a == "") {
                    e.on('dp.show', function () {
                        var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
                        if (datepicker.hasClass('bottom')) {
                            var top = $(this).offset().top + $(this).outerHeight();
                            var left = $(this).offset().left;
                            datepicker.css({
                                'top': top + 'px',
                                'bottom': 'auto',
                                'left': left + 'px',
                                ' z-index': 9999,

                            });
                        }
                        else if (datepicker.hasClass('top')) {
                            var top = $(this).offset().top - datepicker.outerHeight();
                            var left = $(this).offset().left;
                            datepicker.css({
                                'top': top + 'px',
                                'bottom': 'auto',
                                'left': left + 'px',
                                ' z-index': 9999,
                            });
                        }
                    });
                }
            }

            var ngModel = ctrl;

            if (!ctrl) return;



            ctrl.$formatters.push(function (modelValue) {
                if (!modelValue) return;

                var d = moment(modelValue, 'hh:mm A').format('h:mm A');
                ngModel.$setPristine();
                ngModel.$$parentForm.$setPristine();
                ngModel.$$parentForm.$$parentForm.$setPristine();
                return d;
            });


            var fromUser = function (viewValue) {
                return viewValue;
            }
      
            ctrl.$parsers.push(fromUser);
        }
    }
}]);
