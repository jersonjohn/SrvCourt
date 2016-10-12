angular.module("zDir_zMFB", [])
.directive("zmfb", ["$compile", "$rootScope", "$timeout", "zSrv_InputCustom", function ($compile, $rootScope, $timeout, zSrv_InputCustom) {
    return {
        link: function (scope, element, attrs) {
            var generateMFB = function () {

                var effect = attrs['effect'],
                    position = attrs['position'],
                    method = attrs['method'],
                    activeicon = attrs['activeicon'],
                    restingicon = attrs['restingicon'],
                    ngmouseenter = attrs['ngmouseenter'],
                    ngmouseleave = attrs['ngmouseleave'],
                    menustate = attrs['menustate'],
                    mainaction = attrs['mainaction'],
                    fieldname = attrs['fieldname'],
                    buttons = attrs['buttons'];



                scope.mfbSetting = {
                    effect: 'zoomin',
                    position: 'br',
                    method: 'click',
                    action: 'fire'
                };

                scope.mfbSetting.effect = effect || scope.mfbSetting.effect;
                scope.mfbSetting.position = position || scope.mfbSetting.position;
                scope.mfbSetting.method = method || scope.mfbSetting.method;


                var navElem = angular.element("<nav>").attr({
                    'mfb-menu': true,
                    'position': scope.mfbSetting.position,
                    'effect': scope.mfbSetting.effect,
                    'active-icon': activeicon,
                    'resting-icon': restingicon,
                    'ng-mouseenter': ngmouseenter,
                    'ng-mouseleave': ngmouseleave,
                    'toggling-method': scope.mfbSetting.method,
                    'menu-state': menustate,
                    'main-action': mainaction,
                });

                //var buttons = field['Value'];
                if (buttons.indexOf('group.') == 0)
                    buttons = scope.$eval(buttons);
                else
                    buttons = zSrv_InputCustom.formFields({ name: buttons });

                //var buttons = scope.$eval(field['Value']);
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i]['Type'] != 'a')
                        continue;

                    var div02 = angular.element("<div>");
                    // if Visible is not null or undefined and not empty
                    var isVisible = true;
                    if ((buttons[i]['Visible'] ? true : false) && buttons[i]['Visible'] != '') {
                        //div02.attr('ng-show', buttons[i]['Visible']);
                        isVisible = buttons[i]['Visible'];
                    }
                    //for access grants control
                    var ngIf_ByButtonName = 'group.ngIfByButtonName("' + fieldname + '")';
                    var ngIf_Flag = scope.$eval(ngIf_ByButtonName);
                    var isVisible_Flag = scope.$eval(isVisible);
                    if (ngIf_Flag == false || isVisible_Flag == false)
                        continue;
                    //div02.attr({
                    //    'ng-show': isVisible,

                    //    'ng-if': ngIf_ByButtonName
                    //});

                    var btnElem = angular.element("<button>").attr({
                        'mfb-button': true,
                        'icon': buttons[i]['Icon'],
                        'ng-click': buttons[i]['ClickEvent'],
                        'label': buttons[i]['Label'],
                        //'ng-show': isVisible,
                        //'ng-if': ngIf_ByButtonName
                        //'ng-repeat': 'button in ' + field['Value'],
                    });
                    //div02.append(btnElem);
                    navElem.append(btnElem);
                }
                element.append(navElem);

                //element.append(img);
                $compile(element.contents())(scope);
            }


            $timeout(function () {
                generateMFB();
            }, 2500);

            //$rootScope.$watch('refreshImage', function (newValue, oldValue) {
            //    if (newValue == true)
            //        generateMFB();
            //});

        },
        restrict: "E",
        replace: true
    }
}]);