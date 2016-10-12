angular.module("zDir_zSelectize", [])
.directive("zselectize", ["$compile", "$timeout", function ($compile, $timeout) {
    return {
        //require: 'ngModel',
        //scope: {
        //    'id': '@id',
        //    'name': '@name',
        //    //'parent': '=scope',
        //    'group': "=",
        //    'modalGroup': "=modalgroup",
        //    'placeholder': '@placeholder',
        //    'model': '@value',
        //    'options': '@options',
        //    'multiple': '@multiple',
        //    'divclass': '@divclass',
        //    'onchange': '@onchange'
        //   // 'convertNumber': '@convertToNumber'
        //},
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var generateSelectize = function () {
                var id = attrs['id'];
                var name = attrs['name'];
                var placeholder = attrs['placeholder'];
                var model = attrs['value'];
               // var modelValue = scope.$eval(model);
                var options = scope.$eval(attrs['options']);
                var multiple = attrs['multiple'] ? attrs['multiple'] : null;
                var onchange = attrs['onchangeevent'];
                //var convertNumber = attrs['isnumeric'];
                var isrequired = scope.$eval(attrs['isrequired']);
                var allowEmpty = eval(isrequired);


                //scope.selectedItems = "None selected";
                // scope.multiple = scope.multiple ? scope.multiple : null;
                //scope.OnChangedEvent = function () {
                //    if (scope.onchange)
                //        scope.group[onchange](scope.$eval(model));
                //};

                //elem.html("");
                var divclass = ""; //"gui-input form-control";
                var configOption = null;
                if (multiple == "multiple") {
                    configOption = {
                        maxItems: null,
                        valueField: 'Id',
                        labelField: 'Name',
                        searchField: 'Name',
                        allowEmptyOption: !allowEmpty,
                        maxOptions: 100,
                        selectOnTab: true,
                        closeAfterSelect: false,
                        dropdownParent: 'body',
                        options: options,
                      //  items: [modelValue],
                        //copyClassesToDropdown: false,
                        create: false
                    };
                    // divclass = "multiselect dropdown-toggle btn btn-default btn-primary";
                } else {
                    configOption = {
                        //maxItems: null,
                        valueField: 'Id',
                        labelField: 'Name',
                        searchField: 'Name',
                        allowEmptyOption: !allowEmpty, // true,
                        maxOptions: 100,
                        selectOnTab: true,
                        closeAfterSelect: false,
                        dropdownParent: 'body',
                        options: options,
                     //   items: [modelValue],
                        //copyClassesToDropdown: false,
                        create: false
                    };
                    // divclass = "btn btn-primary";
                }

                var divSelect = angular.element('<select>').addClass(divclass); //.addClass('multiselect dropdown-toggle btn btn-default btn-primary');
                divSelect.attr({
                    'id': id,
                    'name': name,
                    'placeholder': placeholder,
                    //'multiple': multiple,
                    'ng-model': model,
                    //'ng-options': options,
                    'ng-change': onchange,
                    'ng-required': attrs['isrequired'],
                    //'convert-to-number': convertNumber
                    //'style': 'gui-input form-control'
                });
                //if (allowEmpty) {
                //    var divNoneOption = angular.element('<option>').attr({ 'value': '' }).text('None selected');
                //    divSelect.append(divNoneOption);

                //}
                elem.html("");
                elem.append(divSelect);



                $compile(elem.contents())(scope);

                $timeout(function () {
                    divSelect.selectize(configOption);
                    //if (scope.multiple == "multiple") {
                    //    divSelect.multiselect({
                    //        buttonClass: 'multiselect dropdown-toggle btn btn-default btn-info'
                    //    });
                    //} else {  }
                }, 0);
            }

            var setValue = function (newValue, oldValue) {
                $timeout(function () {
                    //if (Array.isArray(newValue))
                    elem.find('select').selectize()[0].selectize.setValue(newValue);
                    //if (newValue == "" && eval(attrs['isrequired'])) {
                    //    if (elem.find('select').scope().F1) elem.find('select').scope().F1.$setValidity("selection", false);
                    //}
                    if (oldValue == undefined) {
                        if (elem.find('select').scope().F1)  elem.find('select').scope().F1.$setPristine();
                        if ($('form') && $('form').scope().Frm) $('form').scope().Frm.$setPristine();
                    }
                    //else
                    //    elem.find('select').selectize()[0].selectize.setValue(newValue);
                }, 10);
               // scope.$apply();
            }

            scope.$watch(attrs['options'], function (newValue, oldValue) {
                if (newValue) {
                    if (angular.isArray(newValue)) {
                        var isRequired = scope.$eval(attrs['isrequired']);
                        if (isRequired == false) {
                            var noneOption = { 'Id': '', 'Name': '-- none --' };
                            newValue.unshift(noneOption);
                        }
                    }
                    generateSelectize();
                    var v = scope.$eval(attrs['value']);
                    if (v)
                        setValue(v);
                }
            });

            scope.$watch(attrs['value'], function (newValue, oldValue) {
                if ( newValue != oldValue) {  //(newValue || newValue == "") &&
                    //if (newValue == "" && oldValue)
                    //    setValue(oldValue);
                    //else
                    var opt = scope.$eval(attrs['options']);
                    if(opt)
                        setValue(newValue, oldValue);
                }
            });
            //scope.$watch(function() {return elem.attr('options'); }, function(newValue){
            //    if (newValue)
            //        generateSelectize();
            //});

            
        }
    }
}]);