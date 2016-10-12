'use strict';
//changeMyPwdController
define(['app'], function (app) {

    var injectParams = ['$rootScope', 'zSrv_OAuth2', '$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', ];

    var zc = function ($rootScope, zSrv_OAuth2, $scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field) {

        var vm = this;


        $scope.group = {
            name: 'changeMyPwd',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'changeMyPwd' }),
            createModelURL: '/changeMyPassword',
            editModelURL: null,
            listModelURL: null,
            gridClickKey: 'row.entity.Id',
            showGridEditButton: false,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            //isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Close',
            formHeader: 'Change My Password',
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
            //uiGridConstants: uiGridConstants,
            //ngResource: $resource,
            ngLocation: $location,
            //ngRouteParams: $routeParams,
            ngScope: $scope,
            resourceURL: null,
            modelResource: null,
            cookieGridState: null
        };



        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);

            if ($location.path().indexOf("/changeMyPassword") == 0) {
                $scope.group.zModel = {
                    userName: $rootScope.thisToken.userName,
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                };
            }
            
        });

        var grp = $scope.group;
        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        grp.changePassword = function () {
            grp.alerts = [];
            if (grp.zModel.newPassword == grp.zModel.confirmPassword) {
                grp.isLoading = true;
                zSrv_OAuth2.changePassword(grp.zModel).then(function (result) {
                    grp.cancelButtonName = "Close";
                    grp.alerts.push({ type: result.status, msg: result.data });
                    grp.AllowDiscardChanges = true;
                    grp.isLoading = false;
                }, function (err) {
                    grp.cancelButtonName = "Cancel";
                    grp.alerts.push({ type: "danger", msg: err });
                    grp.isLoading = false;
                })
            } else {
                grp.alerts.push({ type: "warning", msg: "New password and confirm password not match." });
            }
        };


    }

    zc.$inject = injectParams;

    app.register.controller('changeMyPwdController', zc);

});
