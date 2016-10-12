angular.module("zDir_NavBar", [])
.directive("znavbar", ["$compile", function ($compile) {
    return {
        link: function (scope, element, attrs) {
            var generateNavBar = function () {
                var menus = scope[attrs["menus"]];

                scope.SubMenuClick = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    //this.parent().siblings().removeClass('open');
                    //$event.currentTarget.parentElement.children().removeClass('open');
                    angular.element($event.target.parentElement).toggleClass('open');
                    //$(this).parent().toggleClass('open');
                };
                
                element.html("");
                if (!angular.isDefined(menus))
                    return;
                if (menus.length == 0) {
                    alert('There is no menu element found');
                    return;
                }

                var CurrentUl = [];
                var div01 = angular.element("<ul>").addClass('nav navbar-nav');
                element.append(div01);
                var rootId = String(menus[0]['Parent']);
                CurrentUl[rootId] = div01;
                //var CurrentUl = {'0': div01};
                for (i = 0; i < menus.length; i++) {

                    var divLi = angular.element("<li>");
                    switch (menus[i]['Type']) {
                        case 'item':
                            var divA = angular.element("<a>");
                            if (menus[i]['URL'] == '' || (menus[i]['URL'] ? true : false)) {
                                divA.attr('href', menus[i]['URL']);
                            }

                            if (menus[i]['ClickEvent'] != '' && (menus[i]['ClickEvent'] ? true : false)) {
                                divA.attr('ng-click', menus[i]['ClickEvent']);
                            }

                            if (menus[i]['Icon'] == '' && (menus[i]['Icon'] ? true : false))
                                divA.text(menus[i]['Label']);
                            else {
                                divA.html('<span ' + menus[i]['Icon'] + '></span> ' + menus[i]['Label']);
                            }
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            //console.log('menu building Id: ' + menus[i]['Id'] + ',  Parent: ' + menus[i]['Parent']);
                            divLi.append(divA);
                            break;
                        case 'dropdown':
                            divLi.addClass('dropdown');
                            var divLiA = angular.element("<a>").addClass('dropdown-toggle').attr({
                                'data-toggle': 'dropdown',
                                'role': 'button',
                                'href': '#',
                                //'aria-haspopup': 'true',
                                //'aria-expanded': 'false'
                            }).html('<span ' + menus[i]['Icon'] + '></span> ' + menus[i]['Label'] + ' <span class="caret"></span>');
                            var divUl = angular.element("<ul>").addClass('dropdown-menu');
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            divLi.append(divLiA);
                            divLi.append(divUl);
                            CurrentUl[String(menus[i]['Id'])] = divUl;
                            //console.log('menu building Id: ' + menus[i]['Id'] + ',  Parent: ' + menus[i]['Parent']);
                            break;
                        case 'dropdown-submenu':
                            divLi.addClass('dropdown dropdown-submenu');
                            var divLiA = angular.element("<a>").addClass('dropdown-toggle').attr({
                                'data-toggle': 'dropdown',
                                //'tabindex': '-1',
                                'ng-click': 'SubMenuClick($event)',
                                'href': '#'
                            }).html('<span ' + menus[i]['Icon'] + '></span> ' + menus[i]['Label']);
                            var divUl = angular.element("<ul>").addClass('dropdown-menu');
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            divLi.append(divLiA);
                            divLi.append(divUl);
                            CurrentUl[String(menus[i]['Id'])] = divUl;
                            //console.log('menu building Id: ' + menus[i]['Id'] + ',  Parent: ' + menus[i]['Parent']);
                            break;
                        case 'divider':
                            divLi.addClass('divider');
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            break;
                    }

                }

                $compile(element.contents())(scope);
            }

            scope.$watch('menus', function (newValue, oldValue) {
                generateNavBar();
            });
            //generateNavBar();
            //$timeout(generateNavBar, 1000);

        },
        restrict: "E",
        replace: true
    }
}]);