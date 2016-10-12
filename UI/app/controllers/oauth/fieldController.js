'use strict';
//fieldController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_zNotify'];

    var fieldController = function ($scope, $http, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_zNotify) {

        var vm = this;


        $scope.group = {
            name: 'field',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'field' }),
            //gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'fieldDetail' }),
            gridResourceURL: zSrv_ResourceServer.getURL('fieldURL'),   // only apply to externalPaginationGrid
            //gridDetailResourceURL: zSrv_ResourceServer.getURL('fieldDetailURL'),   // only apply to externalPaginationGrid
            createModelURL: '/createField',
            editModelURL: '/editField',
            //editDetailModelURL: '/editFieldDetail',
            listModelURL: '/listFields',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'Field Elements',
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
            resourceURL: zSrv_ResourceServer.getURL('fieldURL'),
            modelResource: null,
            cookieGridState: 'listFieldsCtrl_Grid1',
            zData: {},
            indexKey: 'Id'
        };

        var grp = $scope.group;
        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            grp.zData.FieldElementOptions = zSrv_Field.getDataFormFieldArray();
            zSrv_InputCustom.routeChangeSuccess($scope.group);



        });

        

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        grp.ImportModel = function (ev) {
            mg.modalFields = zSrv_InputCustom.formFields({ name: 'importFieldCodeForm' });
            mg.isModalEdit = false;
            mg.modalHeader = 'Import hard-coded field code';
            var view = null;
            mg.zModal = {};
            mg.showModal($scope, ev, view, false).then(function (answer) {
                grp.zModel.Code = answer.Code;
                if (grp.ngScope && grp.ngScope.Frm)
                    grp.ngScope.Frm.$setDirty();
            }, function () { });
        }

        grp.FieldElementOptions_OnChange = function () {
            mg.zModal.Code = angular.toJson(zSrv_Field.getFormFieldCode(mg.zModal.FieldElement));
        }

        //convert dataModel to treeModel
        var _addNodesToTree = function addNodesToTree(tree) {
            for (var n in tree) {
              //  tree[n]['title'] = tree[n]['Name'];
                if (angular.isArray(tree[n].Value)) {
                    tree[n]['nodes'] = tree[n].Value;
                    _addNodesToTree(tree[n]['nodes']);
                }
            }
        }

        //convert treeModel to dataModel
        var _removeNodesInTree = function addNodesToTree(tree) {
            for (var n in tree) {
             //   delete tree[n]['title'];
                if (tree[n].nodes) {
                    _removeNodesInTree(tree[n].nodes);
                    delete tree[n].nodes;
                }
            }
        }

        var _findThenUpdateNode = function findThenUpdateNode(key, node, treeModel) {
            for (var n in treeModel) {
                if (treeModel[n] === key) {
                    treeModel[n] = node;
                    return treeModel[n];
                }
                    
                if (treeModel[n].nodes)
                    _findThenUpdateNode(key, node, treeModel[n].nodes);
            }
            return null;
        }

        grp.getModelAfterSuccess = function (data) {
            grp.refreshTreeModel();
        }

        grp.refreshTreeModel = function () {
            var d = angular.fromJson(grp.zModel.Code);
            _addNodesToTree(d);
            grp.treeModel = d;
        }

        var _syncTreeToCode = function syncTreeToCode(event) {
            var d = angular.copy(grp.treeModel);
            _removeNodesInTree(d);
            grp.zModel.Code = angular.toJson(d);
            if (grp.ngScope && grp.ngScope.Frm)
                grp.ngScope.Frm.$setDirty();
        }

        grp.droppedNode = function (event) {
            _syncTreeToCode()
            
        }

        grp.removedNode = function (node) {
            //node.remove();
            _syncTreeToCode();
            
        };

        grp.editNode = function (node) {
            //var n = _findNodeName(node, grp.treeModel);
            //console.log(n);
            grp.alerts = [];
            mg.modalFields = zSrv_InputCustom.formFields({ name: 'mvEditFieldNodeForm' });
            mg.isModalEdit = false;
            mg.modalHeader = 'Edit Field Code';
            var view = null;
            mg.zModal = {};
            mg.zModal.nodeModel = angular.toJson(node.node); //[{title: 'One'}, {title: 'Two'}];
            var ev = null;
            mg.showModal($scope, ev, view, false).then(function (answer) {
                //grp.zModel.Code = angular.toJson(answer.Code);
                var n = angular.fromJson(answer.nodeModel);
                var f = _findThenUpdateNode(node.node, n, grp.treeModel);
                node.node = f;
                _syncTreeToCode();
			  
                //console.log(answer);
            }, function () { });
        }

        grp.addNode = function () {
            mg.modalFields = zSrv_InputCustom.formFields({ name: 'mvAddFieldNodeForm' });
            mg.gridResourceURL = zSrv_ResourceServer.getURL('fieldTemplateURL');
            mg.gridColumnFields = zSrv_InputCustom.formFields({ name: 'mvAddFieldNodeFormGrid' });
           // mg.ngLocation = grp.ngLocation;
            zSrv_Field.getFormFields(mg).then(function () {
                mg.isModalEdit = false;
                mg.modalHeader = 'Add Field Code';
                var view = null;
                mg.zModal = {};
                var ev = null;
                var selectedRows = [];
                mg.showModal($scope, ev, view, false).then(function (answer) {
                    for (var r in answer.selectedRows)
                        selectedRows.push(answer.selectedRows[r]);
                    //console.log(selectedRows);
                    for (var s in selectedRows) {
                        var dNode = angular.fromJson(selectedRows[s].Code);
                        if (angular.isArray(dNode.Value))
                            dNode.nodes = dNode.Value;
                        grp.treeModel.push(dNode);
                    }
                    if (selectedRows.length > 0) {
                        _syncTreeToCode();
                        
                    }

                }, function () { });
            });
        }

        grp.addTemplate = function (event, model, parentModel) {

            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('fieldTemplateURL'), {
                'Name': model.nodeModel.Name,
                'FieldMasterName': parentModel.Name,
                'Type': model.nodeModel.Type,
                'Code': angular.toJson(model.nodeModel)
            }).then(function (newValue) {
                grp.alerts.push({ type: 'success', msg: 'Saved successfully.' });
                grp.isLoading = false;
                zSrv_zNotify.note('success', 'Added Template', 'This field is saved into template successfully.');
                //mg.show(ev, 'Added Template', 'This field is saved into template successfully.')
                //grp.ngLocation.path(grp.editModelURL + "/" + newValue.Id).replace();
            }, function (err) {
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
            });
        }
        

        grp.updateModelAfterSuccess = function (zmodel) {
            zSrv_Field.addFormField(zmodel.Name, zmodel.Code);
        }

        grp.createModelAfterSuccess = function (zmodel) {
            zSrv_Field.addFormField(zmodel.Name, zmodel.Code);
        }

        grp.deleteModelAfterSuccess = function (zmodel) {
            zSrv_Field.addFormField(zmodel.Name, []);
        }



    }

    fieldController.$inject = injectParams;

    app.register.controller('fieldController', fieldController);

});
