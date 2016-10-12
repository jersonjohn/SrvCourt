'use strict';
//eApptDailyAppointmentController
define(['app'], function (app) {

    var injectParams = ['$scope', '$http', '$resource', '$window', '$location', '$route', '$routeParams', 'zSrv_ResourceServer', 'zSrv_InputCustom',
                        'uiGridConstants', 'zSrv_MagnificPopUp', 'zSrv_Field', 'zSrv_OAuth2', 'zSrv_zNotify','$q','$rootScope'];

    var zc = function ($scope, $http, $resource, $window, $location, $route, $routeParams, zSrv_ResourceServer, zSrv_InputCustom,
                        uiGridConstants, zSrv_MagnificPopUp, zSrv_Field, zSrv_OAuth2, zSrv_zNotify,$q,$rootScope) {

    var vm = this;


    $scope.cellId = 0;

    $scope.consultantId = 5;
    $scope.outletId = 3;
    $scope.consultantName = "";

    $scope.outletName = null;

    $scope.brandId = null;
    $scope.brandName = null;
    $scope.brandShortName = null;
    $scope.messages = null;
   
	
    
    $scope.group = {

        formHeader: 'Outlet Daily Appointment - Consultant',
       
        name: 'eApptDailyAppointment',
       

        gridResourceURL: zSrv_ResourceServer.getURL('eApptDailyApptUrl'),
        createModelURL: '/createeApptAppointment',
        //editModelURL: '/editeApptDailyAppointment',
        listModelURL: '/listeApptDailyAppointment',

      

        zModel: {},
        zData: {},
        ngResource: $resource,
        ngLocation: $location,
        ngRouteParams: $routeParams,
        }
		
	
	  
	  
		 


        var grp = $scope.group;

        $scope.$on("$routeChangeSuccess", function () {

            //zSrv_InputCustom.routeChangeSuccess($scope.group);

        });
	  

        $scope.block = false;
        $scope.blockText = "Block";

        $scope.adate = new Date();

        $scope.minDate = new Date(2001,1, 1);
        $scope.today = function () {


            var defer_column = null;
            defer_column = $q.defer();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrConsultantUrl'), { "Name": $rootScope.MyProfile.UserName, "Type": "" }).then(function (respcolumnHeader) {
                $scope.consultantDetails = respcolumnHeader;

                defer_column.resolve();
            });



            if (zSrv_OAuth2.isExistInMemory('currentDay')) {
                $scope.dt = zSrv_OAuth2.restoreInMemory('currentDay');
            }
            else {
                $scope.dt = new Date();
                zSrv_OAuth2.storeInMemory('currentDay',$scope.dt);
            }


          


            if (zSrv_OAuth2.isExistInMemory('currentOutletId')) {
                $scope.outletId = zSrv_OAuth2.restoreInMemory('currentOutletId');
            }

            if (zSrv_OAuth2.isExistInMemory('currentConsultantId')) {
                $scope.consultantId = zSrv_OAuth2.restoreInMemory('currentConsultantId');
            }


            if (zSrv_OAuth2.isExistInMemory('currentConsultantName')) {
                $scope.consultantName = zSrv_OAuth2.restoreInMemory('currentConsultantName');
            }
		  
		    var defer_outlets = null;
            defer_outlets = $q.defer();

            zSrv_InputCustom.httpGet(zSrv_ResourceServer.getURL('eApptMtrOutletUrl')).then(function (respOutlets) {
                $scope.outlets = respOutlets;

                defer_outlets.resolve();
            });


      

            $q.all([defer_column.promise,defer_outlets.promise]).then(function () {
                $scope.consultantId = $scope.consultantDetails[0].ConsultantId;
                $scope.consultantName = $scope.consultantDetails[0].ConsultantName;
                $scope.outletId = $scope.consultantDetails[0].OutletId;
                $scope.outletName = $scope.consultantDetails[0].OutletName;

                $scope.brandId = $scope.consultantDetails[0].BrandId;
                $scope.brandName = $scope.consultantDetails[0].BrandName;
                $scope.brandShortName = $scope.consultantDetails[0].BrandShortName;

                $rootScope.brandId = $scope.brandId;
                $rootScope.brandName = $scope.brandName;
                $rootScope.brandShortName = $scope.brandShortName;

                $rootScope.outletId = $scope.outletId;
                $rootScope.outletName = $scope.outletName;
                $rootScope.consultantId = $scope.consultantId;
            });

            //$scope.dt= new Date(2016, 1, 3);
        };

        $scope.nextDay = function () {
            var newDate = new Date();
            newDate.setDate($scope.dt.getDate() + 1);
            $scope.dt = newDate;
        };

        $scope.prevDay = function () {
            var newDate = new Date();
            newDate.setDate($scope.dt.getDate() -1);
            $scope.dt = newDate;
        };

        $scope.today();

       

        $scope.clear = function() {
            $scope.dt = null;
        };

    // Disable weekend selection
        $scope.disabled = function(date, mode) {
           // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
           

                $scope.popup2.opened = true;
          
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
          [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
          ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
        };

        $scope.changedate = function () {
            
            zSrv_OAuth2.storeInMemory('currentDay', $scope.dt);
            
        };
	    
	        $scope.blockSlot = function () {
            $scope.block = !$scope.block;

            if ($scope.block) {
                $scope.blockText = "Save Block";

            }
            else {
                $scope.blockText = "Block";
                $scope.saveBlock();
            }
            
        };


        $scope.addAppointment = function () {
          var id = 0;
            //alert($scope.group.createModelURL);
            $location.path($scope.group.createModelURL + '/' + id);
        };

    }

    zc.$inject = injectParams;

    app.register.controller('eApptDailyAppointmentController', zc);

});
