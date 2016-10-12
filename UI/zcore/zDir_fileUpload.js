angular.module("zDir_fileUpload", [])
.directive('fileUpload', function () {
    return {
        scope: true,
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                scope.$emit("fileSelected", { file: files[0] });
            });
        }
    };
})