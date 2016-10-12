'use strict';

//cpInterviewController 

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp) {
        var vm = this;
        $scope.group = {
            name: 'CandidateInterview',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'CandidateInterview' }),

            parentReferenceField: 'Response_Id',
            parentEditModelURL: '/editCandidateResponse',

            createModelURL: '/createCandidateInterview',
            editModelURL: '/editCandidateInterview',
            listModelURL: '/listCandidateInterview',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Candidate Interview',
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
            cookieGridState: 'ListCandidateInterviewGrid',
            referenceModelResource: null,
            currentModelReferenceId: null,
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
                grp.zModel.Name = "";
                grp.LoadCandidateList()
                grp.LoadCandidate()
                grp.LoadResponse()

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Interview_Type" }).then(function (respdata) {
                    grp.zData.InterviewtypeOptions = respdata;
                    grp.Loaddata(grp.zData.InterviewtypeOptions, "Item_Code", "Item_Description")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strType": "1" }).then(function (respdata) {
                    grp.zData.InterviewByOptions = respdata;
                    grp.Loaddata(grp.zData.InterviewByOptions, "Employee_ID", "Staff_Name")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Interview_Status" }).then(function (respdata) {
                    grp.zData.InterviewStatusOptions = respdata;
                    grp.Loaddata(grp.zData.InterviewStatusOptions, "Item_Code", "Item_Description")
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

        grp.LoadCandidate = function () {
            if (grp.zModel.Candidate_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl'), { "referId": grp.zModel.Candidate_Id }).then(function (respdata) {
                    grp.zData.Candidate = respdata;
                    grp.zModel.Name = grp.zData.Candidate[0].Name
                    grp.zModel.MobileContact = grp.zData.Candidate[0].MobileContact
                    grp.zModel.JoinedDate = grp.zData.Candidate[0].JoinedDate
                    grp.zModel.ReportedDate = grp.zData.Candidate[0].ReportedDate
                });
            }
        }
        grp.LoadResponse = function () {

            if (grp.zModel.Response_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('ResponseUrl'), { "strId": grp.zModel.Response_Id }).then(function (respdata) {
                    grp.zData.Response = respdata;
                    grp.zModel.Name = grp.zData.Response[0].Name
                    grp.zModel.Candidate_Id = grp.zData.Response[0].Candidate_Id
                    grp.zModel.MobileContact = grp.zData.Response[0].MobileContact

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
        grp.InterviewType_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.InterviewtypeOptions, grp.zModel.InterviewType);
            if (rec) grp.zModel.InterviewType = rec.Id;
        }
        grp.InterviewBy_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.InterviewByOptions, grp.zModel.InterviewBy);
            if (rec) grp.zModel.InterviewBy = rec.Id;
        }

        grp.LoadCandidateList = function () {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl'), {}).then(function (respdata) {
                grp.zData.CandidateOptions = respdata;
            });
        }
        grp.Candidate_OnChange = function () {
            if (grp.zModel.Candidate_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('ResponseUrl'), { "referId": grp.zModel.Candidate_Id }).then(function (respdata) {
                    grp.zData.ResponseOptions = respdata;
                    for (var n in grp.zData.ResponseOptions) {
                        grp.zData.ResponseOptions[n].Id = grp.zData.ResponseOptions[n].Id;
                        grp.zData.ResponseOptions[n].Name = moment(grp.zData.ResponseOptions[n].ResponseDate).format("DD-MM-YYYY");
                    }
                });
            }
        }
        grp.Response_OnChange = function () {
            var rec = findRecordById(grp.zData.ResponseOptions, grp.zModel.Response_Id);
            if (rec) {
                grp.zModel.ResponseDate = rec.Name;
                grp.zModel.Response_Id = rec.Id;
            }
        }

        grp.createModelAfterSuccess = function () {

            if (grp.zModel.InterviewStatus == "Hired") {
                if (grp.zModel.JoinedDate != null && grp.zModel.ReportedDate != null) {
                    grp.UpdateCandidate(grp.zModel.JoinedDate, grp.zModel.ReportedDate);
                }
                else {
                    grp.alerts.push({ type: "warning", msg: "Hired data not saved" })
                    return;
                }

            }

        }
        grp.updateModelAfterSuccess = function () {

            if (grp.zModel.InterviewStatus == "Hired") {
                if (grp.zModel.JoinedDate != null && grp.zModel.ReportedDate != null) {
                    grp.UpdateCandidate(grp.zModel.JoinedDate, grp.zModel.ReportedDate);
                }
                else {
                    grp.alerts.push({ type: "warning", msg: "Hired data not saved" })
                    return;
                }

            }
        }


        grp.UpdateCandidate = function (JoinedDate, ReportedDate) {


            if (grp.zData.Candidate) {

                grp.zData.Candidate[0].JoinedDate = JoinedDate;
                grp.zData.Candidate[0].ReportedDate = ReportedDate;

                zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('CandidateUrl'), grp.zData.Candidate[0]).then(function () {
                    grp.alerts.push({ type: 'success', msg: 'Hired data saved successfully.' });
                    grp.isLoading = false;
                    grp.LoadReferral();
                }, function (err) {
                    grp.alerts.push({ type: "danger", msg: err });
                    grp.isLoading = false;
                });
            }

        }


        grp.getModelAfterSuccess = function () {

            grp.LoadCandidateList()
            grp.LoadCandidate()
            grp.LoadResponse()

        }



    };

    zc.$inject = injectParams;

    app.register.controller('CandidateInterviewController', zc);


});

