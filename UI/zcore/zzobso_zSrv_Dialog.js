angular.module("zSrv_Dialog", ["ngMaterial"])

.service("zSrv_Dialog", ['$document', '$q', '$mdDialog', '$mdMedia',
function ($document, $q, $mdDialog, $mdMedia) {
    var status = '  ';
    var customFullscreen = $mdMedia('sm');

    //service factory
    var sf = {};

    var _modalHide = function () {
        $mdDialog.hide();
    };

    var _modalCancel = function () {
        $mdDialog.cancel();
    };
    
    var _modalAnswer = function (answer) {
        $mdDialog.hide(answer);
    };

    var _show = function (ev, title, content) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element($document.body))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(content)
            .ariaLabel(title)
            .ok('Ok')
            .targetEvent(ev)
        );
    };

    var _showConfirm = function (ev, title, content) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title(title)
              .textContent(content)
              .ariaLabel(title)
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');

        var deferred = $q.defer();
        $mdDialog.show(confirm).then(function () {
            deferred.resolve();
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    var _showModal = function (scope, ev, view, clickOutsideToClose) {
        var deferred = $q.defer();
        //if (!controller)
        //    controller = 'group.ModalController';
        if (!view)
            view = '/Templates/OA2/zModalView.html';
        $mdDialog.show({
            controller: function () { this.parent = scope; },
            controllerAs: 'ctrl',
            templateUrl: view,
            //parent: angular.element($document.body),
            targetEvent: ev,
            clickOutsideToClose: clickOutsideToClose
        })
            .then(function (answer) {
                deferred.resolve(answer);
                //$scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                deferred.reject();
                //$scope.status = 'You cancelled the dialog.';
            });
        return deferred.promise;
    };



    sf.show = _show;
    sf.showConfirm = _showConfirm;
    sf.showModal = _showModal;

    sf.modalHide = _modalHide;
    sf.modalAnswer = _modalAnswer;
    sf.modalCancel = _modalCancel;

    return sf;
}]);
