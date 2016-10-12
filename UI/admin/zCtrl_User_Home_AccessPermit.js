angular.module("zPage_Home_AccessPermit")

.controller("userCtrl", ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_ResourceServer', 'zSrv_MagnificPopUp', 'Upload', 'zSrv_Field',
    function ($scope, $rootScope, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_InputCustom, uiGridConstants, zSrv_ResourceServer, zSrv_MagnificPopUp, Upload, zSrv_Field) {

        $scope.group = {
            name: 'user',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'user' }),
            //gridResourceURL: userUrl,   // only apply to externalPaginationGrid
            createModelURL: '/createUser',
            editModelURL: '/editUser',
            listModelURL: '/listUsers',
            gridClickKey: 'row.entity.UserName',
            showGridEditButton: true,
            canKeyEditDuringCreation: true,
            zModel: {},
            alerts: [],
            isMyProfile: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'User Profile',
            fields: [],
            buttonTop: [],
            buttons: [],
            gridOptions: {},
            toggleFiltering: null,
            listModels: null,
            editModel: null,
            //getModel: null,
            updateModel: null,
            createModel: null,
            deleteModel: null,
            forgetPassword: null,
            resetPassword: null,
            uiGridConstants: uiGridConstants,
            ngResource: null,
            ngLocation: $location,
            ngRouteParams: $routeParams,
            resourceURL: null,
            cookieGridState: 'listUsersCtrl_Grid1',
            //referenceResourceURL: accountUrl,
            referenceModelResource: null,
            currentModelReferenceId: 'AccountId',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: null,
            newModel: null,
            gridState: null,
            //gridDefaultState: null,
            scope: $scope, 
            ProfileImg_ApiSource: zSrv_ResourceServer.getURL('profileImageURL'),
            //tabStatus: {},
 //           ngCookies: $cookies
        }
        //$scope.group.tabStatus['divTabBlock'] = [];
        //$scope.group.tabStatus['divTabBlock'][0] = 1;
        //$scope.group.tabStatus['divTabBlock'][1] = 0;

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        $scope.$on("$routeChangeSuccess", function () {
            //zSrv_InputCustom.routeChangeSuccess($scope.group);
            $scope.group.zModel = {};
            $scope.group.alerts = [];
            $scope.group.cancelButtonName = "Cancel";
            $scope.group.ListFields = zSrv_InputCustom.listFields($scope.group);

            zSrv_Field.getFormFields($scope.group).then(function () { 

                if ($location.path().indexOf($scope.group.listModelURL) == 0) {
                    $scope.group.formHeader = "User Master - List";
                    $scope.group.fields = zSrv_InputCustom.listFields($scope.group);
                    //$scope.group.buttonTop = zSrv_InputCustom.listButtonTop($scope.group);
                    //$scope.group.buttons = zSrv_InputCustom.listButtons($scope.group);
                    var id = null;
                    if ($scope.group.ngLocation.path().indexOf($scope.group.listModelURL + "/") == 0) {
                        id = $scope.group.ngRouteParams["id"];
                        $scope.group.referenceId = id;
                    }
                    $scope.group.listModels(id);
                } else {
                    $scope.group.fields = zSrv_InputCustom.formFields($scope.group);
                    //$scope.group.buttons = zSrv_InputCustom.formButtons($scope.group);
                }

                zSrv_OAuth2.getMenuAccessGrants($scope.group);
                console.log("&& >> MenuAccessGrants for " + $scope.group.ngLocation.path() + " => " + $scope.group.OAuthAccessGrants);

                if ($location.path().indexOf($scope.group.editModelURL) == 0) {
                    $scope.group.formHeader = "User Profile - Edit";
                    $scope.group.isMyProfile = false;
                    $scope.group.isEdit = true;
                    //$scope.group.fields[0].ReadOnly = true;
                   // $scope.group.buttons[0].ClickEvent = 'group.updateModel()';
                   // $scope.group.buttons[0].Label = 'Update';
                }

                if ($location.path().indexOf($scope.group.createModelURL) == 0) {
                    $scope.group.formHeader = "User Profile - Create";
                    $scope.group.isMyProfile = false;
                    $scope.group.isEdit = false;
                    $scope.group.zModel = { Birthday: new Date('1980-01-01') };
                    //$scope.group.fields[0].ReadOnly = !$scope.group.canKeyEditDuringCreation;
                    //$scope.group.buttons[0].ClickEvent = 'group.createModel()';
                    //$scope.group.buttons[0].Label = 'Save';
                }

                if ($location.path().indexOf("/myProfile") == 0) {
                    $scope.group.formHeader = "My Profile - Edit";
                    $scope.group.isMyProfile = true;
                    $scope.group.isEdit = true;
                    //$scope.zModel = { Birthday: new Date('1980-01-01') };
                    //$scope.group.fields[0].ReadOnly = true;
                    //$scope.group.buttons[0].ClickEvent = 'group.updateModel()';
                    //$scope.group.buttons[0].Label = 'Update my profile';

                    zSrv_OAuth2.getProfile($rootScope.thisToken.userName).then(function (response) {
                        $scope.group.zModel = response.data;
                        //$rootScope.myProfile.Birthday = new Date($rootScope.myProfile.Birthday);
                    }, function (err) {
                        console.log(err);
                        $scope.group.alerts.push({ type: "danger", msg: err });
                    });
                }

                if ($location.path().indexOf($scope.group.editModelURL + "/") == 0) {
                    var id = $routeParams["id"];
                    if (id == $rootScope.thisToken.userName)
                        $scope.group.ngLocation.path('/myProfile').replace();
                    else
                        $scope.group.getModel(id);
                }

                if ($location.path().indexOf($scope.group.createModelURL + "/") == 0) {
                    var id = $routeParams["id"];
                    $scope.group.zModel = {};
                    $scope.group.referenceId = id;
                    $scope.group.zModel[$scope.group.currentModelReferenceId] = id;
                }

            });

        });

        //initialize the ui.grid
