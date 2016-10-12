angular.module("zPage_Home_AccessPermit")
        
.controller("changeMyPwdCtrl", ['$scope', '$rootScope', '$window', '$location', 'zSrv_OAuth2', 'zSrv_InputCustom',
    function ($scope, $rootScope, $window, $location, zSrv_OAuth2, zSrv_InputCustom) {

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

        //$scope.fields = [
        //    { Name: 'Current Password', Value: 'oldPassword', UpdateOnBlur: true, PlaceHolder: 'Current Password', Type: 'password', IsRequired: true, MinLength: 6, MaxLength: 20, ShowLabel: true, Label: 'Current Password:', DivClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12' },
        //    { Name: 'New Password', Value: 'newPassword', UpdateOnBlur: true, PlaceHolder: 'New Password', Type: 'password', IsRequired: true, MinLength: 6, MaxLength: 20, ShowLabel: true, Label: 'New Password', DivClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12' },
        //    { Name: 'Confirm Password', Value: 'confirmPassword', UpdateOnBlur: false, PlaceHolder: 'Confirm New Password', Type: 'password', IsRequired: true, MinLength: 6, MaxLength: 20, ShowLabel: true, Label: 'Confirm New Password:', DivClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12', AppendDivClearFix: true },
        //    { Name: 'ZAlert', Type: 'zalert', DivClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12', AppendDivClearFix: true },
        //    { Name: 'ZButton', Value: 'buttons', Type: 'zbuttons', DivClass: 'col-md-12 col-lg-12', AppendDivClearFix: true }
        //];

        //$scope.buttons = [
        //    { Name: 'ZA_ChangePassword', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: 'Frm.$invalid', ClickEvent: 'group.changePassword()', URL: '', Icon: 'class="glyphicon glyphicon-user"', Label: 'Submit new password', AppendDivClearFix: false },
        //    { Name: 'ZA_Close', Type: 'a', DivClass: 'btn btn-primary', Visible: '', Disabled: '', ClickEvent: 'historyBack()', URL: '', Icon: 'class="glyphicon glyphicon-remove-circle"', Label: '{{cancelButtonName}}', AppendDivClearFix: true }
        //];

        $scope.$on("$routeChangeSuccess", function () {

            zSrv_InputCustom.routeChangeSuccess($scope.group);

            if ($location.path().indexOf("/changeMyPassword") == 0) {
                //$scope.group.fields = zSrv_InputCustom.formFields(grp);
                //$scope.group.buttons = zSrv_InputCustom.formButtons(grp);
                //$scope.formHeader = "Change My Password";
                $scope.group.zModel = {
                    userName: $rootScope.thisToken.userName,
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                };
            }
            //if ($location.path().indexOf("/editUser/") == 0) {
            //    var id = $routeParams["id"];
            //    zSrv_OAuth2.getProfile(id).then(function (response) {
            //        $scope.zModel = response.data;
            //        //var date = new Date(parseInt(jsonDate.substr(6)));
            //        //$scope.zModel.Birthday = new Date(parseInt($scope.zModel.Birthday.substr(6)));
            //        //$scope.zModel.Birthday = new Date($scope.zModel.Birthday);
            //        console.log("$scope.zModel.UserName is " + $scope.zModel.UserName);
            //    }, function (err) {
            //        console.log(err)
            //        $scope.alerts.push({ type: "danger", msg: err });
            //    });
            //}
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

    }]);