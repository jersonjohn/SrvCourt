angular.module("zDir_zuiMonthPicker", [])
.directive("zuimonthpicker", [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            $(function () {
                elem.monthpicker({
                    changeYear: false,
                    stepYears: 1,
                    prevText: '<i class="fa fa-chevron-left"></i>',
                    nextText: '<i class="fa fa-chevron-right"></i>',
                    dateFormat: 'yy-mm',
                    showButtonPanel: true,
                    beforeShow: function (input, inst) {
                        var newclass = 'allcp-form';
                        var themeClass = $(this).parents('.allcp-form').attr('class');
                        var smartpikr = inst.dpDiv.parent();
                        if (!smartpikr.hasClass(themeClass)) {
                            inst.dpDiv.wrap('<div class="' + themeClass + '"></div>');
                        }
                    },
                    onSelect: function (date) {
                        scope.$apply(function () {
                            ctrl.$setViewValue(date);
                        });
                    }
                });
            });

            if (!ctrl) return;

            ctrl.$formatters.push(function (modelValue) {
                if (!modelValue) return;

                return modelValue.getFullYear() + '-' + (modelValue.getMonth() < 9 ? '0' : '') + (modelValue.getMonth() + 1);
            });

            ctrl.$parsers.push(function (viewValue) {
                var d = viewValue.split('-');
                var ddate = new Date(d[0], Number(d[1]) - 1, 1);
                return ddate.toJSON();
            });
        }
    }
}]);