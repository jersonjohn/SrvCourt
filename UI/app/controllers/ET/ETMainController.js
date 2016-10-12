'use strict';

//cpInterviewController 

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp','zSrv_CandidatepoolMasterData'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_CandidatepoolMasterData) {
        var vm = this;
        $scope.group = {
            name: 'Interview',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'Interview' }),

            parentReferenceField: 'Response_Id',
            parentEditModelURL: '/editResponse',

            createModelURL: '/createInterview',
            editModelURL: '/editInterview',
            listModelURL: '/listInterview',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Interview',
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
            resourceURL: zSrv_ResourceServer.getURL('InterviewUrl'),
            modelResource: null,
            cookieGridState: 'ListInterviewGrid',
            referenceModelResource: null,
            currentModelReferenceId: 'Response_Id',
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
                grp.zData.InterviewByOptions = grp.zData.RecruiterOptions;

                grp.zModel.Name = "";
                grp.zModel.MobileContact = "";
                grp.zModel.JoinedDate = "";
                grp.zModel.ReportedDate ="";
                grp.zModel.Candidate_Id = "";
                grp.LoadCandidate();
             
                grp.Setinterview();

            });

    });

        grp.cloneNewModel = function () {
            zSrv_OAuth2.storeModelInMemory(grp.zModel);
            grp.newModel();
        }

        grp.checkHRIS = function () {

            if ($scope.isHRIS) {
                return true;
            }
            else {
                return false;
            }
        }
        grp.LoadHRIS = function () {
            if (grp.zData.Candidate) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strType": "2", "strNRIC": grp.zData.Candidate.NRIC }).then(function (respdata) {
                    if (respdata && respdata.length > 0) {
                        $scope.isHRIS = true;
                    }
                });
            }
        }

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
                if (options[i].Name == Item_Code)
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

        grp.Setinterview = function () {

            if (grp.isNew) {

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('InterviewUrl'), { "referId": grp.zModel.Response_Id }).then(function (respdata) {
                    if (respdata && respdata.length > 0) {
                        var res = respdata[0].InterviewType.split("#");
                        var interview = parseInt(res[1]) + 1;
                        console.log(interview.toString());
                        grp.zModel.InterviewType = "Inteview#" + interview.toString();
                    }
                    else {
                        grp.zModel.InterviewType = "Inteview#1";
                    }
                });
            }
        }

        grp.PostHRIS = function () {
           
            if (grp.zModel.Candidate_Id) {

                var StaffModel=[];

                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('StaffUrl') + "/" + grp.zModel.Id, StaffModel).then(function (respdata) {

                    grp.alerts.push({ type: 'success', msg: 'Candidate data Posted successfully.' });
                    grp.isLoading = true;
                    grp.LoadHRIS();

                }, function (err) {
                    grp.alerts.push({ type: "danger", msg: err });
                    grp.isLoading = false;
                });
            }
        }

        grp.LoadCandidate = function () {
         

            if (grp.zModel.Response_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('ResponseUrl'), { "strId": grp.zModel.Response_Id, "strRegionID": $rootScope.MyProfile.Country }).then(function (respdata) {
                 
                    grp.zData.Response = respdata;
                    grp.zModel.Candidate_Id = grp.zData.Response[0].Candidate_Id;

                    if (grp.zModel.Candidate_Id) {


                        zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl') + "/" + grp.zModel.Candidate_Id).then(function (respdata) {
                            grp.zData.Candidate = respdata;
                            grp.zModel.Name = grp.zData.Candidate.Name;
                            grp.zModel.MobileContact = grp.zData.Candidate.MobileContact;
                            grp.zModel.JoinedDate = grp.zData.Candidate.JoinedDate;
                            grp.zModel.ReportedDate = grp.zData.Candidate.ReportedDate;

                            grp.LoadHRIS();

                        });
                    }

                });
              
            }

        }

    
      
        grp.InterviewStatus_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.InterviewStatusOptions, grp.zModel.InterviewStatus);
            if (rec) grp.zModel.InterviewStatus = rec.Id;

            if (grp.zModel.InterviewStatus == "Hired") {
                return true;
            }
            else {
                return false;
            }
        }
      
        grp.InterviewStatus = function () {
            if (grp.zModel.InterviewStatus == "Hired") {
                return true;
            }
            else {
                return false;
            }
        }
     
        grp.InterviewBy_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.InterviewByOptions, grp.zModel.InterviewBy);
            if (rec) grp.zModel.InterviewBy = rec.Id;
        }

        grp.createModelAfterSuccess = function (data) {

            grp.zModel.ReportedDate = $("#ReportedDate").val();
            grp.zModel.JoinedDate = $("#JoinedDate").val();

            if (data.InterviewStatus == "Hired" && grp.zModel.JoinedDate != null && grp.zModel.ReportedDate != null) {
                grp.UpdateCandidate(data.JoinedDate, data.ReportedDate);
            }
        }
        grp.updateModelAfterSuccess = function (data) {

            grp.zModel.ReportedDate = $("#ReportedDate").val();
            grp.zModel.JoinedDate = $("#JoinedDate").val();

            if (data.InterviewStatus == "Hired" && grp.zModel.JoinedDate != null && grp.zModel.ReportedDate != null) {
                grp.UpdateCandidate(data.JoinedDate, data.ReportedDate);
            }
        }

     
        grp.UpdateCandidate = function (JoinedDate, ReportedDate) {

            console.log(JSON.stringify(grp.zData.Candidate));

            if (grp.zModel.Candidate_Id) {

                if (grp.zData.Candidate) {

                    grp.zData.Candidate.ReportedDate = moment(JoinedDate).format("DD-MM-YYYY");
                    grp.zData.Candidate.JoinedDate = moment(ReportedDate).format("DD-MM-YYYY");

                    zSrv_InputCustom.httpPut(zSrv_ResourceServer.getURL('CandidateUrl') + "/" + grp.zModel.Candidate_Id, grp.zData.Candidate).then(function (respdata) {
                        grp.alerts.push({ type: 'success', msg: 'Candidate data Saved successfully.' });
                        grp.isLoading = true;
                    });

                }
            }

        }

        grp.getModelAfterSuccess = function (data) {

            grp.LoadCandidate();
        }

    };

    zc.$inject = injectParams;

    app.register.controller('InterviewController', zc);


});

