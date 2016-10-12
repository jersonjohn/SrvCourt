angular.module("zDir_zuiCheckBox", [])
.directive("zuicheckbox", ["$compile", function ($compile) {
    return {
        //require: 'ngModel',
        restrict: 'E',
        //scope: {
        //    'model': '=value',
        //    'onChange': '&onchange'
        //},
        link: function (scope, elem, attrs, ctrl) {
            var model = scope[attrs["value"]];
            var id = attrs["id"];
            var onChange = attrs["onchange"];
            var label = attrs["label"];
            var showLabel = attrs["showlabel"];
            var readonly = attrs["readonly"];



            var label_FieldSelect = angular.element("<label>").addClass('switch').addClass('block').addClass('mt5').addClass('switch-primary');
            var divInput = angular.element("<input>").attr({
                'type': 'checkbox',
                'name': 'name',
                'id': id,
                'ng-model': attrs["value"], // 'model', //attrs["value"],
                'ng-change': attrs["onchange"],    // 'onChange()', //attrs["onchange"],
                //'value': scope.model
                //'zuicheckboxinput': true

            });
            if (scope.model == true)
                divInput.attr('checked', 'checked');
            else
                divInput.removeAttr('checked');

            var divInputLabel = angular.element("<label>").attr({
                'for': 'name',
                'data-on': 'YES',
                'data-off': 'NO',
                'ng-click': readonly == 'readonly' ? null : 'toggleSwitch("' + id + '", "' + attrs['value'] + '",$event)',  //("' + attrs["value"] + '", "' + attrs["onchange"] + '")',
                //'ng-change': onChange,
            });


            label_FieldSelect.append(divInput);
            label_FieldSelect.append(divInputLabel);
            if (showLabel == "false") {
                var divInputSpan = angular.element("<span>").text(label);
                label_FieldSelect.append(divInputSpan);
            }

            scope.toggleSwitch = function (id, value, event) {
                //scope.model = (scope.model == true ? false : true);
                //event.stopPropagation();
                var v = value.split('.');
                var model = scope;
                for (var i = 0; i < v.length - 1 ; i++)
                    model = model[v[i]];
                //var model = scope.$eval(attrs["value"]);
                model[v[v.length - 1]] = (model[v[v.length - 1]] == true ? false : true);
                if (scope.F1) scope.F1.$setDirty();
                if (scope.Frm) scope.Frm.$setDirty();

                if (model[v[v.length - 1]] == true)
                    $('input#' + id).attr('checked', true);
                else
                    $('input#' + id).removeAttr('checked');

                if (scope.onChange)
                    scope.onChange();
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