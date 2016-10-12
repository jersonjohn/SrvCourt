'use strict';

//eSMSInboxController

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp', '$q'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, $q) {

        var vm = this;

        //Determine is by branch / by consultant
        var byAdmin = false;
        var byBranch = false;
        var byConsultant = false;
        var resourceURL = "";
        var parameters = "";

        //For Testing//////
        //$rootScope.MyProfile.UserName = "005927";
        //End Testing///////

        if ($location.path() == "/listeSMSInbox") {
            resourceURL = zSrv_ResourceServer.getURL('eSMSInboxListURL');
            byAdmin = true;
        }
        else if ($location.path() == "/listeSMSInbox/B") {
            parameters = $rootScope.MyProfile.UserName + '||' + 'Branch';
            resourceURL = zSrv_ResourceServer.getURL('eSMSInboxListURL');
            byBranch = true;
        }
        else if ($location.path() == "/listeSMSInbox/C") {
            parameters = $rootScope.MyProfile.UserName + '||' + 'Cons';
            resourceURL = zSrv_ResourceServer.getURL('eSMSInboxListURL'); 
            byConsultant = true;
        }
        else if ($location.path().indexOf("/editeSMSInbox") == 0)
        {
            resourceURL = zSrv_ResourceServer.getURL('eSMSeApptInboxDetailURL') + "AESMASTER";      
        }

        $scope.group = {
            name: 'eSMSInbox',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'eSMSInbox' }),
            gridResourceURL: resourceURL,
            gridDetailColumnFields: zSrv_InputCustom.formFields({ name: 'eSMSInboxDetail' }),
            gridDetailResourceURL: zSrv_ResourceServer.getURL('eSMSeApptInboxDetailByGroupURL') + "AESMASTER",
            listModelURL: '/listeSMSInbox',
            editModelURL: '/editeSMSInbox',
            gridClickKey: 'row.entity.Id', //primary key that use to edit
            showGridEditButton: true,   //Show Edit Button in grid
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isNew: false,
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'SMS Inbox',
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
            resourceURL: resourceURL, //zSrv_ResourceServer.getURL('eSMSInboxListURL') + $rootScope.MyProfile.Country + "AESMASTER",
            modelResource: null,
            cookieGridState: 'eSMSInboxCtrl_Grid1',
            referenceModelResource: null,
            currentModelReferenceId: '',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            parameters: parameters
        }

        $scope.modalGroup = zSrv_MagnificPopUp;
        var mg = $scope.modalGroup;

        var grp = $scope.group;

        $scope.$on("$routeChangeSuccess", function () {

           $scope.group.gridOptions.parameters = parameters;

            if ($location.path().indexOf("/editeSMSInbox") == 0)
            {
                $scope.group.showGridEditButton = false;
                
            }
            zSrv_InputCustom.routeChangeSuccess($scope.group).then(function () {
                mg.zModal = {};

                //var field = findFieldByName($scope.group.fields, 'Brand');
                //if (field)
                //    field.Disabled = false;
            });

            grp.isLoading = true;
        });

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);

        grp.getModel = function (id) {
            grp.isLoading = true;
            grp.zModel = {};

            grp.modelResource.get({ searchValue: id, user: $rootScope.MyProfile.UserName }).$promise.then(function (data) {
                grp.zModel = data
                grp.isLoading = false;
                grp.getModelAfterSuccess(data);
            }, function (err) {
                console.log(grp.name + ' - getModel event error: ' + err);
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
            });
        }

        grp.replySMS = function (ev) {
            // debugger;
            mg.modalFields = zSrv_InputCustom.formFields({ name: 'eSMSInboxReply' });
            mg.isModalEdit = false;
            mg.modalHeader = 'Reply SMS';
            var view = null;
            mg.zModal = {};
            mg.zModal.Id = grp.zModel.Id;
            mg.zModal.Detail_SNo = grp.zModel.Detail_SNo;
            mg.zModal.Customer = grp.zModel.Customer;
            mg.zModal.Phone_No = grp.zModel.Phone_No;

            mg.showModal($scope, ev, view, false).then(function (answer) {

                if (answer.Contents == "") {
                    mg.show(ev, 'Empty Contents', 'Empty Contents. Unable to reply.')
                }
                else {
                    grp.alerts = [];
                    grp.isLoading = true;

                    //Populate Insert Data
                    answer.Company_ID = grp.zModel.Company_ID;
                    answer.Modem_ID = grp.zModel.Modem_ID;
                    answer.Staff_ID = grp.zModel.Staff_ID;
                    answer.Customer_ID = grp.zModel.Customer_ID;
                    answer.Branch_ID = grp.zModel.Branch_ID;
                    answer.Created_By = $rootScope.MyProfile.UserName;
                    answer.Conn = "AESMASTER";
                    answer.DB = grp.zModel.DB;
                    answer.Modem_ID = grp.zModel.Modem_ID;
                    answer.Detail_SNo = grp.zModel.Detail_SNo;

                    zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('eSMSeApptInboxDetailReplyURL'), answer).then(function (saveStatus) {
                        if (saveStatus.status == "success") {
                            mg.show(ev, 'Reply Successfully', 'Reply to customer successfully.')
                            mg.zModal = {};
                            $window.history.back();
                        }
                    }, function (err) {
                        grp.alerts.push({ type: "danger", msg: err });
                        grp.isLoading = false;
                    });
                }
            }, function () {
            });
        }

        //var findFieldByName = function (options, Name) {
        //    for (i in options) {
        //        if (options[i].Name == Name)
        //            return options[i];
        //    }
        //    return null;
        //}
    }

    zc.$inject = injectParams;

    app.register.controller('eSMSInboxController', zc);


});
