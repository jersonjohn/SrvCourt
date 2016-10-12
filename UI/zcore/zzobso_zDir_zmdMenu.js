angular.module("zDir_zmdMenu", [])
.directive("zmdmenu", ['$compile', '$rootScope', 'zSrv_InputCustom', function ($compile, $rootScope, zSrv_InputCustom) {
    return {
        link: function (scope, element, attrs, ctrl, transclude) {

            scope.accessGrantControl = function (btnName) {
                var acc = $rootScope.OAuthAccessGrants;
                switch (btnName) {
                    case 'ZBtn_Save':
                        if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
                            return true;
                        break;
                    case 'ZBtn_Update':
                        if (acc.indexOf('Admin') != -1 || acc.indexOf('Update') != -1)
                            return true;
                        break;
                    case 'ZBtn_New':
                        if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
                            return true;
                        break;
                    case 'ZBtn_CloneNew':
                        if (acc.indexOf('Admin') != -1 || acc.indexOf('Create') != -1)
                            return true;
                        break;
                    case 'ZBtn_Delete':
                        if (acc.indexOf('Admin') != -1 || acc.indexOf('Delete') != -1)
                            return true;
                        break;
                    default:
                        return true;
                }
                return false;
            }


            var _setSpanVisible = function (d, button) {
                var isVisible = true;
                if ((button["Visible"] ? true : false) && button["Visible"] != '') {
                    //div02.attr('ng-show', buttons[i]['Visible']);
                    isVisible = button['Visible'];
                }
                //for access grants control
                var ngIf_ByButtonName = 'accessGrantControl("' + button["Name"] + '")';
                d.attr({
                    'ng-show': isVisible,
                    'ng-if': ngIf_ByButtonName
                });
            }

            var _removeNotRequiredAttributes = function (d, button) {
                // remove attr href when it contain undefined or null or empty.
                if ((button["URL"] ? false : true) || button["URL"] == '')
                    d.removeAttr('href');

                // remove attr ng-click when it contain undefined or null or empty.
                if ((button["ClickEvent"] ? false : true) || button["ClickEvent"] == '')
                    d.removeAttr('ng-click');

                // remove attr ng-disabled when it contain undefined or null or empty.
                if ((button["Disabled"] ? false : true) || button["Disabled"] == '')
                    d.removeAttr('ng-disabled');
            }


            var generateButton = function () {
                element.html("");
                //var div_md = angular.element("<div>");

                var div02 = angular.element("<span>");
                var div_mdMenu = angular.element("<md-menu>").attr({
                    'md-offset': attrs['offset'],
                });
                var divA = angular.element("<md-button>").addClass(attrs['divclass']).attr({
                    'href': attrs['urL'],
                    'ng-click': attrs['clickevent'],
                    'ng-disabled': attrs["disabled"]
                });

                // if Icon contain undefined or null or empty
                //var labelValue = '<ng-transclude></ng-transclude>';
                if ((attrs["icon"] ? false : true) || attrs["icon"] == '') {
                    divA.append(transclude());
                } else {
                    divA.html('<span class="' + attrs["icon"] + '"></span> ').append(transclude());
                }

                var div_mdMenuContent = angular.element("<md-menu-content>").attr({
                    'width': attrs["width"],
                });
                var menuItems = zSrv_InputCustom.formFields({ name: attrs["value"] });
                for (var j = 0; j < menuItems.length; j++) {
                    var div_mdMenuItem = angular.element("<md-menu-item>");
                    var item = menuItems[j];
                    var divItem = angular.element("<md-button>").attr({
                        'href': item['URL'],
                        'ng-click': item['ClickEvent'],
                        'ng-disabled': item["Disabled"]
                    });
                    // if Icon contain undefined or null or empty
                    if ((item["Icon"] ? false : true) || item["Icon"] == '') {
                        divItem.text(item['Label']);
                    } else {
                        divItem.html('<span class="' + item["Icon"] + '"></span> ' + item["Label"])
                    }

                    _setSpanVisible(divItem, item);
                    _removeNotRequiredAttributes(divItem, item);

                    div_mdMenuItem.append(divItem);
                    div_mdMenuContent.append(div_mdMenuItem);

                }
                div02.append(div_mdMenu);
                div_mdMenu.append(divA);
                div_mdMenu.append(div_mdMenuContent);
                //div_mdMenuContent.append(div_mdMenuItem);
                //div_mdMenuItem.append(divItem);
                //div_md.append(div02);
                        
                if (attrs['appenddivclearfix']) {
                    var divClearFix = angular.element("<div>").addClass('clearfix');
                    div02.append(divClearFix);
                }
                element.append(div02);

                $compile(element.contents())(scope);
            }

            //scope.$watch('buttons', function (newValue, oldValue) {
                generateButton();
            //});
        },
        restrict: "E",
        transclude: true,
        replace: false
    }
}]);