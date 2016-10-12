angular.module("zDir_InputCustom", ["zDir_Buttons", "zDir_ConvertToNumber", "zDir_ZGrid", "zDir_zuiSelectMultiple", "zDir_zJsonText", "zDir_zErrorMessage", "ui.codemirror"])
.directive("zInput", ['$compile', '$location', '$window', '$sce', 'zSrv_InputCustom', '$timeout', function ($compile, $location, $window, $sce, zSrv_InputCustom, $timeout) {
    return {
        //scope: {
        //    field: "=",
        //    group: "=",
        //    modalGroup: "=modalgroup",
        //    zform: "@",
        //    zmodel: "@",
        //    index: "@",
        //    id: "@"
        //},
        restrict: 'E',
        replace: true,
        compile: function (element, attrs, transclude) {

            

            var addElement = function addElement(scope, element, attrs, ctrl, field) {
                var zform = attrs['zform'];
                if (!field)
                    field = scope[attrs["field"]];
                if (field == undefined && scope.f_tab)
                    field = scope.f_tab[attrs["field"]];
                if (field == undefined && scope.f_panel)
                    field = scope.f_panel[attrs["field"]];
                var zmodel = attrs['zmodel'];
                var index = attrs['index'];
                var tabId = attrs['id'];

               


                //var group = scope.group;
                var showlabel = false;
                //if (typeof  field['ShowLabel'] != 'undefined')
                if (!field)
                    return;

                if ("ShowLabel" in field)
                    showlabel = field.ShowLabel;

   
                // if Visible is not null or undefined and not empty
                var isVisible = true;
                if ((field["Visible"] ? true : false) && field["Visible"] != '') {
                    //div02.attr('ng-show', buttons[i]['Visible']);

                    isVisible = field['Visible'];
                }

                var div00 = angular.element("<div>").addClass(field['DivClass']).attr({
                    'ng-show': isVisible + ' && getTabVisible("' + field.TabArea + '")'
                });
                var divLabel = null;
                if (showlabel != false) {
                    divLabel = angular.element("<label>").addClass('control-label').attr('for', field['Value']).text(field['Label']);;
                    //console.log('showlabel is ' + showlabel);
                };

                var _generateFormElement = function (elementType) {
                    var gui_class = 'gui-input';
                    if (elementType == 'textarea') gui_class = ''; //'gui-textarea';
                    var divInput = angular.element("<" + elementType + ">").addClass(gui_class).addClass('form-control').attr({
                        'type': field["Type"],
                        'name': field["Name"],
                        'id': field['Value'],
                        //               'tabindex': Number(index) + 1,
                        'placeholder': field["PlaceHolder"],
                        'ng-model': zmodel + '.' + field['Value'],  // zmodel + '[field.Value]',
                        'ng-model-options': field['UpdateOnBlur'] == false ? null : '{ updateOn: "default blur", debounce: { "default": 500, "blur": 250 } }',
                        'ng-minlength': field["MinLength"],
                        'maxlength': field["MaxLength"] > 0 ? field["MaxLength"] : null,
                        'ng-change': field['OnChange'],
                        'ng-required': field["IsRequired"] + ' && ' + isVisible,
                        'ng-readonly': field["ReadOnly"],
                        'tooltip-enable': zform + '.name.$dirty && ' + zform + '.name.$invalid',
                        'tooltip-trigger': 'focus',
                        'tooltip-placement': 'bottom',
                        'uib-tooltip': "{{errorTooltipMessage}}",
                        'ng-click': 'setTooltipMessage()',
                        'ng-blur': field['ngBlur'],
                        'zvalidate': field['zValidate'],
                        'zvalidate-event': field['zValidateEvent'],
                        'zerrormessage': true

                    });


                    // remove attr placeholder when it contain undefined or null or empty or zero.
                    if ((field["PlaceHolder"] ? false : true) || field["PlaceHolder"] == '' || field["PlaceHolder"] == 0)
                        divInput.removeAttr('placeholder');

                    // remove attr ng-model when it contain undefined or null or empty or zero.
                    if ((field["Value"] ? false : true) || field["Value"] == '' || field["Value"] == 0)
                        divInput.removeAttr('ng-model');

                    // remove attr placeholder when it contain undefined or null or empty or zero.
                    if ((field["MinLength"] ? false : true) || field["MinLength"] == '' || field["MinLength"] == 0)
                        divInput.removeAttr('ng-minlength');

                    // remove attr placeholder when it contain undefined or null or empty or zero.
                    if ((field["MaxLength"] ? false : true) || field["MaxLength"] == '' || field["MaxLength"] == 0)
                        divInput.removeAttr('ng-maxlength');

                    // remove attr placeholder when it contain undefined or null or empty or zero.
                    if ((field["IsRequired"] ? false : true) || field["IsRequired"] == '' || field["IsRequired"] == 0)
                        divInput.removeAttr('ng-required');

                    // remove attr ng-readonly when it contain undefined or null or empty or zero.
                    if ((field["ReadOnly"] ? false : true) || field["ReadOnly"] == '' || field["ReadOnly"] == 0)
                        divInput.removeAttr('ng-readonly');

                    // remove attr ng-model-options when it contain undefined or null or empty or false.
                    if ((field["UpdateOnBlur"] ? false : true) || field["UpdateOnBlur"] == '' || field["UpdateOnBlur"] == false)
                        divInput.removeAttr('ng-model-options');

                    return divInput
                }

                var div01 = null;
                if (field['Type'] == 'zbuttons') {
                    div01 = angular.element("<div>");
                } else {
                    div01 = angular.element("<div>").addClass('form-group').attr({
                        'ng-form': 'F1',
                        'ng-class': 'zformValidation("' + field['Name'] + '")',
                        // 'ng-class': '{ "has-success": ' + zform + '.n.$dirty && !' + zform + '.n.$invalid' +
                        //     ', "has-error": ' + zform + '.n.$dirty && ' + zform + '.n.$invalid' + ' , "has-feedback": false }'
                        //, 'has-error': {{" + zform + ".name.$invalid}}, 'has-feedback': {{" + zform + ".name.$dirty}} }"
                    });

                    if (field["IsRequired"])
                        div01.addClass('required');
                }

                if (showlabel)
                    div01.append(divLabel);


                switch (field['Type']) {
                    //case 'ztab':
                    //    if (scope.f_tab == undefined)
                    //        scope.f_tab = {};  //for zdiv field holder
                    //    field.Name = field.Name + Math.floor((Math.random() * 1000000) + 1);
                    //    scope.f_tab[field.Name] = [];
                    //    scope.f_tab[field.Name] = field.Value;
                    //    div01 = null;
                    //    div00 = angular.element('<ztab>').attr({
                    //        'name': field.Name,
                    //        //'field': field.Name,
                    //        'label': field.Label,
                    //        // 'zmodel': 'group.zModel',
                    //        // 'index': '{{$index + 1}}',
                    //        'group': 'group'
                    //    });
                    //    break;
                    //case 'zdiv':
                    //    if (scope.f_tab == undefined)
                    //        scope.f_tab = {};  //for zdiv field holder
                    //    div01 = null;
                    //    div00 = angular.element('<zdiv>').attr({
                    //        'name': field.Name,
                    //        'field': field.Name,
                    //        'label': field.Label,
                    //        // 'zmodel': 'group.zModel',
                    //        // 'index': '{{$index + 1}}',
                    //        'group': 'group'
                    //    });
                    //    div00 = angular.element('<div>').addClass(field['DivClass']).attr({
                    //        'id': field['Id']
                    //    });
                        //for (var i = 0; i < field.Value.length; i++) {
                        //    var f_name = field.Name + Math.floor((Math.random() * 1000000) + 1); //field.Value[i].Name;
                        //    scope.f_tab[f_name] = field.Value[i];
                        //    var div_zInput = angular.element('<z-input>').attr({
                        //        'field': f_name,
                        //        'zform': 'F1',
                        //        'zmodel': 'group.zModel',
                        //        'index': '{{$index + 1}}',
                        //        'group': 'group'
                        //    });
                        //    //if (divTabContent) {
                        //    //    div_zInput.attr('id', 't' + i);
                        //    //    divTabContent.append(div_zInput);
                        //    //}
                        //    //else
                        //    div00.append(div_zInput);
                        //}
                        //break;
                    //case 'zpanel':
                    //    if (scope.f_panel == undefined)
                    //        scope.f_panel = {};
                    //    field.Name = field.Name + Math.floor((Math.random() * 1000000) + 1);
                    //    scope.f_panel[field.Name] = [];
                    //    scope.f_panel[field.Name] = field.Value;
                    //    div01 = null;
                    //    div00 = angular.element('<zpanel>').addClass('allcp-panels').attr({
                    //        'name': field.Name,
                    //        'id': field.Name,  // + Math.floor((Math.random() * 1000000) + 1),
                    //        'label': field.Label,
                    //        'panelremove': field['PanelRemove'],
                    //        'panelcolor': field['PanelColor'],
                    //        'panelfullscreen': field['PanelFullScreen'],
                    //        'paneltitle': field['PanelTitle'],
                    //        'panelcollapse': field['PanelCollapse']
                    //        //'group': 'group'
                    //    });
                    //    break;
                    case 'zhtmleditor':
                        //if (showlabel) {
                        // Type == checkbox, the label text need to put after the input element
                        var htmleditor = angular.element("<summernote>").attr({
                            'name': field['Name'],
                            'id': field['Name'],
                            'value': zmodel + '.' + field.Value,
                            'ng-model': zmodel + '.' + field.Value,
                            'onchange': field['OnChange'],
                            'label': field['Label'],
                            'on-image-upload': field['imageUpload'],
                            'on-keyup': field['keyup'],
                            'on-blur': field['blur'],
                            'on-focus': field['focus'],
                            'on-enter': field['enter'],
                            'on-init': field['init'],
                            'readonly': field['ReadOnly'],
                            'editable': field['Editable'],
                            'editor': field['Editor'],
                            'showLabel': field.ShowLabel ? field.ShowLabel : false,
                        });
                        div01.append(htmleditor);
                        break;

                    case 'checkbox':
                        //if (showlabel) {
                        // Type == checkbox, the label text need to put after the input element
                        var divCheckBox = angular.element("<zuicheckbox>").attr({
                            'name': field['Name'],
                            'id': field['Name'],
                            'value': zmodel + '.' + field.Value,
                            'onchange': field['OnChange'],
                            'label': field['Label'],
                            'readonly': field['ReadOnly'],
                            'showLabel': field.ShowLabel ? field.ShowLabel : false,
                        });
                        div01.append(divCheckBox);
                        break;
                    case 'zlabel':
                        var div02 = angular.element("<div>").addClass(field['DivClass']);
                        div02.text(field['Label']);
                        element.append(div02);
                        break;
                    case 'za':
                        var div02 = angular.element("<span>");
                        // if Visible is not null or undefined and not empty
                        var isVisible = true;
                        if ((field['Visible'] ? true : false) && field['Visible'] != '') {
                            //div02.attr('ng-show', buttons[i]['Visible']);
                            isVisible = field['Visible'];
                        }
                        //for access grants control
                        var ngIf_ByButtonName = 'group.ngIfByButtonName("' + field["Name"] + '")';
                        div02.attr({
                            'ng-show': isVisible,

                            'ng-if': ngIf_ByButtonName
                        });

                        var divA = angular.element("<a>").addClass(field['DivClass']).attr({
                            //'tabindex': Number(index + '.' + Number(Number(i) + 1)),
                            //'style': 'inline',
                            'href': field['URL'],
                            'ng-click': field['ClickEvent'],
                            'ng-disabled': field['Disabled']
                        });

                        // remove attr href when it contain undefined or null or empty.
                        if ((field['URL'] ? false : true) || field['URL'] == '')
                            divA.removeAttr('href');

                        // remove attr ng-click when it contain undefined or null or empty.
                        if ((field['ClickEvent'] ? false : true) || field['ClickEvent'] == '')
                            divA.removeAttr('ng-click');

                        // remove attr ng-disabled when it contain undefined or null or empty.
                        if ((field['Disabled'] ? false : true) || field['Disabled'] == '')
                            divA.removeAttr('ng-disabled');


                        // if Icon contain undefined or null or empty
                        if ((field['Icon'] ? false : true) || field['Icon'] == '') {
                            divA.text(field['Label']);
                        } else {
                            divA.html('<span class="' + field['Icon'] + '"></span> ' + field['Label'])
                        }

                        var divSpan = angular.element("<span>").html("&nbsp;");
                        div02.append(divA);
                        div02.append(divSpan);
                        element.append(div02);
                        break;
                    case 'zmfb':
                        var divMFB = angular.element('<zmfb>').attr({
                            'effect': field['mfb_effect'],
                            'position': field['mfb-position'],
                            'method': field['mfb_toggleMethod'],
                            'activeicon': field['mfb_active_icon'],
                            'restingicon': field['mfb_resting_icon'],
                            'ngmouseenter': field['mfb_mouseEnter'],
                            'ngmouseleave': field['mfb_mouseLeave'],
                            'menustate': field['mfb_menuState'],
                            'mainaction': field['mfb_mainAction'],
                            'fieldname': field['Name'],
                            'buttons': field['Value']
                        })

                        //if (field['mfb_effect'])
                        //    scope.mfbSetting.effect = field['mfb_effect'];
                        //if (field['mfb_position'])
                        //    scope.mfbSetting.position = field['mfb_position']
                        //if (field['mfb_toggleMethod'])
                        //    scope.mfbSetting.method = field['mfb_toggleMethod']
                        //var navElem = angular.element("<nav>").attr({
                        //    'mfb-menu': true,
                        //    'position': '{{mfbSetting.position}}',
                        //    'effect': '{{mfbSetting.effect}}',
                        //    'active-icon': field['mfb_active_icon'],
                        //    'resting-icon': field['mfb_resting_icon'],
                        //    'ng-mouseenter': field['mfb_mouseEnter'],
                        //    'ng-mouseleave': field['mfb_mouseLeave'],
                        //    'toggling-method': '{{mfbSetting.method}}',
                        //    'menu-state': field['mfb_menuState'],
                        //    'main-action': field['mfb_mainAction'],
                        //});
                        //var buttons = field['Value'];
                        //if(buttons.indexOf('group.') == 0)
                        //    buttons = scope.$eval(buttons);
                        //else
                        //    buttons = zSrv_InputCustom.formFields({ name: buttons });
                        // //var buttons = scope.$eval(field['Value']);
                        // for (var i = 0; i < buttons.length; i++) {
                        //    if (buttons[i]['Type'] != 'a')
                        //        continue;
                        //    var div02 = angular.element("<div>");
                        //    // if Visible is not null or undefined and not empty
                        //    var isVisible = true;
                        //    if ((buttons[i]['Visible'] ? true : false) && buttons[i]['Visible'] != '') {
                        //        //div02.attr('ng-show', buttons[i]['Visible']);
                        //        isVisible = buttons[i]['Visible'];
                        //    }
                        //    //for access grants control
                        //    var ngIf_ByButtonName = 'group.ngIfByButtonName("' + field["Name"] + '")';
                        //    var ngIf_Flag = scope.$eval(ngIf_ByButtonName);
                        //    var isVisible_Flag = scope.$eval(isVisible);
                        //    if (ngIf_Flag == false || isVisible_Flag == false)
                        //        continue;
                        //    //div02.attr({
                        //    //    'ng-show': isVisible,
                        //    //    'ng-if': ngIf_ByButtonName
                        //    //});
                        //    var btnElem = angular.element("<button>").attr({
                        //        'mfb-button': true,
                        //        'icon': buttons[i]['Icon'],
                        //        'ng-click': buttons[i]['ClickEvent'],
                        //        'label': buttons[i]['Label'],
                        //        //'ng-show': isVisible,
                        //        //'ng-if': ngIf_ByButtonName
                        //        //'ng-repeat': 'button in ' + field['Value'],
                        //    });
                        //    //div02.append(btnElem);
                        //    navElem.append(btnElem);
                        //}
                        //    element.append(navElem);
                        element.append(divMFB);
                        break;
                    case 'zimg':
                        //<zimg url="ProfileImg_ApiSource" src="MyProfile.UserName" size="md" alt="avatar" divClass="mw55" refresh-image="refreshImage"></zimg>
                        //class="media-object img-responsive
                        var divImg = angular.element('<zimg>').attr({
                            'url': field['SourceUrl'],
                            'src': field["Value"],
                            'size': field["Size"],
                            'alt': field['PlaceHolder'],
                            'imgClass': field['ImgClass'],
                            'refresh-image': field['RefreshImage']
                        });
                        div01.append(divImg);
                        break
                    case 'zfileupload':
                        var div02 = angular.element('<zfileupload>').attr({
                            'upload-url': '{{' + field["URL"] + '}}',
                            'file-reference-id': '{{' + field["Value"] + '}}',
                            'model': field["Scope"],
                            'onupload-success': field["OnSuccess"],
                            'upload-button-class': 'btn btn-primary'
                        })
                        break;
                    case 'zdate':
                        var label_FieldSelect = angular.element("<div>").addClass('field').addClass('prepend-icon');
                        label_FieldSelect.html('<input type="text" id="' + field['Name'] + '" name="' + field['Name'] + '" class="gui-input form-control" zuiDatePicker ng-model="' + zmodel + '.' + field['Value'] + '" ng-required=' + field['IsRequired'] + ' ng-change="' + field['OnChange'] + '"  />' + //'" ng-change="' + field['OnChange'] + '" ' +
                                '<label class="field-icon"> <i class="fa fa-calendar"></i></label>');
                        //var divInput = angular.element("<input>").addClass('gui-input').attr({
                        //    'type': 'text',
                        //    'id': field['Name'],
                        //    'name': 'name',
                        //    'zuiDatePicker': true,
                        //    'ng-model': zmodel + '.' + field['Value'],
                        //    'ng-required': field['IsRequired']
                        //}).html();
                        div01.append(label_FieldSelect);
                        break;
                    case 'zmonth':
                        var label_FieldSelect = angular.element("<label>").addClass('field').addClass('prepend-icon');
                        label_FieldSelect.html('<input type="text" id="' + field['Name'] + '" name="' + field['Name'] + '" class="gui-input form-control" zuiMonthPicker ng-model="' + zmodel + '.' + field['Value'] + '" ng-required=' + field['IsRequired'] + ' />' + //'" ng-change="' + field['OnChange'] + '" ' +
                                '<label class="field-icon"> <i class="fa fa-calendar"></i></label>');
                        div01.append(label_FieldSelect);
                        break;
                    case 'zuidatetime':
                        var label_FieldSelect = angular.element("<label>").addClass('field').addClass('prepend-icon');
                        label_FieldSelect.html('<input type="text" id="' + field['Name'] + '" name="' + field['Name'] + '" class="form-control gui-input" zuiDateTimePicker ng-model="' + zmodel + '.' + field['Value'] + '" ng-readonly="' + field["ReadOnly"] + '" ng-required=' + field['IsRequired'] + ' />' + //'" ng-change="' + field['OnChange'] + '" ' +
                                '<label class="field-icon"> <i class="fa fa-calendar"></i></label>');
                        div01.append(label_FieldSelect);
                        break;
                    case 'zuitime':
                        var label_FieldSelect = angular.element("<label>").addClass('field').addClass('prepend-icon');
                        label_FieldSelect.html('<input type="text" id="' + field['Name'] + '" name="' + field['Name'] + '" class="form-control gui-input" zuiTimePicker ng-model="' + zmodel + '.' + field['Value'] + '" ng-readonly="' + field["ReadOnly"] + '" ng-required="' + field['IsRequired'] + '" ng-change="' + field['OnChange'] + '"  />' +
                       // label_FieldSelect.html('<input type="text" id="' + field['Name'] + '" name="name" class="form-control gui-input" zuiTimePicker ng-model="' + zmodel + '.' + field['Value'] + '" ng-readonly="' + field["ReadOnly"] + '" ng-required=' + field['IsRequired'] + ' />' + //'" ng-change="' + field['OnChange'] + '" ' +
                                '<label class="field-icon"> <i class="fa fa-clock-o"></i></label>');
                        div01.append(label_FieldSelect);
                        break;
                    case 'zdatetime':
                        // remove attr ng-readonly when it contain undefined or null or empty or zero.
                        var divInput = _generateFormElement('input');
                        if (divInput.attr("ng-readonly")) {
                            divInput.attr("type", "text");
                            var divSpanDateTime = angular.element("<div>").addClass('input-group').text("{{" + zmodel + '.' + field['Value'] + " | date:'dd/MM/yyyy,  hh:mm a' }}");
                            //var divSpanDateTime = angular.element("<div>").addClass('input-group').text("{{" + zmodel + '.' + field['Value'] + "}}");
                            div01.append(divSpanDateTime);
                        } else {
                            divInput.attr("type", "datetime-local");
                            div01.append(divInput);
                        }
                        break;
                    case 'select':
                        //var divSelect = angular.element("<select>").addClass('form-control').attr({ 'id': field['Name'], 'name': 'name', 'ng-model': zmodel + '[field.Value]', 'ng-change': field.OnChange });
                        var divLabelSelect = angular.element('<label class="field select">');
                        var divArrowSelect = angular.element('<i class="arrow">');
                        var divSelect = angular.element("<select>").addClass('form-control').attr({
                            'id': field['Name'],
                            'name': field['Name'],
                            'ng-model': zmodel + '[field.Value]',
                            'ng-change': field.OnChange,
                            'ng-required': field["IsRequired"] + ' && ' + isVisible,
                            'disabled': field["ReadOnly"],
                        });
                        if (!(field['SelectOptions'].length === undefined)) {
                            for (var i = 0; i < field['SelectOptions'].length; i++) {
                                var option = field['SelectOptions'][i];
                                var divOption = angular.element("<option>").attr('value', option['value']).text(option['text']);
                                divSelect.append(divOption);
                            }
                        }
                        divLabelSelect.append(divSelect);
                        divLabelSelect.append(divArrowSelect);
                        div01.append(divLabelSelect);
                        break;
                    case 'zselect':
                        var label_FieldSelect = angular.element("<label>").addClass('field').addClass('select');
                        var divSelect = angular.element("<select>").addClass('gui-input').addClass('form-control');
                        divSelect.attr({
                            'id': field['Name'],
                            'name': field['Name'],
                            'ng-model': zmodel + '.' + field.Value,
                            'ng-options': field['SelectOptions'],
                            'ng-change': field['OnChange'],
                            'ng-required': field["IsRequired"] + ' && ' + isVisible,
                            'disabled': field["ReadOnly"],
                            //'disabled': field['Disabled'],
                            'convert-to-number': true //field["isSelectionNumeric"]
                        }).html('<option value="">-- none --</option>');
                        var divArrow = angular.element("<i>").addClass('arrow');

                        if ((field["OnChange"] ? false : true) || field["OnChange"] == '' || field["OnChange"] == 0)
                            divSelect.removeAttr('ng-change');
                        // remove attr OnChange when it contain undefined or null or empty or zero.
                        //if ((field["isSelectionNumeric"] ? false : true) || field["isSelectionNumeric"] == '' || field["isSelectionNumeric"] == 0)
                        //    divSelect.removeAttr('convert-to-number');

                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldname': field['Name']
                        });
                        //var divOption = angular.element("<option>").attr({ 'value': '', 'ng-if': false });
                        //divSelect.append(divOption);
                        //divSelect.append(divEmptyOption);
                        label_FieldSelect.append(divSelect);
                        label_FieldSelect.append(divArrow);
                        label_FieldSelect.append(spanErrorMsg);
                        div01.append(label_FieldSelect);
                        break;
                    case 'zuiselectmultiple':
                        var divSelectMulti = angular.element("<zuiselectmultiple>").attr({
                            'id': field['Name'],
                            'multiple': field['Multiple'],
                            'name': 'name',
                            'group': 'group',
                            'modalgroup': 'modalGroup',
                            'value': zmodel + '.' + field.Value,
                            'options': field['SelectOptions'],
                            'onchange': field['OnChange'],
                            'disabled': field["ReadOnly"],
                            'convert-to-number': true  // field["isSelectionNumeric"]
                        });
                        div01.append(divSelectMulti);
                        break;
                    case 'zselectize':
                        var divSelectMulti = angular.element("<label>").addClass('field').addClass('select').attr({
                            'zselectize': true,
                            'id': field['Name'],
                            'multiple': field['Multiple'],
                            'name': field['Name'],
                            'group': 'group',
                            'modalgroup': 'modalGroup',
                            'value': zmodel + '.' + field.Value,
                            'options': field['SelectOptions'],
                            'onchangeevent': field['OnChange'],
                            'disabled': field["ReadOnly"],
                            'isrequired': field["IsRequired"] + ' && ' + isVisible,
                            'isnumeric': field["isSelectionNumeric"]
                        });
                        div01.append(divSelectMulti);
                        break;
                    case 'zalert':
                        //var alertModel = (field['Value'] ? zmodel + '.' + field.Value : 'alert');
                        div01 = null;
                        div01 = angular.element("<div>").attr({
                            'ng-repeat': 'alert in group.alerts',
                            'ng-class': '["alert-" + alert.type, "alert alert-micro light alert-dismissable"]'
                        }).html('<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="closeAlert($index)">×</button>' +
                                '<i class="fa fa-cubes pr10 hidden"></i>' +
                                '{{alert.msg}}');
                        //div01.append(divAlert);
                        break;
                    case 'zbuttons':
                        //var divButtonsWrap = angular.element("<div>").addClass(field['DivClass']);
                        var divButtons = angular.element("<zbuttons>").attr({
                            'buttons': field['Value'],
                            'index': index,
                            'group': 'group',
                            'modalgroup': 'modalGroup'
                        });
                        div01.append(divButtons);
                        //divButtonsWrap.append(divButtons);
                        break;
                    case 'zgrid':
                        var divIf = angular.element("<div>").attr({
                            'ng-if': 'isArray(' + field['ColumnFields'] + ')'
                        })
                        var divZGrid = angular.element("<zgrid>").attr({
                            'gridName': field['Name'],
                            'gridSet': field['Value'],
                            'resourceURL': field['ResourceURL'],
                            'editClickURL': field['EditClickURL'],
                            'columnFields': field['ColumnFields'],
                            'externalPagination': field['ExternalPagination'],
                            'allowGridDataExport': field['AllowGridDataExport'],
                            'enableSaveGridState': field['EnableSaveGridState'],

                            'enableRowSelect': field['AllowRowSelect'],
                            'enableMultiSelect': field['AllowMultiSelect'],
                            'enableFullRowSelect': field['AllowFullRowSelect'],
                            'allowColumnResize': field['AllowColumnResize'],
                            'indexKey': field['IndexKey'],

                        });
                        divIf.append(divZGrid);
                        div01.append(divIf);
                        //var allowExport = field['AllowExport'] ? field['AllowExport'] : false;
                        //var allowSaveState = field['AllowSaveState'] ? field['AllowSaveState'] : false;
                        //var divGrid = angular.element("<div>").addClass('ui-grid').attr({
                        //    'ui-grid': field['Value'],
                        //    'ui-grid-pagination': true,
                        //    'ui-grid-exporter': allowExport,
                        //    'ui-grid-save-state': allowSaveState,
                        //    'ui-grid-selection': true,
                        //    'ui-grid-pinning': true, 
                        //    'ui-grid-resize-columns': true,
                        //    'ui-grid-move-columns': true,
                        //    'ui-grid-cellnav': true
                        //});
                        //div01.append(divGrid);
                        break;
                    case 'zgridsimple':
                        var divZGrid = angular.element("<div>").attr({
                            'name': field['Name'],
                            'ui-grid': field['Value'],
                        });
                        divZGrid.addClass('ui-grid');
                        div01.append(divZGrid);
                        break;
                    case 'ztree':
                        var divZTree = angular.element("<ztree>").attr({
                            'allowdragdrop': field['AllowDragDrop'],
                            'model': field['Value'],
                            'renderview': field['RenderView']
                        });
                        div01.append(divZTree);
                        break;
                    case 'currency':
                        var label_FieldSelect = angular.element("<label>").addClass('field');
                        var divInput = _generateFormElement('input');
                        divInput.attr('pattern', '^\\$?(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,2})?$');
                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldName': field['Name']
                        });
                        label_FieldSelect.append(divInput);
                        label_FieldSelect.append(spanErrorMsg);
                        div01.append(label_FieldSelect);
                        break;
                    case 'textarea':
                        var label_FieldSelect = angular.element("<label>").addClass('field');
                        var divInput = _generateFormElement('textarea');
                        divInput.attr({
                            'rows': field['textAreaRows'],
                            'cols': field['textAreaCols'],
                            'ng-readonly': field["ReadOnly"],
                            'ng-required': field["IsRequired"]
                        });
                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldName': field['Name']
                        });
                        label_FieldSelect.append(divInput);
                        label_FieldSelect.append(spanErrorMsg);
                        div01.append(label_FieldSelect);
                        break;
                    case 'textareajson':
                        var divInput = _generateFormElement('textarea');
                        divInput.attr({
                            'rows': field['textAreaRows'],
                            'cols': field['textAreaCols'],
                            'ng-readonly': field["ReadOnly"],
                            'zjsontext': true,
                            'ui-codemirror': '{ lineNumbers: true, indentWithTabs: true, mode: "javascript" }'
                        });
                        //var cm = CodeMirror.fromTextArea(divInput, {
                        //    lineNumbers: true,
                        //    indentWithTabs: true,
                        //    mode: 'javascript',
                        //});
                        //cm.setSize(500, 500);

                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldName': field['Name']
                        });
                        div01.append(divInput);
                        div01.append(spanErrorMsg);
                        break;
                    case 'zcode':
                        var divInput = _generateFormElement('textarea');
                        divInput.attr({
                            rows: field['textAreaRows'],
                            cols: field['textAreaCols'],
                            //   'zjsontext': true,
                            'ui-codemirror': '{ lineNumbers: true, indentWithTabs: true, mode: "javascript" }'
                        });
                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldName': field['Name']
                        });
                        div01.append(divInput);
                        div01.append(spanErrorMsg);
                        break;

                    case 'zplotbar':
                        div00 = angular.element('<zplotbar>').attr({
                            'id': field.Name + Math.floor((Math.random() * 1000000) + 1),
                            'name': field.Name,
                            'label': field.Label
                        });
                        div01 = null;
                        break;
                    case 'zplotpie':
                        div00 = angular.element('<zplotpie>').attr({
                            'id': field.Name + Math.floor((Math.random() * 1000000) + 1),
                            'name': field.Name,
                            'label': field.Label
                        });
                        div01 = null;
                        break;
                    case 'zplotrangeslider':
                        div00 = angular.element('<zplotrangeslider>').attr({
                            'id': field.Name + Math.floor((Math.random() * 1000000) + 1),
                            'name': field.Name,
                            'label': field.Label
                        });
                        div01 = null;
                        break;
                    case 'zplotfilledarea':
                        div00 = angular.element('<zplotfilledarea>').attr({
                            'id': field.Name + Math.floor((Math.random() * 1000000) + 1),
                            'name': field.Name,
                            'label': field.Label
                        });
                        div01 = null;
                        break;
                    case 'zplottreemap':
                        div00 = angular.element('<zplottreemap>').attr({
                            'id': field.Name + Math.floor((Math.random() * 1000000) + 1),
                            'name': field.Name,
                            'label': field.Label
                        });
                        div01 = null;
                        break;
                    default:
                        var label_FieldSelect = angular.element("<label>").addClass('field');

                        var divInput = _generateFormElement('input');
                        var spanErrorMsg = angular.element('<zerrormessage>').attr({
                            'minlength': field["MinLength"],
                            'fieldName': field['Name']
                        });
                        label_FieldSelect.append(divInput);
                        label_FieldSelect.append(spanErrorMsg);
                        div01.append(label_FieldSelect);
                        //div01.append(divInput);
                        //div01.append(spanErrorMsg);
                        //div01.append(divSpanInputSuccess);
                        //div01.append(divSpanInputError);
                        //div01.append(divError);
                        break;
                }

                // join the div together
                if (field['Type'] != 'za' && field['Type'] != 'zlabel') {
                    element.append(div00);
                    if (div01)
                        div00.append(div01);
                }

                // Append Div with class clearFix
                if (field['AppendDivClearFix']) {
                    var divClearFix = angular.element("<div>").addClass('clearfix').attr({
                        'ng-if': isVisible + ' && getTabVisible("' + field.TabArea + '")'
                    });;
                    element.append(divClearFix);
                }

            }

            var exploreElement = function exploreElement(scope, element, attrs, ctrl, field) {
                var div01, div00, divhost;
                switch (field['Type']) {
                    case 'zdiv':
                        if (scope.f_tab == undefined)
                            scope.f_tab = {};  //for zdiv field holder
                        div01 = null;
                        div00 = angular.element('<div>').addClass(field['DivClass']).attr({
                            'id': field['Id']
                        });
                        element.append(div00);
                        divhost = div00;
                        break;
                    case 'ztab':
                        //tab control
                        var name = field.Name;
                        if (!scope.group.tabStatus)
                            scope.group.tabStatus = {};
                        if (!scope.group.tabStatus[name])
                            scope.group.tabStatus[name] = 0;
                       // scope.activeTab = scope.group.tabStatus[name];
                       // scope.activeTab[0] = 1;

                        scope.tabLinkClick = function (ev, target, name) {
                            //for (var i = 0; i < scope.activeTab.length; i++) {
                            //    if (scope.activeTab[i] == 1)
                            //        scope.activeTab[i] = 0; //0 is inactive
                            //}
                            scope.group.tabStatus[name] = Number(target);
                            //scope.activeTab[Number(target)] = 1; // 1 is active
                        }

                        //var label = field.Label;
                        var div00 = angular.element('<div>').addClass('col-xs-12 col-sm-12 col-md-12 col-lg-12 mb25 tab-block').attr({
                            'id': field['Id']
                        });
                        var divTabContent = null;
                        var divTabUl = angular.element('<ul>').addClass('nav nav-tabs');
                        var tabLabel = field.Label;
                        for (var t = 0; t < tabLabel.length; t++) {
                            var divTabLi = angular.element('<li>').attr('style', 'cursor:pointer');
                            if (t == 0)
                                divTabLi.addClass('active');
                            var divTabA = angular.element('<a>').attr({
                                'ng-click': 'tabLinkClick($event, "' + t + '", "' + name + '")',
                                //'href': '#t' + t,
                                'data-toggle': 'tab',
                            }).text(tabLabel[t]);
                            divTabUl.append(divTabLi);
                            divTabLi.append(divTabA);
                        }
                        div00.append(divTabUl);

                        divTabContent = angular.element('<div>').addClass('tab-content p20').attr('id', name);
                        div00.append(divTabContent);
                        element.append(div00);
                        divhost = divTabContent;
                        break;
                    case 'zpanel':
                        //panel block
                        var div00 = angular.element('<div>').addClass('panel')
                        .attr({
                            'id': field['Name'],
                            'name': field['Name'],
                            'data-panel-remove': field['PanelRemove'],
                            'data-panel-color': field['PanelColor'],
                            'data-panel-fullscreen': field['PanelFullScreen'],
                            'data-panel-title': field['PanelTitle'],
                            'data-panel-collapse': field['PanelCollapse']
                        });

                        var divPanelHeading = angular.element('<div>').addClass('panel-heading');
                        var divPanelTitle = angular.element('<span>').addClass('panel-title').text(field['Label']);
                        divPanelHeading.append(divPanelTitle);
                        var divPanelBody = angular.element('<div>').addClass('panel-body');
                        div00.append(divPanelHeading);
                        div00.append(divPanelBody);
                        var divPanel = angular.element('<div>').addClass('allcp-panels');
                        divPanel.append(div00);
                        element.append(divPanel);
                        divhost = divPanelBody;
                        break;
                }

                if (!divhost)
                    divhost = element;
                for (var i = 0; i < field.Value.length; i++) {
                    if (angular.isArray(field.Value[i].Value)) {
                        exploreElement(scope, divhost, attrs, ctrl, field.Value[i]);
                    } else {
                       // var f_name = field.Name + Math.floor((Math.random() * 1000000) + 1); //field.Value[i].Name;
                       // scope.f_tab[f_name] = field.Value[i];
                        var div_zInput = {
                            'field': field.Value[i],
                            'zform': 'F1',
                            'zmodel': 'group.zModel',
                            'index': '{{$index + 1}}',
                            'group': 'group'
                        };
                        //div00.append(div_zInput);
                        addElement(scope, divhost, div_zInput, ctrl, field.Value[i]);
                    }
               }
            }


            var preLink = function preLink(scope, element, attrs, ctrl) {
                var field = scope[attrs["field"]];


                scope.bsDatePickerOpen = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.bsDatePickerStatus.opened = true;
                };



                scope.codeMirrorOptions = { "lineNumbers": true, "indentWithTabs": true, "mode": "javascript" };

                scope.bsDatePickerConvertText2Date = function (dateModel, zNgForm) {
                    //   if(!dateModel)
                    //       zNgForm.name.$setValidity("date format incorrect! eg. dd/MM/yyyy", false);
                    //dateModel = new Date(dateModel.replace(/(\d{2})[-/.](\d{2})[-/.](\d{4})/, "$1/$2/$3"));
                }

                scope.bsDatePickerStatus = { opened: false };

                scope.closeAlert = function (index) {
                    scope.group.alerts.splice(index, 1);
                };

                scope.isArray = angular.isArray;


                scope.showErrorMessage = function () {
                    //console.log('?> ' + angular.element(this));
                    var p = angular.element(this.$$prevSibling);
                    return (function (p) { (p.hasClass('ng-dirty') && p.hasClass('ng-invalid')) || (p.hasClass('ng-invalid') && scope.group.formChecked) })(p);
                    //var t = this;
                    //if (t.F1 == undefined)
                    //    return false;
                    //else
                    //    return (t.F1.$invalid && t.F1.$dirty) || (t.F1.$invalid && scope.group.formChecked);
                }


                var checks = [
                    { type: 'required', message: 'The field "' + field.Name + '" is required.' },
                    { type: 'minlength', message: 'The field "' + field.Name + '" cannot be shorter than ' + field.MinLength + ' characters' },
                    { type: 'maxlength', message: 'The field "' + field.Name + '" cannot be longer than ' + field.MaxLength + ' characters' },
                    { type: 'email', message: 'The field "' + field.Name + '" is not in proper email format' },
                    { type: 'url', message: 'The field "' + field.Name + '" is not in proper url format' },
                    { type: 'number', message: 'The field "' + field.Name + '" is not in proper number format' },
                    { type: 'date', message: 'The field "' + field.Name + '" is not in proper date format' },
                    { type: 'datetimelocal', message: 'The field "' + field.Name + '" is not in proper datetime format' }
                ];


                scope.errorTooltipMessage = "Unknown error...";

                scope.setTooltipMessage = function () {
                    //var errors = scope.$eval(zform + '.n.$error');
                    var errors = this.F1.$error;
                    for (error in errors) {
                        for (i = 0; i < 7; i++) {
                            if (checks[i]['type'] == error) {
                                scope.errorTooltipMessage = checks[i]['message'];
                                return;
                            }
                        }
                    }
                }

                scope.zformValidation = function zformValidation(n) {
                    var t = $('form [ng-model][name="' + n + '"]');
                    //var s = null;
                    //if (t) s = t.scope();
                    //if (s) console.log('*** ' + s.field.Name + ' ==> ' + s.F1.$dirty);
                    if (t) {
                        if (t.hasClass('ng-dirty')) {
                            if (t.hasClass('ng-valid'))
                                return "has-success";
                            else
                                return "has-error";
                        }
                    }
                    //if (s.field) console.log('*** ' + s.field.Name + ' ==> ');
                    //    if (t[f] && t[f].n) {
                    //        if (t[f].n.$dirty) {
                    //            console.log('*&^ ' + t.field.Name + ' ==> ' + t[f].n.$dirty);
                    //            if (t[f].n.$invalid)
                    //                return "has-error";
                    //            else
                    //                return "has-success";
                    //        }

                    //    }

                }

               
                scope.getTabVisible = function (tabId) {
                    //for (var t = 0; t < scope.group.tabStatus[tabName].length; t++) {
                    if (tabId == 'undefined')
                        return true;

                    //if (!scope.group.tabStatus && tabId == 0)
                    //    return true;

                    //if (!scope.group.tabStatus[element.context.parentNode.id] && tabId == 0)
                    //    return true;

                    var t = tabId.split(',');
                    for (var i = 0; i < t.length; i++) {
                        if (scope.group.tabStatus && scope.group.tabStatus['divTabBlock'] == t[i])
                            return true;
                        else
                            continue;
                    }
                    return false;

                }





                if (angular.isArray(field.Value)) {
                    exploreElement(scope, element, attrs, ctrl, field);
                } else {
                    addElement(scope, element, attrs, ctrl);
                }
            }

            var postLink = function postink(scope, element, attrs, ctrl) {
                // Compile the contents
                //if (!compiledContents) {
               //     compiledContents = $compile(element.contents());
                //}
                // Re-add the compiled contents to the element
              //  compiledContents(scope, function (clone) {
               //     element.append(clone);
              //  });

                $compile(element.contents())(scope);

                $timeout(function () {
                    // Init AllCP Panels
                    $('.allcp-panels').allcppanel({
                        grid: '.allcp-grid',
                        draggable: true,
                        preserveGrid: true,
                        onStart: function () { },
                        onFinish: function () {
                            $('.allcp-panels').addClass('animated fadeIn').removeClass('fade-onload');
                        },
                        onSave: function () {
                            $(window).trigger('resize');
                        }
                    });

                }, 0);
            }

            return {
                pre: preLink,
                post: postLink
            }
        },
                
        restrict: "E",
        replace: true
    }
}]);