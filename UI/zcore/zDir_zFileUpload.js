angular.module("zDir_zFileUpload", [])
.directive("zfileupload", ["$compile", "Upload", function ($compile, Upload) {
    return {
        restrict: 'EA',
        scope: {
            //'uploadView': '@upload-view',
            'uploadUrl': '@uploadUrl',
            'fileReferenceId': '@fileReferenceId',
            'mg': '=model',   //modelGroup
            'onUploadSuccess': '&onuploadSuccess',
            'uploadButtonClass': '@uploadButtonClass',
        },
        link: function (scope, elem, attrs, ctrl) {


            var _uploadFile = function (file) {
                file.progress = 0;
                Upload.upload({
                    url: scope.uploadUrl,  //'/api/IBudget_IssueDetailAttachment',
                    data: {
                        id: scope.fileReferenceId,
                        file: file,
                    },
                    //file: file, // or list of files ($files) for html5 only
                }).progress(function (evt) {
                    file.progress =
                        Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    if (scope.onUploadSuccess) {
                        scope.mg.successResult = {
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                        };
                        scope.onUploadSuccess();
                    }
                    //mg.zModalAttachment.unshift(data);
                    //grp.ImageCount = Number(grp.ImageCount) + 1;
                }).error(function (err) {
                    file.result = err;
                });
            }

            scope.uploadFiles = function ($files) {
                scope.mg.files = $files;
                for (var i = 0; i < $files.length; i++) {
                    _uploadFile($files[i]);
                }
            };

            //grp.newFileUpload = function (ev) {
            //    mg.modalHeader = 'Upload File';
            //    var view = "/Templates/OA2/zMV_FileUpload.html";
            //    if (scope.uploadView)
            //        view = scope.uploadView;
            //    mg.files = {};

            //    mg.showModal($scope, ev, view, true).then(function () {

            //    }, function () { });
            //}
            
            var divA = angular.element('<a ngf-select="uploadFiles($files)" multiple accept="image/*">').addClass(scope.uploadButtonClass).html(
                '<span class="glyphicon glyphicon-upload"></span> Select Files'
                );
            elem.append(divA);

            $compile(elem.contents())(scope);
        }
    }
}]);
