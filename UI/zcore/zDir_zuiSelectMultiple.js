angular.module("zDir_zuiSelectMultiple", [])
.directive("zuiselectmultiple", ["$compile", "$timeout", function ($compile, $timeout) {
    return {
        //require: 'ngModel',
        scope: {
            'id': '@id',
            'name': '@name',
            //'parent': '=scope',
            'group': "=",
            'modalGroup': "=modalgroup",
            'model': '@value',
            'options': '@options',
            'multiple': '@multiple',
            'divclass': '@divclass',
            'onchange': '@onchange',
            'convertNumber': '@converttonumber'
        },
        restrict: 'E',
        link: function (scope, elem, attrs, ctrl) {
            var id = scope.id; //attrs['id'];
            var name = scope.name; //attrs['name'];
            var model = scope.model; // attrs['value'];
            var options = scope.options // attrs['options'];
            //scope.multiple = attrs['multiple'] ? attrs['multiple'] : null;
            var onchange = scope.onchange; //attrs['onchange'];
            var convertNumber = scope.convertNumber; //attrs['converttonumber'];


            scope.selectedItems = "None selected";
           // scope.multiple = scope.multiple ? scope.multiple : null;
            scope.OnChangedEvent = function () {
                if(scope.onchange)
                    scope.group[onchange](scope.$eval(model));
            };

            
            if (scope.multiple == "multiple")
                divclass = "multiselect dropdown-toggle btn btn-default btn-primary";
            else
                divclass = "btn btn-primary";


            var divSelect = angular.element('<select>').addClass(divclass); //.addClass('multiselect dropdown-toggle btn btn-default btn-primary');
            divSelect.attr({
                'id': id,
                'name': name,
                'multiple': scope.multiple,
                'ng-model': model,
                'ng-options': 'item as item.label for item in ' + options + ' track by item.id',
                'ng-change': 'OnChangedEvent()',
                'convert-to-number': convertNumber,
                'style': 'height: 36px; margin-right: 8px;'
            });
            
            elem.append(divSelect);
            
            //scope.itemClick = function (ev) {
            //    console.log('itemClick is called: ' + ev);
            //}

            //scope.buttonClick = function (ev) {
            //    console.log('buttonClick is called: ' + ev);
            //    var divBtnParent = angular.element(ev.currentTarget.parentElement);
            //    divBtnParent.addClass('open');
            //}

            $compile(elem.contents())(scope);

            $timeout(function () {
                if (scope.multiple == "multiple") {
                    divSelect.multiselect({
                        buttonClass: 'multiselect dropdown-toggle btn btn-default btn-info'
                    });
                } else {
                    
                }

            });
        }
    }
}]);