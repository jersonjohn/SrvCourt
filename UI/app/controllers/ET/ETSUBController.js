'use strict';

//cpResponseController 

define(['app'], function (app) {

    var injectParams = ['$scope', '$rootScope', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_InputCustom', 'uiGridConstants', 'zSrv_MagnificPopUp','zSrv_CandidatepoolMasterData'];

    var zc = function ($scope, $rootScope, $resource, $window, $location, $route, $routeParams, zSrv_OAuth2, zSrv_ResourceServer, zSrv_InputCustom, uiGridConstants, zSrv_MagnificPopUp, zSrv_CandidatepoolMasterData) {
        var vm = this;
        $scope.group = {
            name: 'Response',
            gridColumnFields: zSrv_InputCustom.formFields({ name: 'Response' }),

            gridDetailColumnFields1: zSrv_InputCustom.formFields({ name: 'Interview' }),
            gridDetailResourceURL1: zSrv_ResourceServer.getURL('InterviewUrl'),
            editDetailModelURL1: 'editInterview',
            createDetailModelURL1: 'createInterview',

            parentReferenceField: 'Candidate_Id',
            parentEditModelURL: '/editCandidate',

            createModelURL: '/createResponse',
            editModelURL: '/editResponse',
            listModelURL: '/listResponse',
            gridClickKey: 'row.entity.Id',
            showGridEditButton: true,
            canKeyEditDuringCreation: false,
            zModel: {},
            alerts: [],
            isEdit: true,
            isLoading: false,
            cancelButtonName: 'Cancel',
            formHeader: 'Response',
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
            cookieGridState: 'ListResponseGrid',
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
                grp.zData.ReferralCompanyTypeOptions = grp.zData.CompanyTypeOptions;
                grp.zData.CurrentLocation = grp.zData.LocationOptions;
                grp.zData.PreferredLocation = grp.zData.LocationOptions;
                grp.zData.ActualLocation=  grp.zData.LocationOptions;

                grp.ReferralCompanyType = "";
                grp.ReferralCompanyCode = "";
                grp.ReferralBranchCode = "";
                grp.ReferralName = "";
                grp.ReferralId = 0;

                grp.zModel.Name = "";
                grp.zModel.MobileContact = "";

                grp.LoadCandidate();


            });
        });
        grp.cloneNewModel = function () {
            zSrv_OAuth2.storeModelInMemory(grp.zModel);
            grp.newModel();
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
        
        grp.Source_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.SourceOptions, grp.zModel.Source);
            if (rec) grp.zModel.Source = rec.Id;
        }

        grp.Source = function () {
            if (grp.zModel.Source == "Referral") {
                return true;
            }
            else {
                return false;
            }
        }
        grp.Validate=function(){
            if (grp.zModel.Source == "Referral" && grp.zModel.ReferralName != null && grp.zModel.ReferralCompanyType != null) {
                return true;
            }
            else {
                return false;
            }
            console.log("Fired"+ grp.zModel.Source);
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
        
            var rec = grp.findRecordById(grp.zData.ReferralOptions, grp.zModel.ReferralName);
            if (rec) { grp.zModel.ReferralName = rec.Id; grp.ReferralName = rec.Id; };

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

       

        grp.LoadCandidate = function () {
            if (grp.zModel.Candidate_Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('CandidateUrl')+"/"+grp.zModel.Candidate_Id).then(function (respdata) {
                    grp.zData.Candidate = respdata;
                    grp.zModel.Name = grp.zData.Candidate.Name;
                    grp.zModel.MobileContact = grp.zData.Candidate.MobileContact;
                });
            }
        }
        grp.LoadReferral = function () {
            if (grp.zModel.Id) {
                zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('ReferralUrl'), { "referId": grp.zModel.Id }).then(function (respdata) {
                   
                    if (respdata && respdata.length > 0) {

                        grp.zData.Referral = respdata;
                        grp.zModel.ReferralId = grp.zData.ReferralId = grp.zData.Referral[0].ReferralId;
                        grp.zModel.Response_Id = grp.zData.Response_Id = grp.zData.Referral[0].Response_Id;
                        grp.zModel.ReferralName = grp.zData.ReferralName = grp.zData.Referral[0].ReferralName;
                        grp.zModel.ReferralCompanyType = grp.zData.ReferralCompanyType = grp.zData.Referral[0].ReferralCompanyType;
                        grp.zModel.ReferralCompanyCode = grp.zData.ReferralCompanyCode = grp.zData.Referral[0].ReferralCompanyCode;
                        grp.zModel.ReferralBranchCode = grp.zData.ReferralBranchCode = grp.zData.Referral[0].ReferralBranchCode;
                        //grp.LoadReferralList();
                        grp.ReferralCompanyTypeData();
                        grp.ReferralCompany();
                    }
                    else {
                        grp.zModel.ReferralId = grp.zData.ReferralId = 0;
                        grp.zModel.Response_Id = grp.zData.Response_Id = 0;
                        grp.zModel.ReferralName = grp.zData.ReferralName = "";
                        grp.zModel.ReferralCompanyType = grp.zData.ReferralCompanyType = "";
                        grp.zModel.ReferralCompanyCode = grp.zData.ReferralCompanyCode = "";
                        grp.zModel.ReferralBranchCode = grp.zData.ReferralBranchCode = "";
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
                    grp.Loaddata(grp.zData.BranchOptions, "Branch_ID", "Branch_Name")
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
            var rec = grp.findRecordById(grp.zData.ReferralCompanyTypeOptions, grp.zModel.ReferralCompanyType);
            if (rec)
            {
                grp.zModel.ReferralCompanyType = rec.Id;
                grp.ReferralCompanyType = rec.Id;
                grp.ReferralCompanyTypeData();
            }
        }

        grp.ReferralCompany_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.ReferralCompanyOptions, grp.zModel.ReferralCompanyCode);
            if (rec) {
             
                grp.zModel.ReferralCompanyCode = rec.Id;
                grp.ReferralCompanyCode = rec.Id;
                grp.ReferralCompany();
            }
        }

        grp.ReferralBranch_OnChange = function () {
            var rec = grp.findRecordById(grp.zData.ReferralBranchOptions, grp.zModel.ReferralBranchCode);
            if (rec) {
             
                grp.zModel.ReferralBranchCode = rec.Id;
                grp.ReferralBranchCode = rec.Id;
            }
        }

        grp.ReferralCompanyTypeData = function () {
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
                    grp.Loaddata(grp.zData.ReferralBranchOptions, "Branch_ID", "Branch_Name")
                });

            }
        }


        grp.updateModelAfterSuccess = function (data) {
          
            if (data.Source == "Referral" && data.ReferralName != null && data.ReferralCompanyType != null) {
                var ReferralObj = { "Id": data.ReferralId, "Response_Id": data.Id, "Name": data.ReferralName, "CompanyType": data.ReferralCompanyType, "CompanyCode": data.ReferralCompanyCode, "BranchCode": data.ReferralBranchCode };
                grp.UpdateReferral(ReferralObj);
            }
        }
        grp.createModelAfterSuccess = function (data) {
          
            if (data.Source == "Referral" && grp.ReferralName != null && grp.ReferralCompanyType != null) {
                var ReferralObj = { "Id": grp.ReferralId, "Response_Id": data.Id, "Name": grp.ReferralName, "CompanyType": grp.ReferralCompanyType, "CompanyCode": grp.ReferralCompanyCode, "BranchCode": grp.ReferralBranchCode };
                grp.UpdateReferral(ReferralObj);
            }
        }

    
        grp.UpdateReferral = function (ReferralObj) {
          
            zSrv_InputCustom.httpPost(zSrv_ResourceServer.getURL('ReferralUrl'), ReferralObj).then(function () {
                grp.alerts.push({ type: 'success', msg: 'Referral data saved successfully.' });
                grp.isLoading = true;
                grp.refreshPage();
            }, function (err) {
                grp.alerts.push({ type: "danger", msg: err });
                grp.isLoading = false;
            });
        }

        grp.getModelAfterSuccess = function (data) {

            grp.LoadCandidate();
            grp.LoadReferral();

            grp.CompanyType();
            grp.Company();
            grp.JobLevel();

        }



    }

    zc.$inject = injectParams;

    app.register.controller('ResponseController', zc);


});

