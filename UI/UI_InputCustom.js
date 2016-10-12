angular.module("zSrv_InputCustom",[])

//.filter('currencyFilter', function () { 
//    return function (value) {
//        return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//    }
//})

.service("zSrv_InputCustom", ['$http', '$window', '$route', '$location', '$rootScope', '$q', 'uiGridConstants', 'zSrv_OAuth2', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_zNotify',
    function ($http, $window, $route, $location, $rootScope, $q, uiGridConstants, zSrv_OAuth2, zSrv_MagnificPopUp, zSrv_Field, zSrv_zNotify) {

    var apiServiceBaseUri = zSrv_OAuth2.OAuth2.BaseUri;
    //var apiServiceBaseUri = 'http://localhost:26264/';
    //var apiServiceBaseUri = 'http://192.168.1.41:5006/';
    //var apiServiceBaseUri = 'https://secure.amesunited.com/';


    var serviceFactory = {};
    var p_form_queue = null;
    var p_list_queue = null;

    

 
    // call by defaultCtrl during startup
    var _formFields_Initial = function () {
        //var menuItemFormFields = [
        //    { Name: 'ZButton', Value: 'masterFormButtons', Type: 'zbuttons', DivClass: 'col-md-12 col-lg-12', AppendDivClearFix: true },
        //    { Name: 'ZAlert', Type: 'zalert', DivClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-6', AppendDivClearFix: true },
        //    {
        //        Name: 'Id', Value: 'Id', enableHiding: false, gridColVisible: true, width: 80, minWidth: 50, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //        enablePinning: true, pinnedLeft: true, pinnedRight: false,
        //        UpdateOnBlur: true, PlaceHolder: 'Role Id', Type: 'text', IsRequired: true, MinLength: 2, MaxLength: 50, Label: 'Id:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: true, AppendDivClearFix: false, ShowLabel: true
        //    },
        //   {
        //       Name: 'Name', Value: 'Name', enableHiding: false, gridColVisible: true, width: 120, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: true, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'Menu item name', Type: 'text', IsRequired: true, MinLength: 2, MaxLength: 20, Label: 'Name:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'Label', Value: 'Label', enableHiding: false, gridColVisible: true, width: 150, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: false, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'Display label', Type: 'text', IsRequired: true, MinLength: 3, MaxLength: 30, Label: 'Label:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'Description', Value: 'Description', enableHiding: true, gridColVisible: false, width: 100, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: false,
        //       enablePinning: false, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'Description', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 50, Label: 'Description:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'Icon', Value: 'Icon', enableHiding: true, gridColVisible: false, width: 100, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: false,
        //       enablePinning: false, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'Icon', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 100, Label: 'Icon:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'URL', Value: 'URL', enableHiding: true, gridColVisible: true, width: 180, minWidth: 140, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: false,
        //       enablePinning: false, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'href', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 100, Label: 'URL:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'Type', Value: 'Type', enableHiding: true, gridColVisible: true, width: 100, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //       filters: [{ type: uiGridConstants.filter.SELECT, selectOptions: [{ value: 'item', label: 'Menu item' }, { value: 'dropdown', label: 'Menu branch' }, { value: 'dropdown-submenu', label: 'Sub-Menu branch' }] }],
        //       UpdateOnBlur: true, PlaceHolder: '', Type: 'select', IsRequired: true, MinLength: 0, MaxLength: 25, Label: 'Type:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true,
        //       SelectOptions: [{ value: 'item', text: 'Menu item' }, { value: 'dropdown', text: 'Menu branch' }]
        //   },
        //   {
        //       Name: 'ClickEvent', Value: 'ClickEvent', enableHiding: true, gridColVisible: true, width: 100, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'Click event', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 80, Label: 'Click Event:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true
        //   },
        //   {
        //       Name: 'ForGuest', Value: 'ForGuest', enableHiding: true, gridColVisible: true, width: 100, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //       cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;"><span ng-class= "COL_FIELD ? ' + '\'' + 'glyphicon glyphicon-ok' + '\'' + ' : ' + '\'' + 'glyphicon glyphicon-remove' + '\'' + '"></span></div>',
        //       UpdateOnBlur: true, PlaceHolder: '', Type: 'checkbox', IsRequired: false, MinLength: 0, MaxLength: 0, Label: 'Allow Guest Access', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3', ReadOnly: false, AppendDivClearFix: false, ShowLabel: true,
        //   },
        //   {
        //       Name: 'ClientId', Value: 'ClientId', enableHiding: true, gridColVisible: true, width: 120, minWidth: 100, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //       UpdateOnBlur: true, PlaceHolder: 'ClientId', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 10, Label: 'ClientId:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3',
        //       ReadOnly: true, AppendDivClearFix: false, ShowLabel: true, Visible: 'group.isEdit'
        //   },
        //   {
        //       Name: 'AddDate', Value: 'AddDate', enableHiding: true, gridColVisible: true, width: 200, minWidth: 30, cellFilter: 'date', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //       enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //       filters: [{ condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL, placeholder: 'from' }, { condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL, placeholder: 'to' }],
        //       UpdateOnBlur: true, PlaceHolder: '', Type: 'zdatetime', IsRequired: false, MinLength: 0, MaxLength: 18, Label: 'Add Date:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3',
        //       ReadOnly: true, AppendDivClearFix: false, ShowLabel: true, Visible: 'group.isEdit'
        //   },
        //    {
        //        Name: 'ModDate', Value: 'ModDate', enableHiding: true, gridColVisible: false, width: 200, minWidth: 30, cellFilter: 'date', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //        enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //        filters: [{ condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL, placeholder: 'from' }, { condition: uiGridConstants.filter.LESS_THAN_THAN_OR_EQUAL, placeholder: 'to' }],
        //        UpdateOnBlur: true, PlaceHolder: '', Type: 'zdatetime', IsRequired: false, MinLength: 0, MaxLength: 18, Label: 'Modified Date:', DivClass: 'col-xs-12 col-sm-4 col-md-3 col-lg-3',
        //        ReadOnly: true, AppendDivClearFix: false, ShowLabel: true, Visible: 'group.isEdit'
        //    },
        //    {
        //        Name: 'AddBy', Value: 'AddBy', enableHiding: false, gridColVisible: false, width: 150, minWidth: 50, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //        enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //        UpdateOnBlur: true, PlaceHolder: 'Added By', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 10, Label: 'Added By:', DivClass: 'col-xs-12 col-sm-4 col-md-2 col-lg-2',
        //        ReadOnly: true, AppendDivClearFix: false, ShowLabel: true, Visible: 'group.isEdit'
        //    },
        //    {
        //        Name: 'ModBy', Value: 'ModBy', enableHiding: false, gridColVisible: true, width: 150, minWidth: 50, cellFilter: '', filterCellFiltered: false, enableFiltering: true, enableSorting: true,
        //        enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //        UpdateOnBlur: true, PlaceHolder: 'Modified By', Type: 'text', IsRequired: false, MinLength: 0, MaxLength: 10, Label: 'Modified By:', DivClass: 'col-xs-12 col-sm-4 col-md-2 col-lg-2',
        //        ReadOnly: true, AppendDivClearFix: false, ShowLabel: true, Visible: 'group.isEdit'
        //    },
        //    {
        //        Name: 'Disabled', Value: 'Disabled', enableHiding: true, gridColVisible: false, width: 100, minWidth: 70, cellFilter: 'date', filterCellFiltered: true, enableFiltering: true, enableSorting: true,
        //        enablePinning: true, pinnedLeft: false, pinnedRight: false,
        //        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;"><span ng-class= "COL_FIELD ? ' + '\'' + 'glyphicon glyphicon-ok' + '\'' + ' : ' + '\'' + 'glyphicon glyphicon-remove' + '\'' + '"></span></div>',
        //        filters: [{ type: uiGridConstants.filter.SELECT, selectOptions: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] }],
        //        PlaceHolder: '', Type: 'checkbox', IsRequired: false, Label: 'Disabled', DivClass: 'col-xs-12 col-sm-4 col-md-2 col-lg-2', ReadOnly: false, AppendDivClearFix: true, ShowLabel: true, Visible: 'group.isEdit'
        //    },
        //   {
        //       Name: 'ZMFB', Value: 'masterFormButtons', Type: 'zmfb', mfb_position: 'br', mfb_effect: 'slidein',
        //       mfb_active_icon: 'glyphicon glyphicon-remove', mfb_resting_icon: 'glyphicon glyphicon-plus',
        //       mfb_mouseEnter: 'group.mfbHovered()', mfb_mouseLeave: 'group.mfbHovered()', mfb_toggleMethod: 'hover',
        //       mfb_menuState: 'group.mfbMenuState', mfb_mainAction: 'group.mfbMainAction()',
        //   }
        //];

        $rootScope.dataFormFields = {
           // menuItem: menuItemFormFields,
        };
    }

    $rootScope.dataFormFields = {};
    var _formFields = function (grp) {

        if (grp.name == 'ALL')
            return $rootScope.dataFormFields;
        else if ($rootScope.dataFormFields[grp.name] == undefined) {
            return '~>' + grp.name;
        } else
            return $rootScope.dataFormFields[grp.name];
    };

    //var _formButtons = function (grp) {
    //    //Form Buttons
    //    var dataFormButtons = {};
    //    if (grp.name == 'ALL')
    //        return dataFormButtons;
    //    else
    //        return dataFormButtons[grp.name];
    //};

    // call by defaultCtrl during startup
    var _listFields_Initial = function (grp) {
        //List Fields
        //var generalListFields = [
        //    { Name: 'ZButton', Value: 'generalListButtons', Type: 'zbuttons', DivClass: 'col-md-12 col-lg-12', AppendDivClearFix: true },
        //    { Name: 'ZAlert', Type: 'zalert', DivClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-6', AppendDivClearFix: true },
        //    {
        //        Name: 'UserGrid', Value: 'group.gridOptions', Type: 'zgrid', DivClass: 'col-md-12 col-lg-12',
        //        ResourceURL: 'group.gridResourceURL', ColumnFields: 'group.gridColumnFields', ExternalPagination: false, AllowGridDataExport: true, EnableSaveGridState: true,
        //        AllowExport: true, AllowSaveState: true, AppendDivClearFix: true
        //    },
        //    {
        //        Name: 'ZMFB', Value: 'generalListButtons', Type: 'zmfb', mfb_position: 'br', mfb_effect: 'slidein',
        //        mfb_active_icon: 'glyphicon glyphicon-remove', mfb_resting_icon: 'glyphicon glyphicon-plus',
        //        mfb_mouseEnter: 'group.mfbHovered()', mfb_mouseLeave: 'group.mfbHovered()', mfb_toggleMethod: 'hover',
        //        mfb_menuState: 'group.mfbMenuState', mfb_mainAction: 'group.mfbMainAction()',
        //    }
        //];



        $rootScope.dataListFieldItems = {
            //generalListFields: generalListFields
        };

        $rootScope.dataListFields = {
            //user: 'generalListFields', client: 'generalListFields', menuItem: 'generalListFields', // role: 'generalListFields', product: 'generalListFields',

        };
    };

    $rootScope.dataListFieldItems = {};
    $rootScope.dataListFields = {};
    var _listFields = function (grp) {

        if (grp.name == 'LISTFIELD')
            return $rootScope.dataListFieldItems;
        else if (grp.name == 'LISTFIELDNAME')
            return $rootScope.dataListFields;
        else {
            if ($rootScope.dataListFields[grp.name] == undefined)
                return '~-' + grp.name;
            else if ($rootScope.dataListFieldItems[$rootScope.dataListFields[grp.name]] == undefined)
                return '~-' + grp.name;
            else
                return $rootScope.dataListFieldItems[$rootScope.dataListFields[grp.name]];
        }
    };

    //var _listButtonTop = function (grp) {
    //    var dataFormTopButtons = {
    //    //    user: generalFormTopButtons, client: generalFormTopButtons, menuItem: generalFormTopButtons, role: generalFormTopButtons, product: generalFormTopButtons,
    //    //    accessGrant: generalFormTopButtons, account: generalFormTopButtons, buildMenuData: zeroFormTopButtons, route: generalFormTopButtons, clientRoute: generalFormTopButtons,
    //    //    clientUser: clientUserFormTopButtons, roleMenuItemAccessGrant: roleMenuItemAccessGrantsTopButtons, userActivityLog: generalFormTopButtons,
    //    //    field: generalFormTopButtons,
    //    //    department: generalFormTopButtons, ibudgetChargeCategory: generalFormTopButtons, ibudgetCharge: generalFormTopButtons,
    //    //    ibudgetIssue: generalFormTopButtons, ibudgetIssueDetail: generalFormTopButtons,
    //    //    ibudgetStatus: generalFormTopButtons, ibudgetResource: generalFormTopButtons, ibudgetResourceRole: generalFormTopButtons,
    //    //    ibudgetDeptBudget: generalFormTopButtons, ibudgetIssueDetailIValue: generalFormTopButtons,
    //    //    ibudgetSystem: generalFormTopButtons, ibudgetSystemVersion: generalFormTopButtons,
    //    //    ibudgetProject: generalFormTopButtons, ibudgetProjectPhase: generalFormTopButtons,
    //    //    rptResourceIValue: generalFormTopButtons,
    //    //    rptResourceTask: generalFormTopButtons, rptDeptBudgetExpense: generalFormTopButtons,
    //    //    rptDeptBudgetExpenseDetail: generalFormTopButtons,
    //    };
    //    if (grp.name == 'ALL')
    //        return dataFormTopButtons;
    //    else
    //        return dataFormTopButtons[grp.name];
    //};

    //var _listButtons = function (grp) {
    //    //List Buttons
    //    //var generalListButtons = [
    //    //    { Name: 'ZA_Refresh', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.refreshPage()', URL: '', Icon: 'glyphicon glyphicon-refresh', Label: 'Refresh', AppendDivClearFix: false },
    //    //    { Name: 'ZBtn_New', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.newModel()', URL: '', Icon: 'glyphicon glyphicon-plus-sign', Label: 'New', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    //var buildMenuDataListButtons = [
    //    //    { Name: 'ZA_ImportRoute', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'importRoute()', URL: '', Icon: 'glyphicon glyphicon-import', Label: 'Import Route to DB', AppendDivClearFix: false },
    //    //    { Name: 'ZA_ImportMenu', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'importMenu()', URL: '', Icon: 'glyphicon glyphicon-import', Label: 'Import Menu to DB', AppendDivClearFix: false },
    //    //    { Name: 'ZA_ImportField', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'importFieldElement()', URL: '', Icon: 'glyphicon glyphicon-import', Label: 'Import Field Element to DB', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    //var clientUserListButtons = [
    //    //    { Name: 'ZA_Refresh', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.refreshPage()', URL: '', Icon: 'glyphicon glyphicon-refresh', Label: 'Refresh', AppendDivClearFix: false },
    //    //    { Name: 'ZBtn_Update', Type: 'a', DivClass: 'btn btn-primary', ClickEvent: 'group.updateModel()', URL: '', Icon: 'glyphicon glyphicon-save', Label: 'Save', AppendDivClearFix: false },
    //    //    //{ Name: 'ZA_New', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.newModel()', URL: '', Icon: 'glyphicon glyphicon-plus-sign', Label: 'New', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    //var roleMenuItemAccessGrantsButtons = [
    //    //    { Name: 'ZA_Refresh', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.getRolesMenuItemModel()', URL: '', Icon: 'glyphicon glyphicon-refresh', Label: 'Refresh', AppendDivClearFix: false },
    //    //    { Name: 'ZBtn_Update', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.updateRolesMenuItemModel()', URL: '', Icon: 'glyphicon glyphicon-save', Label: 'Save', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    //var RefreshListButtons = [
    //    //    { Name: 'ZA_Refresh', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.refreshPage()', URL: '', Icon: 'glyphicon glyphicon-refresh', Label: 'Refresh', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    var dataListButtons = {
    //        //user: generalListButtons, client: generalListButtons, menuItem: generalListButtons, role: generalListButtons, product: generalListButtons,
    //        //accessGrant: generalListButtons, account: generalListButtons, buildMenuData: buildMenuDataListButtons, route: generalListButtons, clientRoute: generalListButtons,
    //        //clientUser: clientUserListButtons, roleMenuItemAccessGrant: roleMenuItemAccessGrantsButtons, userActivityLog: RefreshListButtons,
    //        //field: RefreshListButtons,
    //        //department: generalListButtons, ibudgetChargeCategory: generalListButtons, ibudgetCharge: generalListButtons,
    //        //ibudgetIssue: generalListButtons, ibudgetIssueDetail: RefreshListButtons,
    //        //ibudgetStatus: generalListButtons, ibudgetResource: generalListButtons, ibudgetResourceRole: generalListButtons,
    //        //ibudgetDeptBudget: generalListButtons, ibudgetIssueDetailIValue: generalListButtons,
    //        //ibudgetSystem: generalListButtons, ibudgetSystemVersion: generalListButtons,
    //        //ibudgetProject: generalListButtons, ibudgetProjectPhase: generalListButtons,
    //        //rptResourceIValue: RefreshListButtons,
    //        //rptResourceTask: RefreshListButtons, rptDeptBudgetExpense: RefreshListButtons,
    //        //rptDeptBudgetExpenseDetail: RefreshListButtons,
    //    };
    //    if (grp.name == 'ALL')
    //        return dataListButtons;
    //    else
    //        return dataListButtons[grp.name];
    //};

    //var _getElement = function (ctrName, ctrType) {
    //    //var menuRelationshipTreeButtons = [
    //    //    { Name: 'ZA_Refresh', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.getTreeModel()', URL: '', Icon: 'glyphicon glyphicon-refresh', Label: 'Refresh', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Save', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.updateTreeModel()', URL: '', Icon: 'glyphicon glyphicon-save', Label: 'Save', AppendDivClearFix: false },
    //    //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'group.historyBack()', URL: '', Icon: 'glyphicon glyphicon-remove-circle', Label: 'Close', AppendDivClearFix: true }
    //    //];
    //    //var menuRelationshipTreeFields = [
    //    //    { Name: 'ZTree', Value: 'group.treeModel', Type: 'ztree', DivClass: 'col-md-12 col-lg-12', AllowDragDrop: true, AppendDivClearFix: true },
    //    //    { Name: 'ZAlert', Type: 'zalert', DivClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-6', AppendDivClearFix: true },
    //    //    { Name: 'ZButton', Value: 'group.buttons', Type: 'zbuttons', DivClass: 'col-md-12 col-lg-12', AppendDivClearFix: true }
    //    //];
    //    var dataElements = { 
    //        //menuItemTreeButtons: menuRelationshipTreeButtons, menuItemTreeFields: menuRelationshipTreeFields
    //    };
    //    return dataElements[ctrName + ctrType];
    //}


    // initialise this service. +++++++++++++++++++++++++++++++++++++++++++++++
    var _routeChangeSuccess = function (grp) {
        var r_process = $q.defer();
        if (grp.ngRouteParams)
            if (grp.ngRouteParams["id"])
                grp.referenceId = grp.ngRouteParams["id"];
        //waiting for _startInitialise to complete getting the fields data
        $q.all([p_form_queue]).then(function () {
            _routeChangeSuccessStart(grp);
            r_process.resolve();
        });
        return r_process.promise;
    }

    var _routeChangeSuccessStart = function (grp) {
        grp.alerts = [];
        grp.isNew = false;
        grp.isEdit = false;
        // grp.cancelButtonName = "Cancel";
        
       // grp.gridColumnFields = _formFields({ name: grp.name });
        zSrv_OAuth2.getMenuAccessGrants(grp);
        console.log("&& >> MenuAccessGrants for " + grp.ngLocation.path() + " => " + grp.OAuthAccessGrants);
        
        if (grp.listModelURL != null && grp.listModelURL != '' && grp.ngLocation.path().indexOf(grp.listModelURL) == 0) {
            grp.formHeader = grp.formHeader + " - List";
            grp.fields = _listFields(grp);
            grp.AllowDiscardChanges = true;
         //   grp.buttonTop = _listButtonTop(grp);
         //   grp.buttons = _listButtons(grp);
            //var id = null;
            //if (grp.ngLocation.path().indexOf(grp.listModelURL + "/") == 0) {
            //    id = grp.ngRouteParams["id"];
            //    grp.referenceId = id;
            //}
            if (grp.resourceURL) 
                grp.listModels(grp.referenceId);
        } else {
            grp.fields = _formFields(grp);
            grp.AllowDiscardChanges = false;
          //  grp.buttons = _formButtons(grp);
        }

        if (grp.ngLocation.path().indexOf(grp.createModelURL) == 0) {
            grp.formHeader = grp.formHeader + " - Create";
            grp.isEdit = false;
            grp.isNew = true;
            var tempModel = zSrv_OAuth2.restoreModelInMemory();
            if (tempModel) {
                grp.zModel = tempModel;
                if(grp.zModel.Id)
                    grp.zModel.Id = 0;
                if (grp.zModel.AddDate)
                    delete grp.zModel.AddDate;
                if (grp.zModel.ModDate)
                    delete grp.zModel.ModDate;
            }  else {
                grp.zModel = {};
                grp.zModel['Id'] = 0;
            }
            if (grp.parentReferenceField)
                grp.zModel[grp.parentReferenceField] = grp.referenceId;
            //grp.zModel = { Birthday: new Date('1980-01-01') };
            grp.fields[0].ReadOnly = !grp.canKeyEditDuringCreation;
            //grp.buttons[0].ClickEvent = 'group.createModel(group.zModel)';
            //grp.buttons[0].Label = 'Save';
        }

        if (grp.ngLocation.path().indexOf(grp.editModelURL) == 0) {
            grp.formHeader = grp.formHeader + " - Edit";
            grp.isEdit = true;
            grp.fields[0].ReadOnly = true;
            //grp.buttons[0].ClickEvent = 'group.updateModel(group.zModel)';
            //grp.buttons[0].Label = 'Update';
        }

        if (grp.ngLocation.path().indexOf(grp.editModelURL + "/") == 0) {
            //var id = grp.ngRouteParams["id"];
            //grp.referenceId = id;
            grp.getModel(grp.referenceId);
            //var date = new Date(parseInt(jsonDate.substr(6)));
            //grp.zModel.Birthday = new Date(parseInt(grp.zModel.Birthday.substr(6)));
            //grp.zModel.Birthday = new Date(grp.zModel.Birthday);                
        }
        //if (grp.currentModelReferenceId) {
        //    if (grp.ngLocation.path().indexOf(grp.createModelURL + "/") == 0) {
        //        var id = grp.ngRouteParams["id"];
        //        //grp.zModel = {};
        //        grp.referenceId = id;
        //        grp.zModel[grp.currentModelReferenceId] = id;
        //    }
        //}
        grp.routeChangeCompleted();

        if (grp.ngScope && grp.ngScope.Frm)
            grp.ngScope.Frm.$setPristine();

        

    };

    
    
    var _locationChangeStart = function locationChangeStart(event, scope) {
        $rootScope.newLocation = scope.group.ngLocation.path();
        if (scope.Frm && scope.Frm.$dirty && !scope.group.AllowDiscardChanges) {
            event.preventDefault();
            zSrv_MagnificPopUp.showConfirm(null, 'Changes not save', 'Do you want to discard the changes?').then(function () {
                scope.group.AllowDiscardChanges = true;
                scope.group.ngLocation.path($rootScope.newLocation);
            }, function () {
            });
        }
    }


    var _startInitialise = function (grp) {
        grp.ListFields = _listFields(grp);
        p_form_queue = zSrv_Field.getFormFields(grp);
        
        //p_list_queue = zSrv_Field.getListFields(grp);
        //to ensure data load after routeChangeComplete;
        grp.routeChangeCompleted = function () { };

        //check if data changes, ask user before discard it when change route
        grp.ngScope.$on("$locationChangeStart", function (event) { _locationChangeStart(event, grp.ngScope) });

        grp.formChecked = false;
        
        if(grp.resourceURL)
            if(grp.resourceURL.indexOf("oauth2/")==0) {
                grp.resourceURL = grp.resourceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);
            }

        if(grp.gridResourceURL)
            if (grp.gridResourceURL.indexOf("oauth2/") == 0) {
                grp.gridResourceURL = grp.gridResourceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);
            }

        if (grp.resourceURL) {
            grp.modelResource = grp.ngResource(grp.resourceURL + ":id", { id: "@Id" },  //@Id is model.Id
            {
                create: { method: "POST" }, save: { method: "PUT" },
                remove: { method: "DELETE" }
            });
        }
       

        grp.toggleFiltering = function () {
            grp.gridOptions.enableFiltering = !grp.gridOptions.enableFiltering;
            grp.gridOptions.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.COLUMN);
        };

        grp.gridSaveState = function () {
            grp.gridState = grp.gridApi.saveState.save();
        };

        grp.gridRestoreState = function () {
            grp.gridApi.saveState.restore(grp.scope, grp.gridState);
        };

        grp.gridClearState = function () {
            grp.gridApi.saveState.restore(grp.scope, {});
        };

        //initialize events
        //grp.editModel = function (id) {
        //    if (grp.gridOptions.useExternalPagination == true) {
        //        zSrv_OAuth2.storeInMemory(grp.ngLocation.path() + 'Paging', grp.gridOptions.paginationOptions);
        //        zSrv_OAuth2.storeInMemory(grp.ngLocation.path() + 'GridState', grp.gridOptions.gridApi.saveState.save());
        //    }
        //    grp.ngLocation.path(grp.editModelURL + "/" + id);
        //}

        grp.refreshPage = function () {
            $route.reload();
        }

        grp.newModel = function () {
            //var id = null;
            //if (grp.ngLocation.path().indexOf(grp.listModelURL + "/") == 0) {
            //    var id = grp.ngRouteParams["id"];
//            if(grp.referenceId)
//                grp.ngLocation.path(grp.createModelURL + "/" + grp.referenceId);
            //            else
            if (grp.ngLocation.path().indexOf(grp.createModelURL) >= 0)
                $route.reload();
            else {
                if (grp.zModel[grp.parentReferenceField])
                    grp.ngLocation.path(grp.createModelURL + "/" + grp.zModel[grp.parentReferenceField]);  //.replace();
                else if (grp.referenceId)
                    grp.ngLocation.path(grp.createModelURL + "/" + grp.referenceId);  //.replace();
                else
                    grp.ngLocation.path(grp.createModelURL + "/0");
            }
        }

        grp.cloneNewModel = function () {
            zSrv_OAuth2.storeModelInMemory(grp.zModel);
            grp.newModel();
        }

        grp.levelUp = function () {
            grp.ngLocation.path(grp.parentEditModelURL + "/" + grp.zModel[grp.parentReferenceField]);
        }

        grp.historyBack = function () {
            $window.history.back();
        };

        grp.getClientId = function () {
            return zSrv_OAuth2.getClientId();
        }

        //grp.ngIfByButtonName = function (btnName) {
        //    return zSrv_OAuth2.accessGrantControl(btnName);
        //}

        if (grp.resourceURL) {
            grp.listModels = function (id) {
                //if (grp.gridOptions['useExternalPagination'] == true) {
                //    grp.ListModelAfterSuccess(data);
                //    return;
                //}
                //grp.isLoading = true;
                //if (id) {
                //    grp.zModel = grp.modelResource.query({referId: id});
                //    //grp.zModel = grp.ngResource(grp.resourceURL + ":referId", { referId: id },
                //    //    {
                //    //        query: { method: "GET" }
                //    //    }).query();
                //}
                //else
                //    grp.zModel = grp.modelResource.query();
                //grp.zModel.$promise.then(function (data) {
                //    grp.zModel = data;
                //    grp.gridOptions.data = grp.zModel;
                //    //grp.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.OPTIONS);
                //    console.log(grp.name + " models records size is " + grp.zModel.length);
                //    grp.isLoading = false;
                //    grp.ListModelAfterSuccess(id);
                //}, function (err) {
                //    console.log(grp.name + ' - listModel event error: ' + err);
                //    grp.alerts.push({ type: "danger", msg: err });
                //    grp.isLoading = false;
                //});
            }

            grp.ListModelAfterSuccess = function (id) { }

            grp.getModel = function (id) {
                grp.isLoading = true;
                grp.zModel = {};
                grp.modelResource.get({ id: id }).$promise.then(function (data) {
                    grp.zModel = data
                    //initialise newly retrieve record.
                   // grp.zModel.ApplicationType = String(grp.zModel.ApplicationType);
                    grp.isLoading = false;
                    grp.getModelAfterSuccess(data);
                    //if (grp.ngScope && grp.ngScope.Frm)
                    //    grp.ngScope.Frm.$setPristine();
                }, function (err) {
                    console.log(grp.name + ' - getModel event error: ' + err);
                    grp.alerts.push({ type: "danger", msg: err });
                    grp.isLoading = false;
                });
            }

            grp.getModelAfterSuccess = function () { }

            grp.updateModel = function (ev, model) {
                grp.alerts = [];
                var zFrm = angular.element(document.querySelector('#zFrm'));
                if (zFrm.hasClass('ng-invalid')) {
                    grp.formChecked = true;
                    grp.alerts.push({type: "warning", msg: "Incomplete data. Highlight in red."})
                    return;
                }

                if (grp.ngScope && grp.ngScope.Frm && grp.ngScope.Frm.$dirty == false) {
                    console.log('updateModel -- no changes found.');
                    return;
                }

                
                grp.isLoading = true;
                var copyModel = angular.copy(grp.zModel);
                model.$save().then(function (err) {
                    if (!err.ModelState) {
                        grp.alerts.push({ type: 'success', msg: 'Saved successfully.' });
                        grp.isLoading = false;

                        //zSrv_Dialog.show(ev, 'Record Updated', 'The record is updated successfully.');
                        //zSrv_MagnificPopUp.show(ev, 'Record Updated', 'The record is updated successfully.');
                        zSrv_zNotify.note('success', 'Record Updated', 'Changes saved successfully.');

                        grp.zModel.ModDate = Date().substring(4, 24);
                        grp.zModel.ModBy = $rootScope.MyProfile.UserName;
                        grp.isEdit = true;
                        grp.cancelButtonName = "Close";
                        grp.updateModelAfterSuccess(grp.zModel);
                        //$route.reload();
                        if (grp.ngScope && grp.ngScope.Frm)
                            grp.ngScope.Frm.$setPristine();
                    } else {
                        //}, function (err) {
                        // console.log(grp.name + ' - updateModel event error: ' + err);
                        grp.zModel = copyModel;
                        grp.alerts.push({ type: "danger", msg: err });
                        grp.isLoading = false;
                        grp.cancelButtonName = "Cancel";
                        //}
                    }
                });
                //$location.path(grp.listModelURL);
            }

            grp.updateModelAfterSuccess = function () { }

            grp.createModel = function (ev, model) {

                grp.alerts = [];
                var zFrm = angular.element(document.querySelector('#zFrm'));
                if (zFrm.hasClass('ng-invalid')) {
                    grp.formChecked = true;
                    grp.alerts.push({ type: "warning", msg: "Incomplete data. Highlight in red." })
                    return;
                }

                grp.isLoading = true;
                new grp.modelResource(model).$create().then(function (newmodel) {
                    grp.alerts.push({ type: 'success', msg: 'Created successfully.' });
                    grp.zModel = newmodel;
                    //if (newmodel.Id)
                    //    grp.zModel.Id = angular.copy(newmodel.Id);
                    //if (newmodel.AddDate)
                    //    grp.zModel.AddDate = angular.copy(newmodel.AddDate);
                    //if (newmodel.ModDate)
                    //    grp.zModel.ModDate = angular.copy(newmodel.ModDate);

                    grp.isLoading = false;
                    //zSrv_MagnificPopUp.show(ev, 'Record Created', 'The record is created successfully.');
                    zSrv_zNotify.note('success', 'Record Created', 'New record is added successfully.');
                    grp.isEdit = true;
                    grp.cancelButtonName = "Close";
                    grp.createModelAfterSuccess(newmodel);
                    if (grp.ngScope && grp.ngScope.Frm)
                        grp.ngScope.Frm.$setPristine();
                    grp.ngLocation.path(grp.editModelURL + "/" + grp.zModel[grp.indexKey]).replace();
                    //$scope.zModels.push(newmodel);
                    //$location.path("/listClients");
                }, function (err) {
                    console.log(grp.name + ' - createModel event error: ' + err);
                    var errMsg = null;
                    if (err.data) {
                        if (err.data.ModelState) {
                            for (e in err.data.ModelState) {
                                errMsg = err.data.ModelState[e][0];
                            }
                        } else {
                            errMsg = err.data.Message;
                        }
                    }
                    grp.alerts.push({ type: "danger", msg: (errMsg ? errMsg : err) });
                    grp.isLoading = false;
                    grp.cancelButtonName = "Cancel";
                });
            }

            grp.createModelAfterSuccess = function () { }

            grp.deleteModel = function (ev, model) {
                //var promise = zSrv_Dialog.showConfirm(ev, 'Delete Confirmation', 'Are you sure?').then(function () {
                var promise = zSrv_MagnificPopUp.showConfirm(ev, 'Delete Confirmation', 'Are you sure?').then(function () {
                    grp.alerts = [];
                    grp.isLoading = true;
                    grp.zModel.Disabled = true;
                    model.$save().then(function () {
                        grp.alerts.push({ type: 'success', msg: 'Removed successfully.' });
                        grp.isLoading = false;
                        // zSrv_Dialog.show(ev, 'Record Deleted', 'The record is deleted.');
                        zSrv_zNotify.note('success', 'Record Deleted', 'The record is disabled.');
                        grp.deleteModelAfterSuccess(grp.zModel);
                        grp.historyBack();
                    }, function (err) {
                        console.log(grp.name + ' - deleteModel event error: ' + err);
                        grp.alerts.push({ type: "danger", msg: err });
                        grp.isLoading = false;
                        grp.cancelButtonName = "Cancel";
                    });
                });
                //$location.path(grp.listModelURL);
            }

            grp.removeModel = function (ev, model) {
                var promise = zSrv_MagnificPopUp.showConfirm(ev, 'Delete Confirmation', 'Are you sure?').then(function () {

                    grp.alerts = [];
                    grp.isLoading = true;
                    model.$remove({ id: model.Id }).then(function () {
                        grp.isLoading = false;
                        grp.alerts.push({ type: 'success', msg: 'Removed successfully.' });
                        zSrv_MagnificPopUp.show(ev, 'Record Removed', 'The record is removed successfully.');
                        //alert('This record is removed successfully.');
                        grp.deleteModelAfterSuccess();
                        grp.historyBack();
                        //$scope.models.splice($scope.models.indexOf(model), 1);
                        //grp.ngLocation.path(grp.listModelURL);
                    }, function (err) {
                        console.log(grp.name + ' - deleteModel event error: ' + err);
                        grp.alerts.push({ type: "danger", msg: err });
                        grp.isLoading = false;
                        grp.cancelButtonName = "Cancel";
                    });
                });

            }

            grp.deleteModelAfterSuccess = function () { };

        }

        

        //grp.updateRoleMenuItemTreeModel = function (roleId) {
        //    //grp.alerts = [];
        //    grp.isLoading = true;
        //    var dataset = [];
        //    _convertTreeToAccessGrantDataSet(dataset, grp.treeModel, 1, 0);
        //    var roleMenuItemDataset = { dataset: dataset, roleId: roleId };
        //    _httpPost("oauth2/api/RoleMenuItems", roleMenuItemDataset).then(function () {
        //        grp.alerts.push({ type: 'success', msg: 'RoleMenuItems Saved successfully.' });
        //        grp.isLoading = false;
        //        grp.cancelButtonName = "Close";
        //    }, function (err) {
        //        console.log(grp.name + ' - updateRoleMenuItemTreeModel event error: ' + err);
        //        grp.alerts.push({ type: "danger", msg: err });
        //        grp.isLoading = false;
        //        grp.cancelButtonName = "Cancel";
        //    });
        //};

        //grp.getRolesCollection = function () {
        //    //if (grp.referenceId) {
        //        zSrv_OAuth2.listRolesOptionData().then(
        //            function (success) {
        //                grp.modalOptionsCollection = success.data;
        //            },
        //            function (err) {
        //                console.log(grp.name + ' - getRolesCollection event error: ' + err);
        //                alert(grp.name + ' - getRolesCollection event error: ' + err);
        //            });
        //    //};
        //};

        


        return grp;
    };


    var _httpGet = function (serviceURL, parameters) {
        var deferred = $q.defer();
        
        if (serviceURL.indexOf('oauth2/') == 0)
            serviceURL = serviceURL.replace("oauth2/",zSrv_OAuth2.OAuth2.BaseUri);

        $http({
            url: serviceURL,
            method: "GET",
            params: parameters
        }).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _httpPost = function (serviceURL, parameters) {
        var deferred = $q.defer();

        if (serviceURL.indexOf('oauth2/') == 0)
            serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);
        
        $http.post(serviceURL, parameters).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _httpPut = function (serviceURL, parameters) {
        var deferred = $q.defer();

        if (serviceURL.indexOf('oauth2/') == 0)
            serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

        $http.put(serviceURL, parameters).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _httpDelete = function (serviceURL, parameters) {
        var deferred = $q.defer();

        if (serviceURL.indexOf('oauth2/') == 0)
            serviceURL = serviceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);

        $http.delete(serviceURL, parameters).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
            //console.log(err);
            //alert(err);
        });
        return deferred.promise;
    }

    var _getReference = function (referenceURL, params) {
        return _httpGet(referenceURL, params);
    }


      
    serviceFactory.startInitialise = _startInitialise;
    serviceFactory.routeChangeSuccess = _routeChangeSuccess;
    serviceFactory.locationChangeStart = _locationChangeStart;
    serviceFactory.getReference = _getReference;
    serviceFactory.httpGet = _httpGet;
    serviceFactory.httpPost = _httpPost;
    serviceFactory.httpPut = _httpPut;
    serviceFactory.httpDelete = _httpDelete;

//    serviceFactory.getElement = _getElement;
    serviceFactory.formFields = _formFields;
    //serviceFactory.formButtons = _formButtons;
    serviceFactory.listFields = _listFields;
    //serviceFactory.listButtonTop = _listButtonTop;
    //serviceFactory.listButtons = _listButtons;
    //serviceFactory.addFormField = _addFormField;
    serviceFactory.formFields_Initial = _formFields_Initial;
    serviceFactory.listFields_Initial = _listFields_Initial;
    //serviceFactory.getFormFields = _getFormFields;
//    serviceFactory.listGridOptions = _listGridOptions;
    //serviceFactory.updateRoleMenuItemTreeModel = _updateRoleMenuItemTreeModel;
        
    return serviceFactory;
}]);