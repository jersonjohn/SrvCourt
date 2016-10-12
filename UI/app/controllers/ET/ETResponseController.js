'use strict';

//cpResponseController 

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp) {
        var vm = this;
        $scope.group = {
            name: 'CandidateResponse',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'CandidateResponse' }),

            gridDetailColumnFields1: zSrv_InputCustom.formFields({ name: 'CandidateInterview' }),
            gridDetailResourceURL1: zSrv_ResourceServer.getURL('InterviewUrl'),
            editDetailModelURL1: 'editCandidateInterview',
            createDetailModelURL1: 'createCandidateInterview',

            createModelURL: '/createCandidateResponse',
            editModelURL: '/editCandidateResponse',
            listModelURL: '/listCandidateResponse',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Candidate Response',
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
            resourceURL: zSrv_ResourceServer.getURL('ResponseUrl'),
            modelResource: null,
            cookieGridState: 'ListCandidateResponseGrid',
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

                grp.zData.ReferralId = 0;
                grp.zData.Response_Id = 0;
                grp.zData.ReferralName = "";
                grp.zData.ReferralCompanyType = "";
                grp.zData.ReferralCompanyCode = "";
                grp.zData.ReferralBranchCode = "";

                grp.LoadReferralList()
                grp.LoadCandidateList()

                grp.LoadCandidate()
                grp.LoadReferral()

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Source" }).then(function (respdata) {
                    grp.zData.SourceOptions = respdata;
                    grp.Loaddata(grp.zData.SourceOptions, "Item_Code", "Item_Description")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Company_Type" }).then(function (respdata) {
                    grp.zData.CompanyTypeOptions = respdata;
                    grp.zData.ReferralCompanyTypeOptions = respdata;
                    grp.Loaddata(grp.zData.CompanyTypeOptions, "Item_Code", "Item_Description")
                    grp.Loaddata(grp.zData.ReferralCompanyTypeOptions, "Item_Code", "Item_Description")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strType": "1" }).then(function (respdata) {
                    grp.zData.RecruiterOptions = respdata;
                    grp.Loaddata(grp.zData.RecruiterOptions, "Employee_ID", "Staff_Name")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Location" }).then(function (respdata) {
                    grp.zData.LocationOptions = respdata;
                    grp.Loaddata(grp.zData.LocationOptions, "Item_Code", "Item_Description")
                });


                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCatCode": "Recruit_Status" }).then(function (respdata) {
                    grp.zData.RecruitStatusOptions = respdata;
                    grp.Loaddata(grp.zData.RecruitStatusOptions, "Item_Code", "Item_Description")
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

        grp.newInterviewDetailModel = function () {
            zSrv_OAuth2.storeInMemory('responseModel', grp.zModel);
            grp.ngLocation.path(grp.createDetailModelURL1 + "/" + grp.referenceId);
        }

        grp.EditInterviewDetailModel = function () {
            zSrv_OAuth2.storeInMemory('responseModel', grp.zModel);
            grp.ngLocation.path(grp.editDetailModelURL1 + "/" + grp.referenceId);
        }
        grp.Candidate_OnChange = function () {
        }

        grp.Source_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.SourceOptions, grp.zModel.Source);
            if (rec) grp.zModel.Source = rec.Id;
            if (grp.zModel.Source == "Referral") {

                return true;
            }
            else {
                return false;
            }
        }
        grp.CompanyType_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.CompanyTypeOptions, grp.zModel.CompanyType);
            if (rec) grp.zModel.CompanyType = rec.Id;
            grp.CompanyType();
        }
        grp.Company_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.CompanyOptions, grp.zModel.CompanyCode);
            if (rec) grp.zModel.CompanyCode = rec.Id;
            grp.Company();
        }

        grp.Branch_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.BranchOptions, grp.zModel.BranchCode);
            if (rec) grp.zModel.BranchCode = rec.Id;
        }

        grp.JobLevel_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.JobLevelOptions, grp.zModel.JobLevelCode);
            if (rec) grp.zModel.JobLevelCode = rec.Id;
            grp.JobLevel();
        }

        grp.JobLevelDesignation_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.JobLevelDesignationOptions, grp.zModel.JobDesignationCode);
            if (rec) grp.zModel.JobDesignationCode = rec.Id;
        }

        grp.RecruiterIncharge_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.RecruiterOptions, grp.zModel.RecruiterInCharge);
            if (rec) grp.zModel.RecruiterInCharge = rec.Id;
        }
        grp.Referral_OnChange = function () {
            grp.zData.ReferralName = grp.zModel.ReferralName
            var rec = grp.findRecordById(grp.zData.ReferralOptions, grp.zModel.ReferralName);
            if (rec) grp.zModel.ReferralName = rec.Id;
        }
        grp.CurrentLocation_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.LocationOptions, grp.zModel.CurrentLocation);
            if (rec) grp.zModel.CurrentLocation = rec.Id;
        }
        grp.PreferredLocation_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.LocationOptions, grp.zModel.PreferredLocation);
            if (rec) grp.zModel.PreferredLocation = rec.Id;
        }
        grp.ActualLocation_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.LocationOptions, grp.zModel.ActualLocation);
            if (rec) grp.zModel.ActualLocation = rec.Id;
        }
        grp.RecruitStatus_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.RecruitStatusOptions, grp.zModel.RecruitStatus);
            if (rec) grp.zModel.RecruitStatus = rec.Id;
        }

        grp.LoadCandidateList = function () {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl'), {  }).then(function (respdata) {
                    grp.zData.CandidateOptions = respdata;
                });            
        }
        grp.LoadReferralList = function () {
            if (grp.zData.ReferralOptions) {

            }
            else {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": $rootScope.MyProfile.Country }).then(function (respdata) {
                    grp.zData.ReferralOptions = respdata;
                    grp.Loaddata(grp.zData.ReferralOptions, "Employee_ID", "Staff_Name")
                });
            }
        }

        grp.LoadCandidate = function () {
            if (grp.zModel.Candidate_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl'), { "referId": grp.zModel.Candidate_Id }).then(function (respdata) {
                    grp.zData.Candidate = respdata;
                    grp.zModel.Name = grp.zData.Candidate[0].Name
                    grp.zModel.MobileContact = grp.zData.Candidate[0].MobileContact
                });
            }
        }
        grp.LoadReferral = function () {
            if (grp.zModel.Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('ReferralUrl'), { "referId": grp.zModel.Id }).then(function (respdata) {
                    grp.zData.Referral = respdata;
                    if (respdata && respdata.length > 0) {
                        grp.zModel.ReferralId = grp.zData.ReferralId = grp.zData.Referral[0].ReferralId;
                        grp.zModel.Response_Id = grp.zData.Response_Id = grp.zData.Referral[0].Response_Id;
                        grp.zModel.ReferralName = grp.zData.ReferralName = grp.zData.Referral[0].ReferralName;
                        grp.zModel.ReferralCompanyType = grp.zData.ReferralCompanyType = grp.zData.Referral[0].ReferralCompanyType;
                        grp.zModel.ReferralCompanyCode = grp.zData.ReferralCompanyCode = grp.zData.Referral[0].ReferralCompanyCode;
                        grp.zModel.ReferralBranchCode = grp.zData.ReferralBranchCode = grp.zData.Referral[0].ReferralBranchCode;
                        grp.ReferralCompanyType();
                        grp.ReferralCompany();
                    }
                    else {
                        grp.zModel.ReferralId = grp.zData.ReferralId = 0
                    }
                });
            }
        }

        grp.CompanyType = function () {
            if (grp.zModel.CompanyType) {

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CompanyUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCompanyTypeID": grp.zModel.CompanyType }).then(function (respdata) {
                    grp.zData.CompanyOptions = respdata;
                    grp.Loaddata(grp.zData.CompanyOptions, "Company_ID", "Company_Reg_Name")
                });

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('JoblevelUrl'), { "strJoblevelType": grp.zModel.CompanyType }).then(function (respdata) {
                    grp.zData.JobLevelOptions = respdata;
                    grp.Loaddata(grp.zData.JobLevelOptions, "Job_Level_ID", "Job_Level_Description")
                });

            }
        }
        grp.Company = function () {
            if (grp.zModel.CompanyCode) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('BranchUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCompanyID": grp.zModel.CompanyCode }).then(function (respdata) {
                    grp.zData.BranchOptions = respdata;
                    grp.Loaddata(grp.zData.BranchOptions, "Branch_ID", "Branch_ID")
                });
            }
        }
        grp.JobLevel = function () {
            if (grp.zModel.JobLevelCode) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('JobdesignationUrl'), { "strJobLevelID": grp.zModel.JobLevelCode }).then(function (respdata) {
                    grp.zData.JobLevelDesignationOptions = respdata;
                    grp.Loaddata(grp.zData.JobLevelDesignationOptions, "Designation_ID", "Job_Level_Designation")
                });
            }
        }


        //Referral

        grp.ReferralCompanyType_OnChange = function () {
            grp.zData.ReferralCompanyType = grp.zModel.ReferralCompanyType
            var rec = grp.findRecordById(grp.zData.ReferralCompanyTypeOptions, grp.zModel.ReferralCompanyType);
            if (rec) grp.zModel.ReferralCompanyType = rec.Id;
            grp.ReferralCompanyType()
        }

        grp.ReferralCompany_OnChange = function () {
            grp.zData.ReferralCompanyCode = grp.zModel.ReferralCompanyCode
            var rec = grp.findRecordById(grp.zData.ReferralCompanyOptions, grp.zModel.ReferralCompanyCode);
            if (rec) grp.zModel.ReferralCompanyCode = rec.Id;
            grp.ReferralCompany()
        }
        grp.ReferralBranch_OnChange = function () {
            grp.zData.ReferralBranchCode = grp.zModel.ReferralBranchCode
            var rec = grp.findRecordById(grp.zData.ReferralBranchOptions, grp.zModel.ReferralBranchCode);
            if (rec) grp.zModel.ReferralBranchCode = rec.Id;
        }

        grp.ReferralCompanyType = function () {
            if (grp.zModel.ReferralCompanyType) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CompanyUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCompanyTypeID": grp.zModel.ReferralCompanyType }).then(function (respdata) {
                    grp.zData.ReferralCompanyOptions = respdata;
                    grp.Loaddata(grp.zData.ReferralCompanyOptions, "Company_ID", "Company_Reg_Name")
                });

            }
        }
        grp.ReferralCompany = function () {
            if (grp.zModel.ReferralCompanyCode) {

                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('BranchUrl'), { "strRegionID": $rootScope.MyProfile.Country, "strCompanyID": grp.zModel.ReferralCompanyCode }).then(function (respdata) {
                    grp.zData.ReferralBranchOptions = respdata;
                    grp.Loaddata(grp.zData.ReferralBranchOptions, "Branch_ID", "Branch_ID")
                });

            }
        }


        grp.updateModelAfterSuccess = function () {
            if (grp.zModel.Source == "Referral") {
                if (grp.zData.ReferralName != null && grp.zData.ReferralCompanyType != null) {
                    grp.UpdateReferral();
                }

            }
        }
        grp.createModelAfterSuccess = function () {
            grp.zData.ReferralId = 0
            if (grp.zModel.Source == "Referral") {
                if (grp.zData.ReferralName != null && grp.zData.ReferralCompanyType != null) {
                    grp.UpdateReferral();
                }
            }
        }


        grp.UpdateReferral = function () {

            var ReferralObj = { "Id": grp.zData.ReferralId, "Response_Id": grp.zModel.Id, "Name": grp.zData.ReferralName, "CompanyType": grp.zData.ReferralCompanyType, "CompanyCode": grp.zData.ReferralCompanyCode, "BranchCode": grp.zData.ReferralBranchCode };

            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('ReferralUrl'), ReferralObj).then(function () {
                grp.alerts.push({ type: 'success', msg: 'Referral data saved successfully.' });
                grp.refreshPage();
            }, function (err) {
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
            });
        }


        grp.getModelAfterSuccess = function () {

            // grp.LoadReferralList()
            grp.LoadCandidate()
            grp.LoadReferral()

            grp.CompanyType()
            grp.Company()
            grp.JobLevel()

        }



    };

    zc.$inject = injectParams;

    app.register.controller('CandidateResponseController', zc);


});

