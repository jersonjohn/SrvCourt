angular.module("zDir_zImg", [])
.directive("zimg", ["$compile", "$rootScope", "$timeout", function ($compile, $rootScope, $timeout) {
    return {
        link: function (scope, element, attrs) {
            var generateImg = function () {
                //var s = $rootScope.$eval(attrs['refreshImage']);

                $timeout(function () {
                    $rootScope[attrs['refreshImage']] = false;
                }, 1500);
                
                element.html("");
                var img = angular.element('<img>').attr({
                    'ng-src': '{{' + attrs['url'] + '}}?id={{' + attrs['src'] + '}}&size=' + attrs['size'] + '&r=' + Math.random(),
                    'alt': attrs['alt'],
                    //'ng-src': attrs['url'] + '&r=' + Math.random(),
                }).addClass(attrs['imgclass']);
                element.append(img);
                $compile(element.contents())(scope);
            }

            $rootScope.$watch('refreshImage', function (newValue, oldValue) {
                if (newValue == true) 
                    generateImg();
            });
            //generateNavBar();
            //$timeout(generateNavBar, 1000);

        },
        restrict: "E",
        replace: true
    }
}]);