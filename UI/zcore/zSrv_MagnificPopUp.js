/// <reference path="C:\Develop\ibudgetapi\iBudgetApi\iBudgetApi\Templates/OA2/zModalView_MagnificPopUp.html" />
/// <reference path="C:\Develop\ibudgetapi\iBudgetApi\iBudgetApi\Templates/OA2/zModalView_MagnificPopUp.html" />
angular.module("zSrv_MagnificPopUp", [])
.service("zSrv_MagnificPopUp", ['$q', '$compile', '$rootScope', '$document', '$templateRequest', 'zSrv_Field', function ($q, $compile, $rootScope, $document, $templateRequest, zSrv_Field) {

    //service factory
    var sf = {};
    var version = "?vi=" + (new Date()).getTime();
    var magnific = null;

    var _close = function () {
        if (magnific) {
            $.magnificPopup.close();
            magnific = null;
        }
    }
    
    var _show = function (ev, title, content) {
        if (magnific) {
            $.magnificPopup.close();
            magnific = null;
        }
        var elementBody = $document.find('body');
        var mv = angular.element('<div id="modelShowPopUp" class="popup-basic bg-none mfp-with-anim mfp-hide">' +
                                     '<div class="panel">' +
                                       '<div class="panel-heading">' +
                                         '<span class="panel-icon">' +
                                           '<i class="fa fa-pencil"></i>' +
                                         '</span>' +
                                         '<span class="panel-title">' + title + '</span>' +
                                       '</div>' +
                                       '<div class="panel-body">' +
                                         '<span><h6 class="mt5">' + content + '</h6></span>' +
                                       '</div>' +
                                     '</div>');

        var rScope = $rootScope.$new();
        var pLinker = $compile(mv)(rScope);
        elementBody.append(mv);
        var magnific = $.magnificPopup.open({
           // removalDelay: 500,
            items: {
                src: '#modelShowPopUp',
            },
            callbacks: {
                beforeOpen: function (e) {
                    this.st.mainClass = "mfp-with-fade";
                },
                afterClose: function () {
                    mv.remove();
                    rScope.$destroy();
                    magnific = null;
                    console.log('Popup is completely closed');
                },
            }
        });

        
    };

    var _showMustOk = function (ev, title, content) {

        //close the popup if already popup previously
        if (magnific) {
            $.magnificPopup.close();
            magnific = null;
        }
        var elementBody = $document.find('body');

        var mv = angular.element('<div id="modalConfirmPopUp" class="popup-basic bg-none mfp-with-anim mfp-hide">');
        var mv1 = angular.element('<div class="panel">');
        var mv1_1 = angular.element('<div class="panel-heading">').html(
                     '<span class="panel-icon">' +
                        '<i class="fa fa-pencil"></i>' +
                     '</span>' +
                     '<span class="panel-title">' + title + '</span>');

        var mv1_2 = angular.element('<div class="panel-body">').html(
             '<h5>' + content + '</h5>'
            );

        var mv1_3 = angular.element('<div class="panel-footer text-right">');
        var mv1_3_1 = angular.element('<a class="btn btn-primary" type="button" ng-click="ok()">').html('<span class="fa fa-check"></span> OK');
        //var mv1_3_2 = angular.element('<a class="btn btn-primary" type="button" ng-click="cancel()">').html('<span class="fa fa-times"></span> CANCEL');
        var mv1_4 = angular.element('<button title="Close (Esc)" type="button" class="mfp-close">').text('×');

        mv.append(mv1);
        mv1.append(mv1_1);
        mv1.append(mv1_2);
        mv1.append(mv1_3);
        mv1.append(mv1_4);

        mv1_3.append(mv1_3_1);
        //mv1_3.append(mv1_3_2);

        var rScope = $rootScope.$new();
        rScope.ok = function () {
            console.log('Ok button is clicked.');
            rScope.deferred.resolve();
            $.magnificPopup.close();
        }

        //rScope.cancel = function () {
        //    console.log('Cancel button is clicked.');
        //    rScope.deferred.reject();
        //    $.magnificPopup.close();
        //}

        rScope.deferred = $q.defer();

        //var locals = { $scope: rScope };
        //var ctrl = $controller('showConfirmCtrl', {});
        // Yes, ngControllerController is not a typo
        //mv.contents().data('$ngControllerController', ctrl);

        var pLinker = $compile(mv)(rScope);
        //var pElem = pLinker(scope);
        elementBody.append(mv);

        magnific = $.magnificPopup.open({
            // removalDelay: 500,
            modal: true,
            items: {
                src: '#modalConfirmPopUp',
                type: 'inline'
            },
            callbacks: {
                beforeOpen: function (e) {
                    this.st.mainClass = "mfp-fullscale";
                },
                afterClose: function () {
                    mv.remove();
                    rScope.$destroy();
                    magnific = null;
                    //console.log('Popup is completely closed');
                },
                
            }
        });
        
        return rScope.deferred.promise;
    };

    var _showConfirm = function (ev, title, content) {

        //close the popup if already popup previously
        if (magnific) {
            $.magnificPopup.close();
            magnific = null;
        }
        var elementBody = $document.find('body');
     
        var mv = angular.element('<div id="modalConfirmPopUp" class="popup-basic bg-none mfp-with-anim mfp-hide">');
        var mv1 = angular.element('<div class="panel">');
        var mv1_1 = angular.element('<div class="panel-heading">').html(
                     '<span class="panel-icon">' +
                        '<i class="fa fa-pencil"></i>' +
                     '</span>' +
                     '<span class="panel-title">' + title + '</span>');

        var mv1_2 = angular.element('<div class="panel-body">').html(
             '<h5>' + content + '</h5>'
            );

        var mv1_3 = angular.element('<div class="panel-footer text-right">');
        var mv1_3_1 = angular.element('<a class="btn btn-primary" type="button" ng-click="ok()">').html('<span class="fa fa-check"></span> OK');
        var mv1_3_2 = angular.element('<a class="btn btn-primary" type="button" ng-click="cancel()">').html('<span class="fa fa-times"></span> CANCEL');
        var mv1_4 = angular.element('<button title="Close (Esc)" type="button" class="mfp-close">').text('×');

        mv.append(mv1);
        mv1.append(mv1_1);
        mv1.append(mv1_2);
        mv1.append(mv1_3);
        mv1.append(mv1_4);

        mv1_3.append(mv1_3_1);
        mv1_3.append(mv1_3_2);

        var rScope = $rootScope.$new();
        rScope.ok = function () {
            console.log('Ok button is clicked.');
            rScope.deferred.resolve();
            $.magnificPopup.close();
        }

        rScope.cancel = function () {
            console.log('Cancel button is clicked.');
            rScope.deferred.reject();
            $.magnificPopup.close();
        }

        rScope.deferred = $q.defer();

        //var locals = { $scope: rScope };
        //var ctrl = $controller('showConfirmCtrl', {});
            // Yes, ngControllerController is not a typo
        //mv.contents().data('$ngControllerController', ctrl);

        var pLinker = $compile(mv)(rScope);
        //var pElem = pLinker(scope);
        elementBody.append(mv);

        magnific = $.magnificPopup.open({
           // removalDelay: 500,
            items: {
                src: '#modalConfirmPopUp',
                type: 'inline'
            },
            callbacks: {
                beforeOpen: function (e) {
                    this.st.mainClass = "mfp-with-fade";
                },
                afterClose: function () {
                    mv.remove();
                    rScope.$destroy();
                    magnific = null;
                    console.log('Popup is completely closed');
                },
                elementParse: function (item) {
                    // Function will fire for each target element
                    // "item.el" is a target DOM element (if present)
                    // "item.src" is a source that you may modify
                    //$compile(item.inlineElement)(rScope);
                   // console.log('Parsing content. Item object that is being parsed:', item);
                },
            }
        });

        //$compile(m.items.src[0])(scope);
        //$mdDialog.show(confirm).then(function () {
        //    deferred.resolve();
        //}, function () {
        //    deferred.reject();
        //});
        return rScope.deferred.promise;
    };

    var _showModal = function (rScope, ev, view, isModal, mainClass, focusId) {
        var mg = rScope.modalGroup;

        if (magnific) {
            $.magnificPopup.close();
            magnific = null;
        }
        if (!view)
            view = '/Templates/OA2/zModalView_MagnificPopUp.html';

        view = view + version;

        //var rScope = $rootScope.$new();
        mg.modalAnswer = function (answer) {
            console.log('Ok button is clicked.');
            rScope.deferred.resolve(answer);
            $.magnificPopup.close();
        }

        mg.modalCancel = function () {
            console.log('Cancel button is clicked.');
            rScope.deferred.reject();
            $.magnificPopup.close();
        }

        rScope.deferred = null;
        rScope.deferred = $q.defer();

        //get modalFields data
        var fieldElements = mg.modalFields || null;
        if (fieldElements != null)
            mg.modalFields = [];

        zSrv_Field.getFormFields(fieldElements).then(function (d) {
            if (d)
                mg.modalFields = d;
            //var mv = $templateCache.get(view);
            $templateRequest(view).then(function (template) {
                var mv = angular.element(template);
                //$compile($("#my-element").html(template).contents())($scope);
                var pLinker = $compile(mv)(rScope);
                var elementBody = $document.find('body');
                elementBody.append(mv);

                magnific = $.magnificPopup.open({
                    //removalDelay: 500,
                    modal: isModal,
                    focus: focusId ? '#' + focusId : 'username',
                    items: {
                        src: '#modalPopUp',
                        type: 'inline'
                    },
                    callbacks: {
                        beforeOpen: function (e) {
                            this.st.mainClass = mainClass;
                        },
                        afterClose: function () {
                            mv.remove();
                            magnific = null;
                            //rScope.$destroy();
                            //delete rScope.magnific;
                            console.log('Popup is completely closed');
                        },
                        elementParse: function (item) {
                            // Function will fire for each target element
                            // "item.el" is a target DOM element (if present)
                            // "item.src" is a source that you may modify
                            //$compile(item.inlineElement)(rScope);
                           // console.log('Parsing content. Item object that is being parsed:', this);
                        },
                    }
                });
            }, function () {
                // An error has occurred
            });
        });
        return rScope.deferred.promise;
    };



    sf.show = _show;
    sf.showMustOk = _showMustOk;
    sf.showConfirm = _showConfirm;
    sf.showModal = _showModal;
    sf.close = _close;

    return sf;
}]);
