angular.module("zApp_Config", [])

.service("zApp_Config", ['$http', '$window',
    function ($http, $window) {
        var serviceFactory = {};

        var _Client = {
                        BaseUri: "http://localhost/",
            LogInUri: "http://localhost/",
            CookieStoreUri: "http://localhost/",
            LoginUserId: "",   //set as default for testing purposes hence don't need to keep in this.
            LoginUserPassword: ""
        };

        var _AccessPermit = "AccessPermit";

        var _OAuth2 = {

            BaseUri: 'http://oauth.amesunited.com/',
            clientId: 'ngAuthApp'
        };

        var _TestResourceServer = [
        ]

        serviceFactory.Client = _Client;
        serviceFactory.AccessPermit = _AccessPermit;
        serviceFactory.TestResourceServer = _TestResourceServer;
        serviceFactory.OAuth2 = _OAuth2;

        return serviceFactory;
    }]);