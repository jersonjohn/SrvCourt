'use strict';

define(['routeResolver'], function () {
   // var $routeRef = null;  //for dynamically create $routeProvider

    var app = angular.module('amesApp', ["routeResolverServices", 'ui.bootstrap',
        "ngResource", "ngRoute", "zSrv_OAuth2", "zSrv_InputCustom", "zApp_Config", "zMod_OAuth2Intercept", "zDir_PreLoader", "zDir_InputCustom", "zDir_NavBar",
        "zSrv_Field",
        "ui.grid", "ui.grid.edit", "ui.grid.pagination", "ui.grid.exporter", "ui.grid.saveState", "ui.grid.selection", "ui.grid.pinning", "ui.grid.resizeColumns", "ui.grid.moveColumns", "ui.grid.cellNav",
        "zFilter_ArrayToString", "ui.tree", "ng-mfb",
        "ngFileUpload", "ngImgCrop", "zSrv_CookieStore", "zDir_zuiDatePicker", "zDir_zuiMonthPicker", "zDir_zuiDateTimePicker", "zDir_zuiTimePicker",
        "zDir_zuiCheckBox", "zSrv_MagnificPopUp", "zDir_zuiSelectMultiple", "zDir_zFileUpload", "zDir_zImg", "zSrv_ResourceServer", "zSrv_zNotify", "zDir_zTree",
        "zDir_zMFB",  "zDir_zNoDirty", "zDir_zValidate", "zDir_zSelectize", "zDir_ngEnter"
        //"ui.codemirror",

       // "zDir_DailyScheduleTask", "ngDraggable", "zSocket", "zSrv_DataService",
       //"zDir_DailyScheduleBrand",
       // "zDir_DailyScheduleAdmin", "zDir_BootStrapTooltip", //"zDir_ScheduleGrid",
       // "zDir_ContextMenu",
       // "zSrv_MasterData","zSrv_utilService"
        //"zDir_zuiToggleButton"
    ]);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider', '$locationProvider',
                '$sceDelegateProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider, $locationProvider,
                  $sceDelegateProvider) {

            $sceDelegateProvider.resourceUrlWhitelist([
              // Allow same origin resource loads.
              'self',
              // Allow loading from our assets domain.  
              'http://app*.amesunited.com/**']);

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                route: $routeProvider,
                routeResolver: routeResolverProvider
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $locationProvider.html5Mode(true);
            //$routeRef = $routeProvider;

            $httpProvider.interceptors.push('zFtr_OAuth2BearerInject');
            $httpProvider.interceptors.push('zFtr_OAuth2RefreshInject');
            $httpProvider.interceptors.push('zFtr_TimeStampMarker');

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/', route.resolve('main', 'oauth/', 'vm'))
                .when('/forgetPassword', route.resolve('main', 'oauth/', 'vm'))
           //     .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
                .otherwise({ redirectTo: '/' });

        }]);

    app.run(['$route', '$rootScope', '$location',
        function ($route, $rootScope, $location) {

            //function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };
            //$(document).on("keydown", disableF5);

            console.log("**> Absolute Location: " + $location.absUrl());
            var appName = $location.absUrl();
            var appNameStartPos = appName.indexOf('://') + 3;
            var appNameEndPos = appName.indexOf('.');
            if (appNameEndPos < 0 || appNameEndPos > 11) {
                appName = 'app';
                $rootScope.appName = appName;
            } else {
                appName = appName.substring(appNameStartPos, appNameEndPos);
                $rootScope.appName = appName;
            }
            console.log("**> AppName is : " + appName);
            // debugger;
            if($location.search()) {
                $rootScope.thisToken = {
                    'userName': $location.search()['u'],
                    'token': $location.search()['t'],
                    'directURL': $location.search()['r'],
                    'isAuth': true,
                    'useRefreshTokens': false
                }
                $rootScope.MyProfile = {
                    'UserName': $location.search()['u'],
                }
            }
            var myEvent = window.attachEvent || window.addEventListener;
            var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable
            
            myEvent(chkevent, function (e) { // For >=IE7, Chrome, Firefox
                    var confirmationMessage = ' ';  // a space
                    (e || window.event).returnValue = confirmationMessage;
                    return confirmationMessage;
                });
            
            //$window.onbeforeunload = function (e) {
            //    alert('You can need to logout first in order to refresh.');
            //    event.preventDefault();
            //};
                        
            
            //var windowElement = angular.element($window);
            //windowElement.on('beforeunload', function (event) {
            //    alert('You can need to logout first in order to refresh.');
            //    event.preventDefault();
            //});
            
            //app.register.route.when('/forgetPassword', {
            //    templateUrl: '/Scripts/app/views/zView1.html',
            //    controller: 'mainController'
            //});

        }]);

    return app;

});

