'use strict';

//CandidateController

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp','zSrv_zNotify','zSrv_CandidatepoolMasterData'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_zNotify, zSrv_CandidatepoolMasterData) {
        var vm = this;
        $scope.group = {
            name: 'Candidate',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'Candidate' }),

            gridDetailColumnFields2: zSrv_InputCustom.formFields({ name: 'Response' }),
            gridDetailResourceURL2: zSrv_ResourceServer.getURL('ResponseUrl'),
            editDetailModelURL2: 'editResponse',
            createDetailModelURL2: 'createResponse',


            gridResourceURL: zSrv_ResourceServer.getURL('CandidateUrl'),
            parentReferenceField: 'Candidate_Id',
            createModelURL: '/createCandidate',
            editModelURL: '/editCandidate',
            listModelURL: '/listCandidate',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Candidate',
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
            resourceURL: zSrv_ResourceServer.getURL('CandidateUrl'),
            modelResource: null,
            cookieGridState: 'ListCandidateGrid',
            referenceModelResource: null,
            currentModelReferenceId: 'Candidate_Id',
            referenceId: null,
            addCollectionModelURL: null,
            listCollectionModelURL: null,
            indexKey: 'Id',
            newModel: null,
            zData: {}
        }

        $scope.group = zSrv_InputCustom.startInitialise($scope.group);
        var grp = $scope.group;
        grp.routeChangeCompleted = function () {


        };

        $scope.$on("$routeChangeSuccess", function () {
            var promise = zSrv_InputCustom.routeChangeSuccess($scope.group);
            promise.then(function () {

                grp.zData = zSrv_CandidatepoolMasterData.getAllData();

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl'), {}).then(function (resCandidate) {
                    grp.zData.CandidateOptions = resCandidate;
                });

            });
        });

        grp.Loaddata = function (options, Value, Displaymember) {
            for (var key in options) {
                for (var subkey in options[key]) {
                    if (subkey == Value) { options[key].Id = options[key][subkey]; }
                    if (subkey == Displaymember) { options[key].Name = options[key][subkey]; }
                }
            }
        }
        grp.findRecordByCode = function (options, Item_Code) {
            for (i in options) {
                if (options[i].Item_Code == Item_Code)
                    return options[i];
            }
            return null;
        }
        grp.findRecordById = function (options, id) {
            for (i in options) {
                if (options[i].Id == id)
                    return options[i];
            }
            return null;
        }

        grp.newResponseDetailModel = function () {
            zSrv_OAuth2.storeInMemory('CandidateModel', grp.zModel);
            grp.ngLocation.path(grp.createDetailModelURL2 + "/" + grp.referenceId);
        }
        grp.EditResponseDetailModel = function () {
            zSrv_OAuth2.storeInMemory('CandidateModel', grp.zModel);
            grp.ngLocation.path(grp.editDetailModelURL2 + "/" + grp.referenceId);
        }

        grp.CandidateRace_OnChange = function () {
            var rec = grp.findRecordByCode(grp.zData.RaceOptions, grp.zModel.Race);
            if (rec) grp.zModel.Race = rec.Item_Code;
        }
        grp.CandidateMaritialStatus_OnChange = function () {
            var rec = grp.findRecordByCode(grp.zData.MaritialStatusOptions, grp.zModel.MaritialStatus);
            if (rec) grp.zModel.MaritialStatus = rec.Item_Code;
        }

        grp.CandidateGender_OnChange = function () {
            var rec = grp.findRecordByCode(grp.zData.GenderOptions, grp.zModel.Gender);
            if (rec) grp.zModel.Gender = rec.Item_Code;
        }

        grp.CandidateTitle_OnChange = function () {
            var rec = grp.findRecordByCode(grp.zData.TitleOptions, grp.zModel.Title);
            if (rec) grp.zModel.Title = rec.Item_Code;
        }

        grp.CandidateNationality_OnChange = function () {
            var rec = grp.findRecordByCode(grp.zData.NationalityOptions, grp.zModel.Nationality);
            if (rec) grp.zModel.Nationality = rec.Item_Code;
        }

        grp.NRIC_OnChange = function (newvalue) {         
           
            if (grp.zData.CandidateOptions) {
                var options = grp.zData.CandidateOptions;
                for (i in options) {
                    if (options[i].Id != grp.zModel.Id)
                    {
                        if (options[i].NRIC.toUpperCase() == newvalue.toUpperCase()) {
                            grp.alerts.push({ type: "warning", msg: "NRIC Exist already.." })
                            return false;
                        }
                    }
                   
                }
                return true;
            }
            else {
                return true;
            }

        }

        grp.getModelAfterSuccess = function () {

            if (grp.zModel.HomeContact) {
                grp.zModel.HomeContact = parseInt(grp.zModel.HomeContact);
            }

            if (grp.zModel.MobileContact) {
                grp.zModel.MobileContact = parseInt(grp.zModel.MobileContact);
            }
        }


    }

    zc.$inject = injectParams;

    app.register.controller('CandidateController', zc);


});