//        $scope.group.gridOptions = zSrv_InputCustom.listGridOptions($scope.group, zSrv_InputCustom.formFields($scope.group));
        //$scope.group.gridOptions.onRegisterApi = function (gridApi) {
        //    $scope.group.gridApi = gridApi;
        //}

        //zSrv_InputCustom.init($scope.group);
        $scope.group.toggleFiltering = function () {
            $scope.group.gridOptions.enableFiltering = !$scope.group.gridOptions.enableFiltering;
            $scope.group.gridOptions.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };


        //$scope.group.ngIfByButtonName = function (btnName) {
        //    return zSrv_OAuth2.accessGrantControl(btnName);
        //}
        //initialize events
        //$scope.group.getReference = function (id) {
        //    $scope.group.zModel = {};
        //    $scope.group.referenceId = id;
        //}

        $scope.group.listModels = function (id) {
            $scope.group.isLoading = true;
            zSrv_OAuth2.listUsers(id).then(function (result) {
                $scope.group.zModel = result.data;
                $scope.group.gridOptions.data = $scope.group.zModel;
                $scope.group.gridOptions.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                $scope.group.isLoading = false;

            }, function (err) {
                console.log($scope.group.name + ' - listModel event error: ' + err);
                $scope.group.alerts.push({ type: 'warning', msg: err });
                $scope.group.isLoading = false;
            });
        };

        $scope.group.getModel = function (id) {
            $scope.group.isLoading = true;
            $scope.group.zModel = {};
            zSrv_OAuth2.getProfile(id).then(function (response) {
                $scope.group.zModel = response.data;
                //var date = new Date(parseInt(jsonDate.substr(6)));
                //$scope.zModel.Birthday = new Date(parseInt($scope.zModel.Birthday.substr(6)));
                //$scope.zModel.Birthday = new Date($scope.zModel.Birthday);
                console.log("$scope.group.zModel.UserName is " + $scope.group.zModel.UserName);
                $scope.group.isLoading = false;
            }, function (err) {
                console.log($scope.group.name + ' - getModel event error: ' + err)
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.isLoading = false;
            });

        }

        $scope.group.editModel = function (id) {
            $location.path($scope.group.editModelURL + "/" + id);
        }
        
        $scope.group.newModel = function () {
            //if ($scope.group.referenceId)
            //    $scope.group.ngLocation.path($scope.group.createModelURL + "/" + $scope.group.referenceId);
            //else
            //    $scope.group.ngLocation.path($scope.group.createModelURL);
            var grp = $scope.group;
            if (grp.ngLocation.path().indexOf(grp.createModelURL) != -1)
                $route.reload();
            else
                grp.ngLocation.path(grp.createModelURL);
        }

        $scope.group.updateModel = function () {
            $scope.group.alerts = [];
            $scope.group.isLoading = true;
            zSrv_OAuth2.saveUserProfile($scope.group.zModel).then(function (result) {
                $scope.group.cancelButtonName = "Close";
                $scope.group.isLoading = false;
                if ($scope.group.isMyProfile)
                    $rootScope.myProfile = $scope.group.zModel;
                $scope.group.alerts.push({ type: result.status, msg: 'Saved successfully.' });
            }, function (err) {
                $scope.group.cancelButtonName = "Cancel";
                $scope.group.isLoading = false;
                $scope.group.alerts.push({ type: 'danger', msg: err });
            });
        };

        $scope.group.createModel = function () {
            $scope.group.alerts = [];
            $scope.group.isLoading = true;
            zSrv_OAuth2.createUserProfile($scope.group.zModel).then(function (result) {
                $scope.group.alerts.push({ type: result.status, msg: $scope.group.zModel.UserName + ' is created successfully.' });
                $scope.group.isEdit = true;
                $scope.group.cancelButtonName = "Close";
                $scope.group.isLoading = false;
            }, function (err) {
                $scope.group.alerts.push({ type: "danger", msg: err });
                $scope.group.cancelButtonName = "Cancel";
                $scope.group.isLoading = false;
            });
        };

        $scope.group.deleteModel = function (user) {
            $scope.group.alerts = [];
            $scope.group.isLoading = true;
            zSrv_OAuth2.deleteUser(user.UserName).then(function (result) {
                $scope.group.isLoading = false;
                //$scope.users.splice($scope.users.indexOf(user), 1);
                //$scope.alerts.push({ type: result.status, msg: user.UserName + ' is removed successfully.' });
                $scope.group.alerts.push({ type: result.status, msg: $scope.group.zModel.UserName + ' is removed successfully.' });
                alert(user.UserName + ' is removed successfully.');
                $location.path($scope.group.listModelURL);
                //$scope.group.cancelButtonName = "Close";
            }, function (err) {
                $scope.group.isLoading = false;
                $scope.group.alerts.push({ type: 'danger', msg: err });
            });
        };

        $scope.group.forgetPassword = function () {
            $scope.group.alerts = [];
            $scope.group.isLoading = true;
            zSrv_OAuth2.forgetPassword($scope.group.zModel.UserName).then(function (response) {
                $scope.group.isLoading = false;
                $scope.group.resetPasswordCode = response.data;
                $scope.group.alerts.push({ type: response.status, msg: 'Reset passcode received successfully.' });
            }, function (err) {
                $scope.group.isLoading = false;
                $scope.group.alerts.push({ type: "danger", msg: "Having problem to reset passcode. Pls try again later." });
            });
        };

        $scope.group.changeProfilePicture = function (ev) {
            console.log('changeProfilePicture is called for ' + $scope.group.zModel.UserName);
            mg.modalHeader = 'Profile Picture';
            //var view = "/Templates/OA2/zIssueDetailAttachment.html";
            var view = "/Templates/OA2/zMV_ProfilePicture.html";
            mg.showModal($scope, ev, view, true).then(function () {
            }, function () { });
        }

        mg.onFileUploadSuccess = function () {
            //var data = mg.successResult.data;
            //mg.zModalAttachment.unshift(data);
            //grp.ImageCount = Number(grp.ImageCount) + 1;
            //$rootScope.refreshImage = true;
        }

        $scope.upload = function (dataUrl) {
            Upload.upload({
                url: $scope.group.ProfileImg_ApiSource,
                data: {
                    id: $scope.group.zModel.UserName,
                    file: Upload.dataUrltoBlob(dataUrl)
                },
            }).then(function (response) {
                $rootScope.refreshImage = true;
                mg.close();
                //$rootScope.refreshImage = false;
                //$timeout(function () {
                //    $scope.result = response.data;
                //});
            }, function (response) {
                //if (response.status > 0) $scope.errorMsg = response.status
                //    + ': ' + response.data;
            }, function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        $scope.closePopUp = function () {
            mg.close();
        }


        $scope.group.resetPassword = function () {
            $window.location.href = $scope.group.resetPasswordCode;
        };

        $scope.group.historyBack = function () {
            $window.history.back();
        };

    }]);
