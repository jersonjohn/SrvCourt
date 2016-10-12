angular.module("zDir_zuiDatePicker", [])
.directive("zuidatepicker", [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {

            var dateformat = attrs.dateformat || 'DD/MM/YYYY';
            
            elem.css('cursor', 'pointer');
            elem.css('background-color', '#ffffff');
            
            //detech touch device
            if (('ontouchstart' in window || navigator.maxTouchPoints) && document.documentElement.clientWidth < 600) {
                scope.specialdates = null;

                scope.$watch(attrs.specialdates, function (newValue, oldValue) {
                    if (newValue)
                        scope.specialdates = newValue;
                });


                var setSpecialDates = function setSpecialDates(sd) {
                    if (sd && sd.length > 0) {
                        var datepicker = $('body').find('.picker__wrap:last');
                        for (var i = 0; i < sd.length; i++) {
                            var sd_arr = sd[i].split('/');
                            var adate = $('[aria-label*="' + sd_arr[1] + '/' + sd_arr[0] + '/' + sd_arr[2] + '"]');
                            datepicker.find(adate).addClass('ph');
                        }
                    }
                }

                elem.pickadate({
                    $scope: scope,
                    format: dateformat.toLowerCase(),
                    min: attrs.mindate, // ? attrs.mindate : [2016, 5, 1],   //10.30am
                    max: attrs.maxdate, // ? attrs.maxdate : [2018, 6, 30],    //10.30pm
                    closeOnSelect: true,
                    closeOnClear: true,
                    onOpen: function() {
                        console.log('onOpen - pickadate');
                       // setSpecialDates();
                    },
                    onClose: function () {
                        console.log('onClose - pickadate');
                        elem.blur();
                    },
                    onRender: function () {
                        console.log('onRender - pickadate');
                        setSpecialDates(this.component.settings.$scope.specialdates);
                    }
                });



                function updateValue(newValue) {
                    if (newValue) {
                        var aDate = (newValue instanceof Date) ? newValue : new Date(newValue);
                        // needs to be in milliseconds
                        elem.pickadate('picker').set('select', aDate.getTime());
                    } else {
                       // elem.pickadate('picker').clear();
                    }
                }

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue == undefined || newValue == oldValue)
                        return;
                    updateValue(newValue);
                }, true);

            } else {

                var a = attrs.zuidatepicker;
                var sd = []; // || ['07/06/', '01/01/', '12/25/']; //attrs.specialdate ? attrs.specialdate : ['07/25/', '01/01/', '12/25/'];
               
                if (a)
                    a = a.toUpperCase();  //'MODAL'

                if (attrs.ignoreReadonly != "false") {
                    elem.attr('readonly', 'readonly');
                    //elem.css('cursor', 'pointer');
                }
                //var dateformat = attrs.dateformat || 'DD/MM/YYYY';
                scope.$watch(attrs.specialdates, function (newValue, oldValue) {
                    if (newValue)
                        sd = newValue;
                });
                

                //https://eonasdan.github.io/bootstrap-datetimepicker/Options/#format
                var e = elem.datetimepicker(
                    {
                        format: dateformat,
                        widgetParent: (a == 'MODAL') ? null : 'body',
                        showTodayButton: true,
                        showClose: true,
                        showClear: true,
                        ignoreReadonly: attrs.ignoreReadonly == "false" ? false : true,
                        //focuseOnShow: false,
                        //inline: true,
                        //pickTime: false
                    }).on('dp.change', function (newDate, oldDate) {
                        angular.element(newDate.currentTarget).triggerHandler('input')
                    });

                var setSpecialDates = function setSpecialDates() {
                    if (sd.length > 0) {
                        var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
                        for (var i = 0; i < sd.length; i++) {
                            var adate = $('[data-day*="' + sd[i] + '"]');
                            datepicker.find(adate).addClass('ph');
                        }
                    }
                }

                if (a == "") {
                    e.on('dp.show', function () {
                        var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
                        setSpecialDates();
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

                } else {
                    e.on('dp.show', function () {
                        setSpecialDates();
                    });

                }

                e.on('dp.update', function () {
                    setSpecialDates();
                });
            }
            //refer to jquery-ui  https://jqueryui.com/datepicker/
            //elem.datepicker({
            //    dateFormat: "dd/mm/yy",
            //    //showWeek: true,
            //    //changeMonth: true,
            //    //changeYear: true,
            //    showButtonPanel: true
            //});



            var ngModel = ctrl;
            //var dateSet = elem.data('DateTimePicker');

            if (!ctrl) return;
            var originState = true;

            ctrl.$formatters.push(function (modelValue) {
                if (!modelValue) return;

                //var mDate = new Date(modelValue);
                //var d = (mDate.getDate() < 10 ? '0' : '') + mDate.getDate() + '/' + (mDate.getMonth() < 9 ? '0' : '') + (mDate.getMonth() + 1) + '/' + mDate.getFullYear();
                //dateSet.setDate(d);
                var d = moment(modelValue).format(dateformat);
                if (originState) {
                    ngModel.$setPristine();
                    if (ngModel.$$parentForm) {
                        ngModel.$$parentForm.$setPristine();
                        if (ngModel.$$parentForm.$$parentForm) ngModel.$$parentForm.$$parentForm.$setPristine();
                    }
                    originState = false;
                }
                return d;
            });


            ctrl.$parsers.push(function (viewValue) {
                // var d = viewValue.split('/');

                var ddate = moment(viewValue, 'DD/MM/YYYY').toJSON();
                return ddate;
            });
        }
    }
}]);
