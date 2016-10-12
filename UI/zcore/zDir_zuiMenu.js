angular.module("zDir_zuiMenu", [])
.directive("zuimenu", ['$compile', '$rootScope', 'zSrv_InputCustom', 'zSrv_Field', function ($compile, $rootScope, zSrv_InputCustom, zSrv_Field) {
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

                var div02 = angular.element('<span class="btn-group">');
                    // angular.element('<span class="navbar-btn btn-group zuiMenu">');
                var divBtn = transclude();
               
                var divMenuContent = angular.element('<ul class="dropdown-menu pv5 animated animated-short fadeIn" role="menu">');
                div02.append(divBtn);
                div02.append(divMenuContent);
                      
                var menuItems = zSrv_InputCustom.formFields({ name: attrs["value"] });
                zSrv_Field.getFormFields(menuItems).then(function (d) {
                    if (d)
                        menuItems = d;

                    for (var j = 0; j < menuItems.length; j++) {
                        var div_MenuItem = angular.element('<li style="cursor:pointer">');
                        var item = menuItems[j];
                        var divItem = angular.element("<a>").attr({
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

                        div_MenuItem.append(divItem);
                        divMenuContent.append(div_MenuItem);

                    }

                    if (attrs['appenddivclearfix']) {
                        var divClearFix = angular.element("<div>").addClass('clearfix');
                        div02.append(divClearFix);
                    }
                    element.append(div02);

                    $compile(element.contents())(scope);
                });
            }

            generateButton();
        },
        restrict: "E",
        transclude: true,
        replace: false
    }
}]);