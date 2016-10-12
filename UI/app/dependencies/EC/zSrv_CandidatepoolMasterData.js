'use strict';
//zSrv_MasterData
define(['app'], function (app) {

    var injectParams = ['zSrv_ResourceServer', '$rootScope', 'zSrv_InputCustom'];
    var zs = function (zSrv_ResourceServer,$rootScope, zSrv_InputCustom) {
        //service factory
        var sf = {};

        var data = {};

        var RegionID = $rootScope.MyProfile.Country;

        /// Transaction Masterdata//


        var _loadData_Race = function loadData_Race() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Race" }).then(function (resRace) {
                data.RaceOptions = resRace;
                _loaddata(data.RaceOptions, "Item_Code", "Item_Description");
            });
        }

        var _loadData_Gender = function loadData_Gender() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Gender" }).then(function (resGender) {
                data.GenderOptions = resGender;
                _loaddata(data.GenderOptions, "Item_Code", "Item_Description");
            });
        }

        var _loadData_MaritialStatus = function loadData_MaritialStatus() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Marrital_Status" }).then(function (resMaritialStatus) {
                data.MaritialStatusOptions = resMaritialStatus;
                _loaddata(data.MaritialStatusOptions, "Item_Code", "Item_Description");
            });
        }

        var _loadData_Title = function loadData_Title() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Title" }).then(function (resTitle) {
                data.TitleOptions = resTitle;
                _loaddata(data.TitleOptions, "Item_Code", "Item_Description");
            });
        }

        var _loadData_Nationality = function loadData_Nationality() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Nationality" }).then(function (resNationality) {
                data.NationalityOptions = resNationality;
                _loaddata(data.NationalityOptions, "Item_Code", "Item_Description");
            });
        }

        var _loadData_Source = function loadData_Source() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Source" }).then(function (resSource) {
                data.SourceOptions = resSource;
                _loaddata(data.SourceOptions, "Item_Code", "Item_Description")
            });
        }

        var _loadData_Recruiter = function loadData_Recruiter() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": RegionID, "strType": "1" }).then(function (resRecruiter) {
                data.RecruiterOptions = resRecruiter;
                _loaddata(data.RecruiterOptions, "Employee_ID", "Staff_Name")
            });
        }


        var _loadData_CompanyType = function loadData_CompanyType() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Company_Type" }).then(function (resCompanyType) {
                data.CompanyTypeOptions = resCompanyType;
                _loaddata(data.CompanyTypeOptions, "Item_Code", "Item_Description")
            });
        }

        var _loadData_Location = function loadData_Location() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Location" }).then(function (resLocation) {
                data.LocationOptions = resLocation;
                _loaddata(data.LocationOptions, "Item_Code", "Item_Description")
            });
        }

        var _loadData_RecruitStatus = function loadData_RecruitStatus() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Recruit_Status" }).then(function (resRecruitStatus) {
                data.RecruitStatusOptions = resRecruitStatus;
                _loaddata(data.RecruitStatusOptions, "Item_Code", "Item_Description")
            });
        }

        var _loadData_Referral = function loadData_Referral() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('StaffUrl'), { "strRegionID": RegionID }).then(function (resReferral) {
                data.ReferralOptions = resReferral;
                _loaddata(data.ReferralOptions, "Employee_ID", "Staff_Name")
            });
        }

        var _loadData_RecruitStatus = function loadData_RecruitStatus() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Recruit_Status" }).then(function (resRecruitStatus) {
                data.RecruitStatusOptions = resRecruitStatus;
                _loaddata(data.RecruitStatusOptions, "Item_Code", "Item_Description")
            });
        }

        var _loadData_InterviewStatus = function loadData_InterviewStatus() {
            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('LookupcodeUrl'), { "strRegionID": RegionID, "strCatCode": "Interview_Status" }).then(function (resInterviewStatus) {
                data.InterviewStatusOptions = resInterviewStatus;
                _loaddata(data.InterviewStatusOptions, "Item_Code", "Item_Description")
            });
        }

        /// Transaction Data//

    
        var _loaddata = function (options, Value, Displaymember) {
            for (var key in options) {
                for (var subkey in options[key]) {
                    if (subkey == Value) { options[key].Id = options[key][subkey]; }
                    if (subkey == Displaymember) { options[key].Name = options[key][subkey]; }
                }
            }
        }

        var _loadAllData = function loadAllData() {


            _loadData_Race();
            _loadData_Gender();
            _loadData_MaritialStatus();
            _loadData_Title();
            _loadData_Nationality();

            _loadData_Source();
            _loadData_Recruiter();
            _loadData_CompanyType();
            _loadData_Location();
            _loadData_RecruitStatus();
            _loadData_Referral();
            _loadData_InterviewStatus();
        }
        _loadAllData();

        var _getAllData = function (name) {
            return data;
        }

        sf.loadAllData = _loadAllData;
        sf.getAllData = _getAllData;

        return sf;
    }
    zs.$inject = injectParams;

    app.register.service('zSrv_CandidatepoolMasterData', zs);

});