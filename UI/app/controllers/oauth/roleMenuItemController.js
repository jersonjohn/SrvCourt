'use strict';
//roleMenuItemController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'roleMenuItemAccessGrant',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'roleMenuItemAccessGrant' }),
            //gridResourceURL: clientUrl,   // only apply to externalPaginationGrid
            createModelURL: '/createMenuItem',
            editModelURL: '/editMenuItem',
            listModelURL: '/roleMenuItemAccessGrants',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: false,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Roles/MenuItem vs AccessGrants',
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
            //            ngCookies: $cookies,
            resourceURL: null,
            modelResource: null,
            cookieGridState: 'roleMenuItemsCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: '',
            referenceId: null,
            //treeMenuRelationshipURL: '/treeMenuRelationship',
            //            rolesMenuItem: '/roleMenuItemAccessGrants',
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            roleSelectedModel: []

        }

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            zSrv_InputCustom.routeChangeSuccess($scope.group);


            grp.getRolesMenuItemModel();
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);
        var grp = $scope.group;

        grp.routeChangeCompleted = function () {
            grp.getRolesMenuItemModel();
        }

        //$scope.group.rolesDropDownMultiselectConfig = {
        //    smartButtonMaxItems: 1,
        //    smartButtonTextConverter: function (itemText, originalItem) {
        //        return itemText;
        //    },
        //    //showCheckAll: false,
        //    //showUncheckAll: false,
        //    //displayProp: 'Name',
        //    //idProp: 'RoleId',
        //    scrollableHeight: '150px',
        //    scrollable: true,
        //    //enableSearch: true,
        //    closeOnSelect: true,
        //    selectionLimit: 1
        //    //externalIdProp: 'RoleId'
        //};

        $scope.group.ngDropDownMultiselectConfig = {
            smartButtonMaxItems: 5,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            },
            showCheckAll: true,
            showUncheckAll: true,
            //displayProp: 'Name',
            //idProp: 'RoleId',
            scrollableHeight: '150px',
            scrollable: true,
            externalIdProp: ''   // full object model
            //enableSearch: true,
            //selectionLimit: 2,
            //externalIdProp: 'RoleId'
        };


        $scope.group.updateRolesMenuItemModel = function () {
            var grp = $scope.group;
            var roleMenuItemDataset = [];
            var arr = grp.roleMenuAccessFullSet;
            for (var m in arr) { // for each menuItemId
                for (var r in arr[m]) {  // for each roleId
                    for (var a in arr[m][r]) {
                        var changeData = {
                            menuItemId: m,
                            roleId: r,
                            accessGrantId: arr[m][r][a]['id']
                        };
                        roleMenuItemDataset.push(changeData);
                    }
                }
            }

            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('roleMenuURL'), roleMenuItemDataset).then(function () {
                grp.alerts.push({ type: 'success', msg: 'Role MenuItems access grants setting saved successfully.' });
                grp.isLoading = false;
                grp.cancelButtonName = "Close";
            }, function (err) {
                console.log(grp.name + ' - updateRoleMenuItemTreeModel event error: ' + err);
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
                grp.cancelButtonName = "Cancel";
            });
        }

        $scope.group.getRolesMenuItemModelByRoleId = function (roleId) {
            var grp = $scope.group;

            for (var m in grp.zModel) {
                grp.zModel[m]['AccessGrants'] = grp.roleMenuAccessFullSet[grp.zModel[m]['Id']][roleId];
            }

            grp.gridOptions.data = grp.zModel;
            // grp.gridOptions.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.OPTIONS);
        }


        $scope.group.getRolesMenuItemModel = function () {
            var grp = $scope.group;
            var modelResource = grp.ngResource(zSrv_ResourceServer.getURL('roleMenuURL') + ":id", { id: "@Id" },  //@Id is model.Id
                                 {
                                     create: { method: "POST" }, save: { method: "PUT" },
                                     remove: { method: "DELETE" }
                                 });
            grp.isLoading = true;
            modelResource.get().$promise.then(function (resultModel) {

                grp.accessGrantsOptionsCollection = resultModel['accessGrantsOptions'];
                grp.modalOptionsCollection = resultModel['rolesOptions'];
                //get grid data
                grp.zModel = resultModel['gridDataSet'];
                grp.roleMenuItemSet = resultModel['roleMenuItemSet'];

                var firstRole = grp.modalOptionsCollection[0];
                grp.roleSelectedModel['id'] = firstRole['id'];

                grp.roleMenuAccessFullSet = [];
                var list = grp.roleMenuAccessFullSet;
                for (var m in grp.zModel)   // list of menuItems
                    for (var r in grp.modalOptionsCollection) { // list of roles 
                        if (!list[grp.zModel[m]['Id']])
                            list[grp.zModel[m]['Id']] = [];
                        if (!list[grp.zModel[m]['Id']][grp.modalOptionsCollection[r]['id']])
                            list[grp.zModel[m]['Id']][grp.modalOptionsCollection[r]['id']] = [];
                    }

                for (var r in grp.roleMenuItemSet) {
                    var accessGrant = {
                        id: grp.roleMenuItemSet[r]['accessGrantId'].toString(),
                        label: grp.roleMenuItemSet[r]['accessGrantName']
                    };
                    list[grp.roleMenuItemSet[r]['menuItemId']][grp.roleMenuItemSet[r]['roleId']].push(accessGrant);
                }

                grp.getRolesMenuItemModelByRoleId(firstRole['id'])
                grp.isLoading = false;

            }, function (err) {
                console.error(grp.name + ' - getRolesMenuItemModel event error: ' + err);
                grp.isLoading = false;
            });
        }

        $scope.group.RoleSelectionChanged = function (item) {
            if (item)
                $scope.group.getRolesMenuItemModelByRoleId(item['id']);
        }

        $scope.group.openAccessGrantsModal = function (ev, rowEntity) {

            mg.modalHeader = 'Access Grants Authorization';
            var view = "/Templates/OA2/zMV_RoleMenuItem.html";

            mg.zModal = {};
            mg.zModal.rowEntity = angular.copy(rowEntity);
            mg.showModal($scope, ev, view, false).then(function (selectedEntity) {
                while (rowEntity.AccessGrants.length > 0) {
                    rowEntity.AccessGrants.pop();
                }

                for (var s in selectedEntity.AccessGrants) {
                    rowEntity.AccessGrants.push(selectedEntity.AccessGrants[s]);
                }
            }, function () {
                //when hide or cancel
            });
            
        };


    }

    zc.$inject = injectParams;

    app.register.controller('roleMenuItemController', zc);

});
