angular.module("zDir_zuiToggleButton", [])
.directive("zuitogglebutton", ["$compile", function ($compile) {
    return {
        //require: 'ngModel',
        restrict: 'E',
        scope: {
            'model': '=value',
            'onChange': '&onchange'
        },
        link: function (scope, elem, attrs, ctrl) {
            //var model = scope[attrs["value"]];
            var id = attrs["id"];
            //var onChange = attrs["onchange"];
            var label = attrs["label"];
            var showLabel = attrs["showlabel"];
            var readonly = attrs["readonly"];

            scope.toggleSwitch = function () {
                scope.model = (scope.model == true ? false : true);
                

                if (scope.model == true)
                    divInput.attr('checked', true);
                else
                    divInput.removeAttr('checked');

                if (scope.onChange)
                    scope.onChange();
            }

            var label_FieldSelect = angular.element("<label>").addClass('switch').addClass('block').addClass('mt5').addClass('switch-primary');
            var divInput = angular.element("<input>").attr({
                'type': 'checkbox',
                'name': 'name',
                'id': id,
                'ng-model': 'model', //attrs["value"],
                'ng-change': 'onChange()', //attrs["onchange"],
                //'value': scope.model
                //'zuicheckboxinput': true

            });
            if (scope.model == true)
                divInput.attr('checked', 'checked');
            else
                divInput.removeAttr('checked');

            var divInputLabel = angular.element("<label>").attr({
                'for': 'name',
                'data-on': 'ID',
                'data-off': 'NAME',
                'ng-click': readonly == 'readonly' ? null : 'toggleSwitch()',  //("' + attrs["value"] + '", "' + attrs["onchange"] + '")',
                //'ng-change': onChange,
            });


            label_FieldSelect.append(divInput);
            label_FieldSelect.append(divInputLabel);
            if (showLabel == "false") {
                var divInputSpan = angular.element("<span>").text(label);
                label_FieldSelect.append(divInputSpan);
            }
            
            elem.append(label_FieldSelect);

            $compile(elem.contents())(scope);
        }
    }
}]);
//.directive("zuicheckboxinput", [function () {
//    return {
//        require: 'ngModel',
//        restrict: 'A',
//        //scope: {
//        //    'model': 'ngModel',
//        //},
//        link: function (scope, elem, attrs, ctrl) {

//            if (!ctrl) return;

//            ctrl.$formatters.push(function (modelValue) {
//                if (!modelValue) return;

//                return modelValue;
//            });

//            ctrl.$parsers.push(function (viewValue) {

//                return viewValue;
//            });

//        }
//    }
//}]);