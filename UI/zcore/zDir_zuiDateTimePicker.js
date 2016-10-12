angular.module("zDir_zuiDateTimePicker", [])
.directive("zuidatetimepicker", [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        //scope: {
        //    pick12HourFormat: '@'
        //},
        link: function (scope, elem, attrs, ctrl) {
            var a = attrs.zuidatetimepicker;
            if (a)
                a = a.toUpperCase();

            //https://eonasdan.github.io/bootstrap-datetimepicker/Options/
            var e = elem.datetimepicker(
                {
                    format: 'DD-MM-YYYY hh:mm A',
                    //showToday: true,
                    //sideBySide: true,
                    //toolbarPlacement: 'top',
                    widgetParent: (a == 'MODAL') ? null : 'body',
                    showTodayButton: true,
                    showClose: true,
                    showClear: true
                    
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

            var ngModel = ctrl;
            //var dateSet = elem.data('DateTimePicker');

            if (!ctrl) return;

            ctrl.$formatters.push(function (modelValue) {
                if (!modelValue) return;

                var d = moment(modelValue).format('DD-MM-YYYY hh:mm A');

                //var mDate = new Date(modelValue);
                //var d = (mDate.getDate() < 10 ? '0' : '') + mDate.getDate() + '-' + (mDate.getMonth() < 9 ? '0' : '') + (mDate.getMonth() + 1) + '-' + mDate.getFullYear() + ' ' +
                //  (mDate.getHours() == 0 ? '12' : ((mDate.getHours() < 10 ? '0' : '') + mDate.getHours())) + ':' + (mDate.getMinutes() < 10 ? '0' : '') + mDate.getMinutes() + (mDate.getHours() < 12 ? ' AM' : ' PM');
                //dateSet.setDate(d);
                ngModel.$setPristine();
                ngModel.$$parentForm.$setPristine();
                ngModel.$$parentForm.$$parentForm.$setPristine();
                return d;
            });

            var _fromUser = function (viewValue) {
                //var seg = viewValue.split(' ');
                //var d = seg[0].split('-');
                //var t = null;
                //if (seg.length == 3) {
                //    t = seg[1].split(':');
                //    if (seg[2] == 'PM')
                //        if (t[0] < 12)
                //            t[0] = Number(t[0]) + 12;
                //}
                //var ddate = new Date(d[2], Number(d[1]) - 1, d[0], t[0], t[1], 0, 0);
                var ddate = moment(viewValue, 'DD-MM-YYYY hh:mm A').toJSON();
                return ddate;
            }

            ctrl.$parsers.push(_fromUser);
        }
    }
}]);