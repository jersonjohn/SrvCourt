'use strict';
//clientUserController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'clientUser',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'clientUser' }),
            gridResourceURL: zSrv_ResourceServer.getURL('clientUserURL'),
            createModelURL: '/createClientUser',
            editModelURL: '/editClientUser',
            listModelURL: '/listClientUsers',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: false,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Client User Authorization',
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
            //           ngCookies: $cookies,
            resourceURL: zSrv_ResourceServer.getURL('clientUserURL'),
            modelResource: null,
            cookieGridState: 'listClientUsersCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
            //listClientUserURL: '/listClientUsers',
            //addUserCollectionModelURL: '/createUser',
            //listUserCollectionModelURL: '/listUsers',
            //addRoleCollectionModelURL: '/createRole',
            //listRoleCollectionModelURL: '/listRoles',
            //addMenuItemCollectionModelURL: '/createMenuItem',
            //listMenuItemCollectionModelURL: '/listMenuItems',
            //addClientRouteCollectionModelURL: '/createClientRoute',
            //listClientRouteCollectionModelURL: '/listClientRoutes',
            indexKey: 'Id',
            newModel: null,
            gridState: null,
            //gridDefaultState: null,
            scope: $scope,
            isToggleAllowed: true,
            toggleAuthorizedButtonName: 'Show Un-Authorized Users',
            modalOptionsCollection: null
        }
        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            //if ($scope.group.ngLocation.path().indexOf($scope.group.listModelURL + "/") == 0) {
            //    id = $scope.group.ngRouteParams["id"];
            //    $scope.group.referenceId = id;

            //}
            zSrv_InputCustom.routeChangeSuccess($scope.group);
            //if ($scope.group.ngLocation.path().indexOf($scope.group.listModelURL) == 0) {
            //    $scope.group.getRolesCollection();
            //}
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        $scope.group.getRolesCollection = function () {
            zSrv_OAuth2.listRolesOptionData().then(
                function (success) {
                    $scope.group.modalOptionsCollection = success.data;
                },
                function (err) {
                    console.log(grp.name + ' - getRolesCollection event error: ' + err);
                    alert(grp.name + ' - getRolesCollection event error: ' + err);
                });
        };

        $scope.group.ListModelAfterSuccess = function (data) {
            $scope.group.getRolesCollection();
            $scope.group.zModel = data;
            $scope.group.originalModelData = angular.copy(data);
        };

        $scope.group.ngDropDownMultiselectConfig = {
            smartButtonMaxItems: 3,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            },
            showCheckAll: false,
            showUncheckAll: false,
            //displayProp: 'Name',
            //idProp: 'RoleId',
            scrollableHeight: '150px',
            externalIdProp: '',
            scrollable: true
            //enableSearch: true,
            //selectionLimit: 2,
            //externalIdProp: 'RoleId'
        };


        $scope.group.toggleAllowed = function (allowedFlag) {

            $scope.group.gridOptions.columnDefs[0].filters[0].term = !$scope.group.isToggleAllowed;
            $scope.group.isToggleAllowed = !$scope.group.isToggleAllowed;
            if ($scope.group.isToggleAllowed)
                $scope.group.toggleAuthorizedButtonName = 'Show Un-Authorized Users';
            else
                $scope.group.toggleAuthorizedButtonName = 'Show Authorized Users';

            $scope.group.gridOptions.gridApi.core.notifyDataChange($scope.group.uiGridConstants.dataChange.COLUMN);
        };

        $scope.group.setAllowedFlag = function (rowEntity) {
            rowEntity.Allowed = !rowEntity.Allowed;
        };

        $scope.group.updateModel = function () {
            var grp = $scope.group;
            var changeDataSet = [];
            var changeAllowSet = [];
            for (var i = 0; i < grp.zModel.length; i++) {

                if (grp.zModel[i]['isModified']) {
                    var changeData = {
                        userId: grp.originalModelData[i]['ApplicationUserId'],
                        roles: grp.zModel[i]['Roles']
                    };
                    changeDataSet.push(changeData);
                }
                if (grp.zModel[i].Allowed != grp.originalModelData[i].Allowed) {
                    var clientUser = {
                        Id: grp.zModel[i].Id,
                        ApplicationUserId: grp.zModel[i].ApplicationUserId,
                        ClientId: grp.zModel[i].ClientId,
                        Status: 'A'
                    };
                    if (grp.zModel[i].Allowed) {
                        changeAllowSet.push(clientUser);
                    } else {
                        clientUser.Status = 'R';
                        changeAllowSet.push(clientUser);
                    }
                }

            }

            if (changeAllowSet.length > 0) {
                zSrv_OAuth2.updateBatchClientUser(changeAllowSet).then(function (data) {
                    $scope.group.alerts.push({ type: 'success', msg: data });
                    if (changeDataSet.length > 0) {
                        zSrv_OAuth2.updateBatchUserRoles(changeDataSet).then(function (success) {
                            $scope.group.alerts.push({ type: success.status, msg: success.data });
                        }, function (err) {
                            console.log($scope.group.name + ' - updateModel event error: ' + err);
                            $scope.group.alerts.push({ type: 'danger', msg: err });
                        });
                    }
                }, function (err) { });
            } else {
                if (changeDataSet.length > 0) {
                    zSrv_OAuth2.updateBatchUserRoles(changeDataSet).then(function (success) {
                        $scope.group.alerts.push({ type: success.status, msg: success.data });
                    }, function (err) {
                        console.log($scope.group.name + ' - updateModel event error: ' + err);
                        $scope.group.alerts.push({ type: 'danger', msg: err });
                    });
                }
            }
        }

        $scope.group.openModal = function (ev, rowEntity) {

            mg.modalHeader = 'User Role Authorization';
            var view = "/Templates/OA2/zMV_ClientUser.html";
            mg.zModal = {};
            mg.zModal.rowEntity = angular.copy(rowEntity);
            mg.showModal($scope, ev, view, false).then(function (selectedEntity) {
                var org_Value = JSON.stringify(rowEntity['Roles']);
                var new_Value = JSON.stringify(selectedEntity['Roles'])

                if (org_Value != new_Value) {
                    var clientId = zSrv_OAuth2.getClientId();
                    while (rowEntity.Roles.length > 0) {
                        rowEntity.Roles.pop();
                    }
                    rowEntity['isModified'] = true;
                    for (var r in selectedEntity['Roles']) {
                        if (selectedEntity['Roles'][r]['label'].indexOf(clientId) != 0) {
                            selectedEntity['Roles'][r]['label'] = clientId + '~' + selectedEntity['Roles'][r]['label'];
                        }
                        rowEntity.Roles.push(selectedEntity.Roles[r]);
                    }
                }
            }, function () {
                //when hide or cancel
            });


        };



    }

    zc.$inject = injectParams;

    app.register.controller('clientUserController', zc);

});
