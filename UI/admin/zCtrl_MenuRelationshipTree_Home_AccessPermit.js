angular.module("zPage_Home_AccessPermit")



.controller("menuRelationshipTreeCtrl", ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field',
    function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_Field) {

        $scope.group = {
            name: 'menuRelationshipTree',
            //gridColumnFields: zSrv_InputCustom.formFields({ name: 'menuRelationshipTree' }),
            //fields: zSrv_InputCustom.formFields({ name: 'menuRelationshipTree' }),
            gridResourceURL: zSrv_ResourceServer.getURL('menuURL'),
            createModelURL: null,
            editModelURL: '/treeMenuRelationship',
            listModelURL: null,
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Menu Items Relationship',
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
            resourceURL: zSrv_ResourceServer.getURL('menuURL'),
            modelResource: null,
            cookieGridState: 'listMenuItemsCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
          //  treeMenuRelationshipURL: '/treeMenuRelationship',
            //           rolesMenuItem: '/roleMenuItemAccessGrants',
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            roleSelectedModel: [],
        }

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;
        var grp = $scope.group;

        $scope.$on("$routeChangeSuccess", function () {
            var f = zSrv_InputCustom.formFields({ name: 'menuRelationshipTree' });
            grp.ListFields = '';

            zSrv_Field.getFormFields(f).then(function (d) {
                if (d)
                    grp.fields = d;
                
                var id = $routeParams["id"];
                grp.referenceId = id;
                //grp.formHeader = "Menu Items Relationship";

                grp.modelResource.query({ referId: id }).$promise.then(function (data) {
                    grp.zModel = data;
                    grp.getTreeModelByRole("");
                   // grp.collapseAll();
                }, function (err) {
                    console.log(grp.name + ' - $routeChangeSuccess for treeMenuRelationshipURL event error: ' + err);
                    grp.alerts.push({ type: "danger", msg: err });
                });
            });
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        grp.routeChangeCompleted = function grp_routeChangeCompleted() {

        }


        $scope.group.rolesDropDownMultiselectConfig = {
            smartButtonMaxItems: 1,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            },
            scrollableHeight: '150px',
            scrollable: true,
            closeOnSelect: true,
            selectionLimit: 1
        };

        $scope.group.updateRolesMenuItemModel = function () {

        }

        var getRootNodesScope = function () {
            return angular.element(document.getElementById("tree-root")).scope();
        };


        $scope.group.collapseAll = function () {
            var t = getRootNodesScope();
            t.collapseAll();
        };

        $scope.group.expandAll = function () {
            var t = getRootNodesScope();
            t.expandAll();
        };


        $scope.group.remove = function (scope) {
            scope.remove();
        };

        $scope.group.toggle = function (scope) {
            scope.toggle();
        };


        $scope.group.addSubItem = function (scope, selectId) {
            var parentNode = scope.$modelValue;
            var nodeData = null;
            for (m in $scope.group.zModel) {
                if ($scope.group.zModel[m].Id == selectId) {
                    nodeData = $scope.group.zModel[m];
                    break;
                }
            }

            if (nodeData != null) {
                parentNode.nodes.push({
                    id: nodeData.Id,
                    title: nodeData.Label,
                    rid: 0,
                    nodes: []
                });
            }
        };



        $scope.group.newSubItem = function (scope) {

            mg.modalHeader = 'Append Menu Item';
            var view = "/Templates/OA2/zMV_MenuItem.html";
            $scope.data = { Selection: null };
            mg.zModal = {};
            var ev = null;
            mg.showModal($scope, ev, view, false).then(function (selectedEntity) {
                $scope.group.addSubItem(scope, selectedEntity);
            }, function () {
                //when hide or cancel
            });

            
        };

        var _convertTableToTree = function (dataset) {
            var nodePtr = [];
            var treeNodes = [];
            grp.rootId = dataset[0].parentId;
            nodePtr[grp.rootId] = treeNodes;

            for (var r in dataset) {
                if (dataset[r].id == null) continue;
                var node = {
                    id: dataset[r].id,
                    title: dataset[r].title,
                    type: dataset[r].type,
                    rid: dataset[r].relationId,
                    accessGrants: dataset[r].accessGrants,
                    nodes: []
                };
                nodePtr[dataset[r].id] = node;
                if (dataset[r].parentId == grp.rootId)  // if tree root
                    nodePtr[grp.rootId].push(node);
                else
                    nodePtr[dataset[r].parentId].nodes.push(node);
            }
            return treeNodes
        };

        var _convertTreeToTable = function (dataset, tree, parentId, sortId) {
            for (var t in tree) {
                sortId++;
                var recordset = {
                    id: tree[t].id,
                    title: tree[t].title,
                    parentId: parentId,
                    childId: tree[t].id,
                    relationId: tree[t].rid,
                    sortId: sortId
                }
                dataset.push(recordset);
                if (tree[t].nodes.length > 0)
                    _convertTreeToTable(dataset, tree[t].nodes, tree[t].id, sortId)
            };
            return;
        };


        var _convertTreeToAccessGrantDataSet = function (dataset, tree, parentId, sortId) {
            for (var t in tree) {
                for (var grant in tree[t].accessGrants) {
                    var recordset = {
                        //id: tree[t].roleMenuItemId,   //this cannot be.
                        accessGrant: tree[t].accessGrants[grant].id,
                        menuItemId: tree[t].id
                    }
                    dataset.push(recordset);
                }
                if (tree[t].nodes.length > 0)
                    _convertTreeToAccessGrantDataSet(dataset, tree[t].nodes, tree[t].id, sortId)
            };
            return;
        };


        $scope.group.getTreeModelByRole = function (roleId) {
            grp.isLoading = true;
            //grp.zModel = {};
            zSrv_InputCustom.httpGet("oauth2/api/MenuItems", { roleId: roleId }).then(function (data) {
                //grp.originalDataset = data;
                grp.treeModel = _convertTableToTree(data);
                //initialise newly retrieve record.
                //grp.zModel.ApplicationType = String(grp.zModel.ApplicationType);
                grp.isLoading = false;
            }, function (err) {
                console.log(grp.name + ' - getTreeModel event error: ' + err);
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
            });
        };

        $scope.group.updateTreeModel = function () {
            grp.alerts = [];
            grp.isLoading = true;
            var dataset = [];
            _convertTreeToTable(dataset, grp.treeModel, grp.rootId, 0);
            var menuDataset = { dataset: dataset, clientId: grp.referenceId };
            zSrv_InputCustom.httpPost("oauth2/admin/PutMenuTreeItem", menuDataset).then(function (result) {
                grp.alerts.push({ type: result.status, msg: result.data });
                grp.isLoading = false;
                grp.cancelButtonName = "Close";
            }, function (err) {
                console.log(grp.name + ' - updateTreeModel event error: ' + err);
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
                grp.cancelButtonName = "Cancel";
            });
        };

    }]);





