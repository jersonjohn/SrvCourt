angular.module("zPage_Home_AccessPermit")

.controller("roleCtrl", ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_InputCustom', 'uiGridConstants', 
    function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_InputCustom, uiGridConstants) {

        $scope.group = {
            name: 'role',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'role' }),
            gridResourceURL: null,   // only apply to externalPaginationGrid
            createModelURL: '/createRole',
            editModelURL: '/editRole',
            listModelURL: '/listRoles',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Role Master',
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
            resourceURL: null,
            modelResource: null,
            cookieGridState: 'listRolesCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'ClientId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null
        }
            

        $scope.$on("$routeChangeSuccess", function () {
            zSrv_InputCustom.routeChangeSuccess($scope.group);
            if ($scope.group.ngLocation.path().indexOf($scope.group.listModelURL) == 0) {
                $scope.group.listModels();
            }

        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        
        $scope.group.listModels = function () {
            $scope.group.isLoading = true;
            var id = ($scope.group.referenceId) ? $scope.group.referenceId : null;
            zSrv_OAuth2.listRoles(id).then(function (result) {
                $scope.group.zModel = result.data;
                $scope.group.gridOptions.data = $scope.group.zModel;
                $scope.group.gridOptions.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                console.log($scope.group.name + " models records size is " + $scope.group.zModel.length);
                $scope.group.isLoading = false;

            }, function (err) {
                console.log($scope.group.name + ' - listModel event error: ' + err);
                $scope.group.alerts.push({ type: 'warning', msg: err });
                $scope.group.isLoading = false;
            });
        }

        $scope.group.getModel = function (id) {
            $scope.group.isLoading = true;
            $scope.group.zModel = {};
            zSrv_OAuth2.getRole(id).then(function (result) {
                $scope.group.zModel = result.data
                $scope.group.isLoading = false;
                //$scope.group.getModelAfterSuccess(result);
            }, function (err) {
                console.log($scope.group.name + ' - getModel event error: ' + err);
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.isLoading = false;
            });
        }

        //$scope.group.getModelAfterSuccess = function (result) {
        //    $scope.group.getAccessGrantOptions();
        //    $scope.group.getTreeModelByRole($scope.group.referenceId);
        //}

        $scope.group.editModel = function (id) {
            $location.path($scope.group.editModelURL + "/" + id);
        }

        var _isOverPower = function(power) {
            return (power > $rootScope.MyProfile.Power);
        }

        $scope.group.updateModel = function (ev, model) {
            $scope.group.alerts = [];
            if (_isOverPower(model.Power)) {
                $scope.group.alerts.push({ type: 'danger', msg: 'Power value cannot more than ' + $rootScope.MyProfile.Power });
                return;
            }
            $scope.group.isLoading = true;
            zSrv_OAuth2.updateRole(model).then(function () {
                $scope.group.alerts.push({ type: 'success', msg: 'Saved successfully.' });
                $scope.group.isLoading = false;
                $scope.group.cancelButtonName = "Close";
         //       $scope.group.updateModelAfterSuccess();
            }, function (err) {
                console.log($scope.group.name + ' - updateModel event error: ' + err);
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.isLoading = false;
                $scope.group.cancelButtonName = "Cancel";
            });
        }

        //$scope.group.updateModelAfterSuccess = function () {
        //    $scope.group.updateRoleMenuItemTreeModel($scope.group.referenceId);
        //}



        $scope.group.createModel = function (ev, model) {
            $scope.group.alerts = [];
            if (_isOverPower(model.Power)) {
                $scope.group.alerts.push({ type: 'danger', msg: 'Power value cannot more than ' + $rootScope.Power });
                return;
            }
         
            $scope.group.isLoading = true;
            zSrv_OAuth2.createRole(model).then(function (newmodel) {
                $scope.group.alerts.push({ type: 'success', msg: 'Created successfully.' });
                $scope.group.isLoading = false;
                $scope.group.cancelButtonName = "Close";
            }, function (err) {
                console.log($scope.group.name + ' - createModel event error: ' + err);
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.isLoading = false;
                $scope.group.cancelButtonName = "Cancel";
            });
        }

        $scope.group.deleteModel = function (ev, model) {
            $scope.group.alerts = [];
            $scope.group.isLoading = true;
            zSrv_OAuth2.deleteRole(model.Id).then(function () {
                $scope.group.isLoading = false;
                $scope.group.alerts.push({ type: 'success', msg: 'Removed successfully.' });
                alert('This record is removed successfully.');
                //$scope.models.splice($scope.models.indexOf(model), 1);
                $scope.group.historyBack();
            }, function (err) {
                console.log($scope.group.name + ' - deleteModel event error: ' + err);
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.isLoading = false;
                $scope.group.cancelButtonName = "Cancel";
            });
        }

    }]);
