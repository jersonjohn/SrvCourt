angular.module("zPage_Home_AccessPermit")

.controller("auditlogadminCtrl", ['$scope', '$q', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants',
    function ($scope, $q, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants) {

        

        
            $scope.group = {
                name: 'auditlog',
                gridColumnFields: zSrv_InputCustom.formFields({ name: 'auditlog' }),
                gridResourceURL: zSrv_ResourceServer.getURL('auditLogAdminURL'),
                createModelURL: '/createAuditLogAdmin',
                editModelURL: '/editAuditLogAdmin',
                listModelURL: '/listAuditLogAdmin',
                gridClickKey: 'row.entity.Id',
                showGridEditButton: true,
                canKeyEditDuringCreation: false,
                zModel: {},
                alerts: [],
                //isMyProfile: false,
                isEdit: true,
                isLoading: false,
                cancelButtonName: 'Cancel',
                formHeader: 'Audit Log',
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
                resourceURL: zSrv_ResourceServer.getURL('auditLogAdminURL'),
                modelResource: null,
                cookieGridState: 'listAuditLogAdminCtrl_Grid1',
                //referenceResourceURL: accountUrl,
                referenceModelResource: null,
                currentModelReferenceId: '',
                referenceId: null,
                addCollectionModelURL: null,
                listCollectionModelURL: null,
                indexKey: 'Id',
                newModel: null
            }

            var grp = $scope.group;

            //var queue0 = $q.defer();
            //var process0 = queue0.promise;
            //if (zSrv_InputCustom.formFields({ name: grp.name }) == undefined) {
            //    zSrv_InputCustom.httpGet("oauth2/api/Fields", { name: grp.name }).then(function (d) {
            //        zSrv_InputCustom.addFormField(grp.name, d['Code']);
            //        queue0.resolve();
            //    });
            //} else {
            //    queue0.resolve();
            //}
        
        
            $scope.$on("$routeChangeSuccess", function () {
                //$q.all([process0]).then(function () {
                //grp.gridColumnFields = zSrv_InputCustom.formFields({ name: grp.name });
                    zSrv_InputCustom.routeChangeSuccess($scope.group);
                //});
            });

            $scope.group = zSrv_InputCustom.startInitialise($scope.group);

            //grp.getModelAfterSuccess = function () {
            //    //grp.zModel.IBudgetChargeCategoryId = String(grp.zModel.IBudgetChargeCategoryId);
            //}
       
        
    }]);
