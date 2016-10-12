angular.module("zPage_Home_AccessPermit")


.controller("fieldCtrl", ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field',
    function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_Field) {
               
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
                grp.zModel.Code = angular.toJson(answer.Code);
            }, function () { });
        }

        grp.FieldElementOptions_OnChange = function () {
            mg.zModal.Code = zSrv_Field.getFormFieldCode(mg.zModal.FieldElement.Name)
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



    }]);

        


       


