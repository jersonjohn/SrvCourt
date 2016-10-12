angular.module("zDir_Buttons", ['zDir_zuiMenu'])
.directive("zbuttons", ['$compile', '$rootScope', 'zSrv_InputCustom', 'zSrv_Field', '$location',
    function ($compile, $rootScope, zSrv_InputCustom, zSrv_Field, $location) {
    return {
        //scope: {
        //    buttons: "@",
        //    index: "@",
        //    group: "=",
        //    modalGroup: "=modalgroup"
        //},
        link: function (scope, element, attrs) {

            scope.accessGrantControl = function (btnName) {
                var pathName = $location.path().split('/');
                if (pathName[1].length > 0) {
                    var p = '/' + pathName[1];
                    if (p == "/myProfile") return true;
                    if ($rootScope.menusAccessGrants && $rootScope.menusAccessGrants[p]) {
                        //      group.OAuthAccessGrants = $rootScope.menusAccessGrants[p];
                        $rootScope.OAuthAccessGrants = $rootScope.menusAccessGrants[p];
                    }
                }
                var acc = $rootScope.byPassAccessGrants || $rootScope.OAuthAccessGrants;
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

            scope.ismdButtonBadgetValueZero = function (varName) {
                return Number(varName) == 0;
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
            }

            var _createSM_MenuItem = function (menuItem) {

                var div_MenuItem = angular.element('<li style="cursor:pointer">');
                var item = menuItem;
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
                return div_MenuItem;
            }

            var generateButton = function () {
                var buttons = attrs["buttons"];
                //var buttons = scope.buttons; // attrs["buttons"];
                if(buttons.indexOf('group.') == 0)
                    buttons = scope.$eval(buttons);
                else
                    buttons = zSrv_InputCustom.formFields({ name: buttons }); 
                
                //var index = attrs.index;
                zSrv_Field.getFormFields(buttons).then(function (d) {
                    if (d)
                        buttons = d;
                    _generateButtonStart(buttons);
                });
            }

            var _generateButtonStart = function (buttons) {
                //console.log('buttons in zbutton directive is ' + JSON.stringify(buttons));
                element.html("");
                var div_md = angular.element('<div class="bs-component mb20 hidden-sm hidden-xs">');

                var div_sm = angular.element('<div class="btn-group bs-component mb20 hidden-lg hidden-md">');
                var div_sm_div02 = angular.element('<span class="btn-group">');  //'<span class="navbar-btn btn-group zuiMenu">'); //.attr('style', 'margin-top:0;margin-bottom=0');
                var div_sm_divBtn = angular.element(
                        '<a type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                            '<span class="glyphicon glyphicon-option-vertical"></span> Actions <span class="caret ml5"></span>' +
                        '</a>'
                    );
                    //'<a data-toggle="dropdown" href="" ng-click="$mdOpenMenu($event)" ng-disabled="" class="btn btn-md dropdown-toggle btn btn-primary ng-scope" aria-disabled="false" aria-expanded="false"><span class="glyphicon glyphicon-option-vertical"></span> Actions</a>');

                var div_sm_divMenuContent = angular.element('<ul class="dropdown-menu pv5 animated animated-short fadeIn" role="menu">');
                div_sm_div02.append(div_sm_divBtn);
                div_sm_div02.append(div_sm_divMenuContent);
                div_sm.append(div_sm_div02);



                //var div_sm_btn = angular.element('<a href="#" class="btn btn-primary dropdown-toggle fw600" data-toggle="dropdown">').html(
                //    '<span>More Actions</span>' +
                //    '<span class="fa fa-caret-down mr15"></span>'
                //    );
                //var div_sm_content = angular.element('<ul class="dropdown-menu list-group keep-dropdown w250" role="menu">');
                //div_sm.append(div_sm_btn);
                //div_sm.append(div_sm_content);

                //.addClass("visible-md-block visible-lg-block");
                //var div_sm = angular.element("<div>").addClass("btn-group visible-sm-block");
                //var div_xs = angular.element("<div>").addClass("btn-group btn-group-justified visible-xs-block");

                for (var i = 0; i < buttons.length; i++) {
                    switch (buttons[i]["Type"]) {
                        case 'zuiselect':
                            var div02 = angular.element("<span>");
                            _setSpanVisible(div02, buttons[i]);

                            var divA = angular.element("<zuiselectmultiple>").attr({
                                'id': buttons[i]['Name'],
                                'name': buttons[i]['Name'],
                                'group': 'group',
                                'modalgroup': 'modalGroup',
                                'multiple': buttons[i]['Multiple'],
                                //'scope': scope,
                                //'divclass': buttons[i]['DivClass'],
                                'value': buttons[i]['SelectedModel'],
                                'options': buttons[i]["Options"],
                                'onchange': buttons[i]["OnChangedEvent"]
                            });

                            _removeNotRequiredAttributes(divA, buttons[i]);

                            // if Icon contain undefined or null or empty
                            if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                                divA.text(buttons[i]['Label']);
                            } else {
                                divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"])
                            }

                            div02.append(divA);
                            div_md.append(div02);

                            var div_span = angular.element("<span>");
                            _setSpanVisible(div_span, buttons[i]);
                            var divBtn = angular.copy(divA);
                            div_span.append(divBtn);
                            div_sm.append(div_span);
                            break;
                        case 'zuiButtonBadge':
                            var div02 = angular.element("<span>");
                            _setSpanVisible(div02, buttons[i]);

                            var divA = angular.element("<a>").addClass(buttons[i]['DivClass']).attr({
                                //    'tabindex': Number(index + '.' + Number(Number(i) + 1)),
                                'href': buttons[i]['URL'],
                                'ng-click': buttons[i]['ClickEvent'],
                                'ng-disabled': buttons[i]["Disabled"]
                            });

                            _removeNotRequiredAttributes(divA, buttons[i]);

                            // if Icon contain undefined or null or empty
                            if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                                divA.text(buttons[i]['Label']);
                            } else {
                                divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"] + ' <span class="badge badge-warning"> {{' + buttons[i]["Value"] + '}} </span>')
                            }

                            var divSpan = angular.element("<span>").html("&nbsp;");
                            div02.append(divA);
                            div02.append(divSpan);
                            div_md.append(div02);
                                                        
                            var div_span = angular.element("<span>");
                            _setSpanVisible(div_span, buttons[i]);
                            var divBtn = angular.element('<button type="button" class="btn btn-primary dark">').html('<i class="' + buttons[i]["Icon"] + '"></i>');
                            divBtn.attr({
                                'href': buttons[i]['URL'],
                                'ng-click': buttons[i]['ClickEvent'],
                                'ng-disabled': buttons[i]["Disabled"]
                            });
                            _removeNotRequiredAttributes(divBtn, buttons[i]);
                            div_span.append(divBtn);
                            div_sm.append(div_span);
                            break;
                        //case 'zmdButtonBadge':
                        //    var div02 = angular.element("<span>");
                        //    _setSpanVisible(div02, buttons[i]);
                        //    var divA = angular.element("<md-button>").addClass(buttons[i]['DivClass']).attr({
                        //        'href': buttons[i]['URL'],
                        //        'ng-click': buttons[i]['ClickEvent'],
                        //        'ng-disabled': buttons[i]["Disabled"] || 'ismdButtonBadgetValueZero(' + buttons[i]["Value"] + ')'
                        //    });
                        //    _removeNotRequiredAttributes(divA, buttons[i]);
                        //    if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                        //        divA.html(buttons[i]['Label'] + '<md-badge ng-class="{\'md-warn\': warn()}">{{' + buttons[i]["Value"] + '}}</md-badge>');
                        //    } else {
                        //        divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"] + '<md-badge ng-class="{\'md-warn\': warn()}">{{' + buttons[i]["Value"] + '}}</md-badge>')
                        //    }
                        //    var divSpan = angular.element("<span>").html("&nbsp;");
                        //    div02.append(divA);
                        //    div02.append(divSpan);
                        //    div_md.append(div02);
                        //    break;
                        //case 'zmdButton':
                        //    var div02 = angular.element("<span>");
                        //    _setSpanVisible(div02, buttons[i]);
                        //    var divA = angular.element("<md-button>").addClass(buttons[i]['DivClass']).attr({
                        //        'href': buttons[i]['URL'],
                        //        'ng-click': buttons[i]['ClickEvent'],
                        //        'ng-disabled': buttons[i]["Disabled"]
                        //    });
                        //    _removeNotRequiredAttributes(divA, buttons[i]);
                        //    if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                        //        divA.text(buttons[i]['Label']);
                        //    } else {
                        //        divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"])
                        //    }
                        //    var divSpan = angular.element("<span>").html("&nbsp;");
                        //    div02.append(divA);
                        //    div02.append(divSpan);
                        //    div_md.append(div02);
                        //    break;
                        case 'zuiMenu':
                            var div02 = angular.element("<zuiMenu>").attr({
                                'Name': buttons[i]['Name'],
                                'Type': buttons[i]['Type'],
                                'Value': buttons[i]['Value'],
                                'Width': buttons[i]['Width'],
                                //'DivClass': buttons[i]['DivClass'],
                                //'Offset': buttons[i]['Offset'],
                                'Visible': buttons[i]['Visible'],
                                //'Disabled': buttons[i]['Disabled'],
                                //'ClickEvent': buttons[i]['ClickEvent'],
                                //'URL': buttons[i]['URL'],
                                //'Icon': buttons[i]['Icon'],
                                //'Label': buttons[i]['Label'],
                                'AppendDivClearFix': buttons[i]['AppendDivClearFix'],
                            }).html(
                                '<a type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                                    '<span class="' + buttons[i]['Icon'] + '"></span> ' +
                                    buttons[i]['Label'] +
                                    '<span class="caret ml5"></span>' +
                                '</a>'
                            );

                            //    .html(   //text(buttons[i]['Label']);
                            //    '<a data-toggle="dropdown" ' + 
                            //    'href="' + buttons[i]['URL'] + '" ' +
                            //    'ng-click="' + buttons[i]['ClickEvent'] + '" ' +
                            //    'ng-disabled="' + buttons[i]['Disabled'] + '" ' +
                            //    'class="btn btn-md dropdown-toggle ' + buttons[i]['DivClass'] + '">' +
                            //    '<span class="' + buttons[i]['Icon'] + '"></span> ' +
                            //    buttons[i]['Label'] +
                            //    '</a>'
                            //);
                            div_md.append(div02);

                            //var div_span = angular.element("<span>");
                            //_setSpanVisible(div_span, buttons[i]);
                            //var div02_sm = angular.element("<zuiMenu>").attr({
                            //    'Name': buttons[i]['Name'],
                            //    'Type': buttons[i]['Type'],
                            //    'Value': buttons[i]['Value'],
                            //    'Width': buttons[i]['Width'],
                            //    'Visible': buttons[i]['Visible'],
                            //    'AppendDivClearFix': buttons[i]['AppendDivClearFix'],
                            //})
                            //var divBtn = angular.element('<button type="button" data-toggle="dropdown" class="btn btn-primary dark dropdown-toggle">').html('<i class="' + buttons[i]["Icon"] + '"></i>');
                            //divBtn.attr({
                            //    'href': buttons[i]['URL'],
                            //    'ng-click': buttons[i]['ClickEvent'],
                            //    'ng-disabled': buttons[i]["Disabled"]
                            //});
                            //_removeNotRequiredAttributes(divBtn, buttons[i]);
                            //div02_sm.append(divBtn)
                            //div_span.append(div02_sm);
                            //div_sm.append(div_span);
                            div_sm.append(angular.copy(div02));
                            break;
                            break;
                        //case 'zmdMenu':
                        //    var div02 = angular.element("<zmdMenu>").attr({
                        //        'Name': buttons[i]['Name'],
                        //        'Type': buttons[i]['Type'],
                        //        'Value': buttons[i]['Value'],
                        //        'Width': buttons[i]['Width'],
                        //        'DivClass': buttons[i]['DivClass'],
                        //        'Offset': buttons[i]['Offset'],
                        //        'Visible': buttons[i]['Visible'],
                        //        'Disabled': buttons[i]['Disabled'],
                        //        'ClickEvent': buttons[i]['ClickEvent'],
                        //        'URL': buttons[i]['URL'],
                        //        'Icon': buttons[i]['Icon'],
                        //        //'Label': buttons[i]['Label'],
                        //        'AppendDivClearFix': buttons[i]['AppendDivClearFix'],
                        //    }).text(buttons[i]['Label']);
                        //    //if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                        //    //    divA.text(buttons[i]['Label']);
                        //    //} else {
                        //    //    divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"])
                        //    //}
                        //    //var div_mdMenuContent = angular.element("<md-menu-content>").attr({
                        //    //    'width': '4',
                        //    //});
                        //    //var menuItems = zSrv_InputCustom.formFields({ name: buttons[i]["Value"] });
                        //    //for (var j = 0; j < menuItems.length; j++) {
                        //    //    var div_mdMenuItem = angular.element("<md-menu-item>");
                        //    //    var item = menuItems[j];
                        //    //    var divItem = angular.element("<md-button>").attr({
                        //    //        'href': item['URL'],
                        //    //        'ng-click': item['ClickEvent'],
                        //    //        'ng-disabled': item["Disabled"]
                        //    //    });
                        //    //    // if Icon contain undefined or null or empty
                        //    //    if ((item["Icon"] ? false : true) || item["Icon"] == '') {
                        //    //        divItem.text(item['Label']);
                        //    //    } else {
                        //    //        divItem.html('<span class="' + item["Icon"] + '"></span> ' + item["Label"])
                        //    //    }
                        //    //    div_mdMenuItem.append(divItem);
                        //    //    div_mdMenuContent.append(div_mdMenuItem);
                        //    //}
                        //    //div02.append(div_mdMenu);
                        //    //div_mdMenu.append(divA);
                        //    //div_mdMenu.append(div_mdMenuContent);
                        //    div_md.append(div02);
                        //    //var sm_li = angular.element('<li class="list-group-item">');
                        //    //sm_li.append(angular.copy(div02));
                        //    //div_sm_content.append(sm_li);
                        //    break;
                        case 'a':
                            var div02 = angular.element("<span>");
                            _setSpanVisible(div02, buttons[i]);

                            var divA = angular.element("<a>").addClass(buttons[i]['DivClass']).attr({
                            //    'tabindex': Number(index + '.' + Number(Number(i) + 1)),
                                'href': buttons[i]['URL'],
                                'ng-click': buttons[i]['ClickEvent'],
                                'ng-disabled': buttons[i]["Disabled"]
                            });

                            _removeNotRequiredAttributes(divA, buttons[i]);

                            // if Icon contain undefined or null or empty
                            if ((buttons[i]["Icon"] ? false : true) || buttons[i]["Icon"] == '') {
                                divA.text(buttons[i]['Label']);
                            } else {
                                divA.html('<span class="' + buttons[i]["Icon"] + '"></span> ' + buttons[i]["Label"])
                            }

                            div02.append(divA);
                            div_md.append(div02);
                                                       
                            var div_sm_item = _createSM_MenuItem(buttons[i]);
                            div_sm_divMenuContent.append(div_sm_item);
                            //var div_span = angular.element("<span>");
                            //_setSpanVisible(div_span, buttons[i]);
                            //var divBtn = angular.element('<button type="button" class="btn btn-primary dark">').html('<i class="' + buttons[i]["Icon"] + '"></i>');
                            //divBtn.attr({
                            //    'href': buttons[i]['URL'],
                            //    'ng-click': buttons[i]['ClickEvent'],
                            //    'ng-disabled': buttons[i]["Disabled"]
                            //});
                            //_removeNotRequiredAttributes(divBtn, buttons[i]);
                            //div_span.append(divBtn);
                            //div_sm.append(div_span);
                            break;
                        //case 'ng-dropdown-multiselect':
                        //    var div02 = angular.element("<span>");
                        //    div02.attr({
                        //        'ng-dropdown-multiselect': '',
                        //        'options': buttons[i]["Options"],
                        //        'selected-model': buttons[i]["SelectedModel"],
                        //        'extra-settings': buttons[i]["ExtraSettings"],
                        //        'events': "{ onItemSelect: " + buttons[i]["OnChangedEvent"] + " }"
                        //    })
                        //    div_md.append(div02);
                        //    div_sm.append(angular.copy(div02));
                        //    break;
                    }
                    if (buttons[i]['AppendDivClearFix']) {
                        var divClearFix = angular.element("<div>").addClass('clearfix');
                        div_md.append(divClearFix);
                    }
                }
                element.append(div_md);
                element.append(div_sm);
                //element.append(div_sm);
                //element.append(div_xs);            

                $compile(element.contents())(scope);
            }

            scope.$watch('buttons', function (newValue, oldValue) {
                generateButton();
            });
        },
        restrict: "E",
        replace: true
    }
}]);