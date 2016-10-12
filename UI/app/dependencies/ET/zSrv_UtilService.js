'use strict';
//zSrv_UtilService
//angular.module("zSrv_utilService", [])
//.factory('zSrv_utilService', ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer) {
define(['app'], function (app) {

    var injectParams = ['$http', '$q', 'zSrv_OAuth2', 'zSrv_ResourceServer', 'zSrv_MagnificPopUp'];
    var zs = function ($http, $q, zSrv_OAuth2, zSrv_ResourceServer, zSrv_MagnificPopUp) {
  

    var utilServiceFactory = {};

    

    var  _convertTimeTo24Hour = function (time) {
         var elem = time.split(' ');
                var stSplit = elem[0].split(":");// alert(stSplit);
                var stHour = stSplit[0];
                var stMin = stSplit[1];
                var stAmPm = elem[1];
                var newhr = 0;
                var ampm = '';
                var newtime = '';


                if (stAmPm == 'PM') {
                    if (stHour != 12) {
                        stHour = stHour * 1 + 12;
                    }
                    else {
                        stHour = stHour;
                    }
                }
                else
                {
                    if (stHour == 12) stHour = 24;
                }

               
                return stHour + ':' + stMin;
    }


    var _convertTimeTo12Hour = function (time) {
        var stSplit = time.split(":");

        var hours = stSplit[0] > 12 ? stSplit[0] - 12 : stSplit[0];

        var am_pm = stSplit[0] >= 12 ? "PM" : "AM";

        hours = hours < 10 ? "0" + hours : hours;

        var minutes = stSplit[1].length < 2 ? "0" + stSplit[1] : stSplit[1];

      

        time = hours + ":" + minutes + " " + am_pm;

        return time;
    }


    var _showAlert = function (ev, title, message) {
       var mg = zSrv_MagnificPopUp;
       
        mg.show(ev, title, message);
    }
   
    utilServiceFactory.convertTimeTo24Hour = _convertTimeTo24Hour;
    utilServiceFactory.convertTimeTo12Hour = _convertTimeTo12Hour;
    utilServiceFactory.showAlert = _showAlert;
   

    return utilServiceFactory;
    }
    zs.$inject = injectParams;

    app.register.service('zSrv_UtilService', zs);

});