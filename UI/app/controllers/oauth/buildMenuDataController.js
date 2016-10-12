'use strict';
//buildMenuDataController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'buildMenuData',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'buildMenuData' }),
            createModelURL: '/createBuildMenuData',
            editModelURL: '/editBuildMenuData',
            listModelURL: '/listBuildMenuData',
            gridClickKey: 'row.entity.Id',
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Build Menu Master',
            fields: [],
            buttonTop: [],
            buttons: [],
            gridOptions: {},
            toggleFiltering: null,
            listModels: null,
            editModel: null,
            getModel: null,
            updateModel: null,
            createModel: null,
            deleteModel: null,
            uiGridConstants: uiGridConstants,
            ngResource: $resource,
            ngLocation: $location,
            ngRouteParams: $routeParams,
            ngScope: $scope,
            //resourceURL: accountUrl,
            modelResource: null,
            cookieGridState: 'listBuildMenuDataCtrl_Grid1',
            //referenceResourceURL: null,
            referenceModelResource: null,
            currentModelReferenceId: null,
            //referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null
        };


        $scope.$on("$routeChangeSuccess", function () {
            zSrv_InputCustom.routeChangeSuccess($scope.group);
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        var grp = $scope.group;

        grp.importRoute = function () {
            var routes = [
        //{ Path: '/listAuditLog', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogCtrl' },
        //{ Path: '/editAuditLog/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogCtrl' },
        //{ Path: '/createAuditLog/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogCtrl' },

        //{ Path: '/listAuditLogAdmin', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogadminCtrl' },
        //{ Path: '/editAuditLogAdmin/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogadminCtrl' },
        //{ Path: '/createAuditLogAdmin/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'auditlogadminCtrl' },


        ////{ Path: '/listProducts', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'productCtrl' },
        ////{ Path: '/editProduct/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'productCtrl' },
        ////{ Path: '/editProduct/:id/:data*', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'productCtrl' },
        ////{ Path: '/createProduct/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'productCtrl' },

        //{ Path: '/myProfile', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },
        //{ Path: '/changeMyPassword', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'changeMyPwdCtrl' },

        //{ Path: '/listUsers', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },
        //{ Path: '/listUsers/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },
        //{ Path: '/editUser/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },
        //{ Path: '/createUser', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },
        //{ Path: '/createUser/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userCtrl' },

        //{ Path: '/listMenuItems', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/listMenuItems/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/editMenuItem/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/createMenuItem', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/createMenuItem/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/treeMenuRelationship/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/treeMenuRelationship', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'menuItemCtrl' },
        //{ Path: '/roleMenuItemAccessGrants', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleMenuItemCtrl' },

        //{ Path: '/listClients', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientCtrl' },
        //{ Path: '/listClients/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientCtrl' },
        //{ Path: '/editClient/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientCtrl' },
        //{ Path: '/createClient', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientCtrl' },
        //{ Path: '/createClient/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientCtrl' },

        //{ Path: '/listRoles', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleCtrl' },
        //{ Path: '/listRoles/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleCtrl' },
        //{ Path: '/editRole/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleCtrl' },
        //{ Path: '/createRole', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleCtrl' },
        //{ Path: '/createRole/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'roleCtrl' },

        //{ Path: '/listAccounts', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accountCtrl' },
        //{ Path: '/editAccount/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accountCtrl' },
        //{ Path: '/createAccount/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accountCtrl' },

        //{ Path: '/listRoutes', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'routeCtrl' },
        //{ Path: '/listRoutes/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'routeCtrl' },
        //{ Path: '/editRoute/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'routeCtrl' },
        //{ Path: '/createRoute', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'routeCtrl' },
        //{ Path: '/createRoute/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'routeCtrl' },

        //{ Path: '/listClientUsers', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientUserCtrl' },
        //{ Path: '/listClientUsers/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientUserCtrl' },
        //{ Path: '/editClientUser/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientUserCtrl' },
        //{ Path: '/createClientUser/', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientUserCtrl' },
        //{ Path: '/createClientUser/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'clientUserCtrl' },


        //{ Path: '/listAccessGrants', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accessGrantCtrl' },
        //{ Path: '/editAccessGrant/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accessGrantCtrl' },
        //{ Path: '/createAccessGrant/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'accessGrantCtrl' },

        //{ Path: '/listFields', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldCtrl' },
        //{ Path: '/editField/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldCtrl' },
        //{ Path: '/createField/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldCtrl' },

        //{ Path: '/listFieldDetail', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldDetailCtrl' },
        //{ Path: '/editFieldDetail/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldDetailCtrl' },
        //{ Path: '/createFieldDetail/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'fieldDetailCtrl' },


        //{ Path: '/listResourceServer', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerCtrl' },
        //{ Path: '/editResourceServer/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerCtrl' },
        //{ Path: '/createResourceServer/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerCtrl' },

        //{ Path: '/listResourceServerApi', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerApiCtrl' },
        //{ Path: '/editResourceServerApi/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerApiCtrl' },
        //{ Path: '/createResourceServerApi/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'resourceServerApiCtrl' },





        //{ Path: '/listDept', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'deptCtrl' },
        //{ Path: '/editDept/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'deptCtrl' },
        //{ Path: '/createDept/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'deptCtrl' },

        //{ Path: '/listIBudgetDeptBudget', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetDeptBudgetCtrl' },
        //{ Path: '/editIBudgetDeptBudget/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetDeptBudgetCtrl' },
        //{ Path: '/createIBudgetDeptBudget/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetDeptBudgetCtrl' },

        //{ Path: '/listIBudgetStatus', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetStatusCtrl' },
        //{ Path: '/editIBudgetStatus/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetStatusCtrl' },
        //{ Path: '/createIBudgetStatus/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetStatusCtrl' },

        //{ Path: '/listIBudgetResource', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceCtrl' },
        //{ Path: '/editIBudgetResource/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceCtrl' },
        //{ Path: '/createIBudgetResource/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceCtrl' },

        //{ Path: '/listIBudgetResourceRole', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceRoleCtrl' },
        //{ Path: '/editIBudgetResourceRole/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceRoleCtrl' },
        //{ Path: '/createIBudgetResourceRole/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetResourceRoleCtrl' },

        //{ Path: '/listIBudgetSystem', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemCtrl' },
        //{ Path: '/editIBudgetSystem/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemCtrl' },
        //{ Path: '/createIBudgetSystem/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemCtrl' },

        //{ Path: '/listIBudgetSystemVersion', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemVersionCtrl' },
        //{ Path: '/editIBudgetSystemVersion/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemVersionCtrl' },
        //{ Path: '/createIBudgetSystemVersion/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetSystemVersionCtrl' },


        //{ Path: '/listIBudgetProject', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectCtrl' },
        //{ Path: '/editIBudgetProject/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectCtrl' },
        //{ Path: '/createIBudgetProject/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectCtrl' },

        //{ Path: '/listIBudgetProjectPhase', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectPhaseCtrl' },
        //{ Path: '/editIBudgetProjectPhase/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectPhaseCtrl' },
        //{ Path: '/createIBudgetProjectPhase/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetProjectPhaseCtrl' },

        //{ Path: '/listIBudgetChargeCategory', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCategoryCtrl' },
        //{ Path: '/editIBudgetChargeCategory/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCategoryCtrl' },
        //{ Path: '/createIBudgetChargeCategory/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCategoryCtrl' },

        //{ Path: '/listIBudgetCharge', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCtrl' },
        //{ Path: '/editIBudgetCharge/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCtrl' },
        //{ Path: '/createIBudgetCharge/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetChargeCtrl' },




        //{ Path: '/listIBudgetIssue', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueCtrl' },
        //{ Path: '/editIBudgetIssue/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueCtrl' },
        //{ Path: '/createIBudgetIssue/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueCtrl' },

        //{ Path: '/listIBudgetIssueDetail', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailCtrl' },
        //{ Path: '/editIBudgetIssueDetail/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailCtrl' },
        //{ Path: '/createIBudgetIssueDetail/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailCtrl' },

        //{ Path: '/listIBudgetIssueDetailIValue', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailIValueCtrl' },
        //{ Path: '/editIBudgetIssueDetailIValue/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailIValueCtrl' },
        //{ Path: '/createIBudgetIssueDetailIValue/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'ibudgetIssueDetailIValueCtrl' },

        //{ Path: '/editBuildMenuData', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'buildMenuDataCtrl' },
        //{ Path: '/listUserActivityLogs', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userActivityLogCtrl' },
        //{ Path: '/editUserActivityLog/:id', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'userActivityLogCtrl' },

        //{ Path: '/rptResourceIValue', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'rptResourceIValueCtrl' },
        //{ Path: '/rptTaskResource', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'rptResourceTaskCtrl' },
        //{ Path: '/rptDeptBudgetExpense', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'rptDeptBudgetExpenseCtrl' },
        //{ Path: '/rptDeptBudgetExpenseDetail', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'rptDeptBudgetExpenseDetailCtrl' },
        //{ Path: '/rptDeptBudgetExpenseDetail/:Ctry/:Dept', TemplateUrl: '/Templates/OA2/zView1.html', Controller: 'rptDeptBudgetExpenseDetailCtrl' },
            ];

            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('importRouteConfigURL'), { routeList: routes }).then(function (result) {
                console.log(result);
                $scope.group.alerts.push({ type: result.status, msg: result.data });
            },
            function (err) {
                console.log(err);
                $scope.group.alerts.push({ type: "danger", msg: err });
            })
        }

        $scope.importMenu = function () {
            var menus = [
                { Id: 1, Name: 'Home', Type: 'item', Parent: 0, URL: '/#', ClickEvent: '', Icon: 'class="glyphicon glyphicon-home"', Label: 'Home' },
                { Id: 2, Name: 'Products', Type: 'dropdown', Parent: 0, URL: '', ClickEvent: '', Icon: '', Label: 'Products' },
                { Id: 3, Name: 'Refresh Token', Type: 'item', Parent: 0, URL: '', ClickEvent: 'refreshToken()', Icon: '', Label: 'Refresh Token' },
                { Id: 4, Name: 'Users', Type: 'dropdown', Parent: 0, URL: '', ClickEvent: '', Icon: '', Label: 'Users' },
                { Id: 5, Name: 'List Products', Type: 'item', Parent: 2, URL: '/listProducts', ClickEvent: '', Icon: '', Label: 'List Products' },
                { Id: 6, Name: 'Create Product', Type: 'item', Parent: 2, URL: '/createProduct', ClickEvent: '', Icon: '', Label: 'Create Product' },
                { Id: 7, Name: 'List Users', Type: 'item', Parent: 4, URL: '/listUsers', ClickEvent: '', Icon: '', Label: 'List Users' },
                { Id: 8, Name: 'Create User', Type: 'item', Parent: 4, URL: '/createUser', ClickEvent: '', Icon: '', Label: 'Create User' },
                { Id: 9, Name: 'Admin', Type: 'dropdown', Parent: 0, URL: '', ClickEvent: '', Icon: '', Label: 'Admin' },
                { Id: 10, Name: 'DefineMasterData', Type: 'dropdown-submenu', Parent: 9, URL: '', ClickEvent: '', Icon: '', Label: 'Define Master Data' },
                { Id: 11, Name: 'Accounts', Type: 'item', Parent: 10, URL: '/listAccounts', ClickEvent: '', Icon: '', Label: 'Accounts' },
                { Id: 12, Name: 'Clients', Type: 'item', Parent: 10, URL: '/listClients', ClickEvent: '', Icon: '', Label: 'Clients' },
                { Id: 13, Name: 'Users', Type: 'item', Parent: 10, URL: '/listUsers', ClickEvent: '', Icon: '', Label: 'Users' },
                { Id: 14, Name: 'MenuItems', Type: 'item', Parent: 10, URL: '/listMenuItems', ClickEvent: '', Icon: '', Label: 'MenuItems' },
                { Id: 15, Name: 'ClientRoutes', Type: 'item', Parent: 10, URL: '/listClientRoutes', ClickEvent: '', Icon: '', Label: 'ClientRoutes' },
                { Id: 16, Name: 'Routes', Type: 'item', Parent: 10, URL: '/listRoutes', ClickEvent: '', Icon: '', Label: 'Routes' },
                { Id: 17, Name: 'Roles', Type: 'item', Parent: 10, URL: '/listRoles', ClickEvent: '', Icon: '', Label: 'Roles' },
                { Id: 18, Name: 'AccessGrants', Type: 'item', Parent: 10, URL: '/listAccessGrants', ClickEvent: '', Icon: '', Label: 'AccessGrants' },
                { Id: 17, Name: 'Create MenuItem', Type: 'item', Parent: 9, URL: '/createMenuItem', ClickEvent: '', Icon: '', Label: 'Create MenuItem' },
                { Id: 18, Name: 'Build Menu Data', Type: 'item', Parent: 9, URL: '/buildMenuData', ClickEvent: '', Icon: '', Label: 'Build Menu Data' },
                { Id: 19, Name: 'User Activity Log', Type: 'item', Parent: 9, URL: '/listUserActivityLogs', ClickEvent: '', Icon: '', Label: 'User Activity Log' },
                { Id: 20, Name: 'Field Element', Type: 'item', Parent: 9, URL: '/listFields', ClickEvent: '', Icon: '', Label: 'Field Element' }
            ];

            zSrv_InputCustom.httpPost('BuildData/BuildMenuData', { menuList: menus }).then(function (result) {
                console.log(result);
                $scope.group.alerts.push({ type: result.status, msg: result.data });
            },
                function (err) {
                    console.log(err);
                    $scope.group.alerts.push({ type: "danger", msg: err });
                })
        }

        var _fillElements = function (targetElement, details) {
            for (var elem in details) {
                
                var detailElement = {
                    Name: details[elem].Name,
                    Value: details[elem].Value,
                    enableHiding: details[elem].enableHiding,
                    visible: (details[elem].visible ? details[elem].visible : details[elem].Visible),
                    width: details[elem].width,
                    minWidth: details[elem].minWidth,
                    cellFilter: details[elem].cellFilter,
                    filterCellFiltered: details[elem].filterCellFiltered,
                    enableFiltering: details[elem].enableFiltering,
                    enableSorting: details[elem].enableSorting,
                    enablePinning: details[elem].enablePinning,
                    pinnedLeft: details[elem].pinnedLeft,
                    pinnedRight: details[elem].pinnedRight,
                    cellTemplate: details[elem].cellTemplate,
                    filterHeaderTemplate: details[elem].filterHeaderTemplate,
                    filters: details[elem].filters,
                    SelectOptions: details[elem].SelectOptions,
                    UpdateOnBlur: details[elem].UpdateOnBlur,
                    PlaceHolder: details[elem].PlaceHolder,
                    Type: details[elem].Type,
                    IsRequired: details[elem].IsRequired,
                    MinLength: details[elem].MinLength,
                    MaxLength: details[elem].MaxLength,
                    Label: details[elem].Label,
                    DivClass: details[elem].DivClass,
                    ReadOnly: details[elem].ReadOnly,
                    AppendDivClearFix: details[elem].AppendDivClearFix,
                    ShowLabel: details[elem].ShowLabel,
                    AllowDragDrop: details[elem].AllowDragDrop,
                    ClickEvent: details[elem].ClickEvent,
                    URL: details[elem].URL,
                    Icon: details[elem].Icon,
                    Disable: details[elem].Disabled,
                }
                targetElement.push(detailElement);
                //}
                // }
            }
        }

        var _sendToDB = function (promiseSet) {
            var deferred = promiseSet.deferred;
            zSrv_OAuth2.httpPost('/BuildData/BuildFieldData', { FieldList: promiseSet.data }).then(function (result) {
                deferred.resolve(result);
            },
               function (err) {
                   deferred.reject({ type: "danger", msg: err });
               })
            return;
        }

        grp.importFieldElement = function () {
            var grp = $scope.group;
            grp.name = 'ALL';
            var masterFields = zSrv_InputCustom.formFields(grp);
            var promiseArray = [];

            for (var f in masterFields) {
                var fields = [];
                var master = { Name: f, Type: 'FormField', Elements: [], Code: JSON.stringify(masterFields[f]) };
                //for field detail
                //var master = { Name: f, Type: 'FormField', Elements: [] };
                fields.push(master);

                //for field detail
                //_fillElements(master.Elements, masterFields[f]);
                var deferred = $q.defer();
                promiseArray.push({ deferred: deferred, promise: deferred.promise, data: fields });

            }



            //+++++++++++++++++
            grp.name = 'LISTFIELD';
            masterFields = zSrv_InputCustom.listFields(grp);

            for (var f in masterFields) {
                var fields = [];
                var master = { Name: f, Type: 'ListField', Elements: [], Code: JSON.stringify(masterFields[f]) };
                //var master = { Name: f, Type: 'ListField', Elements: [] };
                fields.push(master);

                //_fillElements(master.Elements, masterFields[f]);
                var deferred = $q.defer();
                promiseArray.push({ deferred: deferred, promise: deferred.promise, data: fields });
            }

            //+++++++++++++++++
            grp.name = 'LISTFIELDNAME';
            masterFields = zSrv_InputCustom.listFields(grp);

            for (var f in masterFields) {
                var fields = [];
                var master = { Name: f, Type: 'ListFieldName', Description: masterFields[f] };
                //var master = { Name: f, Type: 'ListField', Elements: [] };
                fields.push(master);

                //_fillElements(master.Elements, masterFields[f]);
                var deferred = $q.defer();
                promiseArray.push({ deferred: deferred, promise: deferred.promise, data: fields });
            }

           

            _sendToDB(promiseArray[0]);
            for (var i = 0; i < promiseArray.length - 1; i++) {
                (function () {
                    var index = i;
                    promiseArray[index].promise.then(function (result) {
                        grp.alerts.push({ type: result.status, msg: result.data });
                        _sendToDB(promiseArray[index + 1]);
                    });
                }());
            }

        }



    }

    zc.$inject = injectParams;

    app.register.controller('buildMenuDataController', zc);

});
