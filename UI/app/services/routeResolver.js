'use strict';

define([], function () {

    var routeResolver = function () {

        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            //set to "" for development; otherwise set to http://app.amesunited.com to production site
            var hostUrl = "http://app.amesunited.com/";

            var viewsDirectory = hostUrl + 'Scripts/app/views/',
                controllersDirectory = hostUrl + 'Scripts/app/controllers/',
                dependentsDirectory = hostUrl + 'Scripts/app/dependencies/',

            setBaseDirectories = function (viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            },

            getViewsDirectory = function () {
                return viewsDirectory;
            },

            getControllersDirectory = function () {
                return controllersDirectory;
            },

            getDependentsDirectory = function () {
                return dependentsDirectory;
            };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getDependentsDirectory: getDependentsDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function (routeConfig) {
            var version = "?vi=" + (new Date()).getTime();
            var resolve = function (baseName, path, controllerAs, viewTemplate, dependents, secure) {
                if (!path) path = '';

                var routeDef = {};
                var baseFileName = baseName.charAt(0).toLowerCase() + baseName.substr(1);
                //routeDef.templateUrl = routeConfig.getViewsDirectory() + path + baseFileName + '.html';
                viewTemplate = viewTemplate || 'zView1.html';
                if (viewTemplate.indexOf("zView1.html") >= 0)
                    viewTemplate = 'zView1.html';
                else
                    viewTemplate = path + viewTemplate;
                routeDef.templateUrl = routeConfig.getViewsDirectory() + viewTemplate + version;
                //if (angular.isBoolean(viewTemplate) == true)
                //    if (viewTemplate == true)
                //        routeDef.templateUrl = routeConfig.getViewsDirectory() + path + baseFileName + '.html'

                routeDef.controller = baseName + 'Controller';
                if (controllerAs) routeDef.controllerAs = controllerAs;
                routeDef.secure = secure || false;
                routeDef.resolve = {
                    
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [routeConfig.getControllersDirectory() + path + baseFileName + 'Controller.js'];
                        if (dependents != undefined)
                        {
                            var dep = dependents.split(',');
                            var dep_folder = routeConfig.getDependentsDirectory();
                            for (var d in dep)
                            {
                                dependencies.push(dep_folder + path + dep[d].replace(/^\s+|\s+$/gm,'') + '.js');
                            }
                        }
                        return resolveDependencies($q, $rootScope, dependencies);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function () {
                    defer.resolve();
                    $rootScope.$apply()
                });

                return defer.promise;
            };

            return {
                resolve: resolve
            }
        }(this.routeConfig);

    };

    var servicesApp = angular.module('routeResolverServices', []);
    servicesApp.service('routeResolver', routeResolver);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', routeResolver);
});