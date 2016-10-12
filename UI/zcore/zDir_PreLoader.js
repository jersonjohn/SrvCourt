angular.module("zDir_PreLoader", [])
.directive("preLoader", ['$compile', function ($compile) {
    return {
        link: function (scope, element, attrs) {

            var spinnerProgress = function () {
                var div02 = angular.element("<div>").addClass('spinner center');
                for (var i = 0; i < 12; i++) {
                    var div03 = angular.element("<div>").addClass('spinner-blade');
                    div02.append(div03);
                };
                return div02;
            };

            var mdCircularProgress = function () {
                //<div layout="row" layout-align="center center">
                //    <md-progress-circular md-mode="indeterminate" md-diameter="70"></md-progress-circular>
                //</div>
                var div02 = angular.element("<div>").attr({
                    'layout': 'row',
                    'layout-align': 'center center'
                });
                var div03 = angular.element("<md-progress-circular>").attr({
                    'md-mode': 'indeterminate',
                    'md-diameter': '70'
                });
                div02.append(div03);
                return div02;
            };

            var div01 = angular.element("<div>").addClass('overLay');
            element.append(div01);
            //div01.append(spinnerProgress());
            div01.append(mdCircularProgress());
            var parent = element.parent();
            parent.css('position', 'relative');
            //parent.append(div01);
            scope.$watch(attrs["isloading"], function () {
                if (scope.$eval(attrs["isloading"]) == true) {
                    parent.append(div01);
                } else {
                    var kids = parent.children();
                    for (var i = 0; i < kids.length; i++) {
                        if (kids.eq(i).hasClass("overLay"))
                            kids.eq(i).remove();
                    }
                }
            });
            $compile(element.contents())(scope);
        },
        restrict: "A",
        replace: true
    }
}]);