angular.module("zDir_NavBar", [])
.directive("znavbar", ["$compile", "$location", function ($compile, $location) {
    return {
        link: function (scope, element, attrs) {
            var generateNavBar = function () {
                var menus = scope[attrs["menus"]];
                var currentOpenMenu = null;

                scope.DropDown_MenuClick = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    //this.parent().siblings().removeClass('open');
                    //$event.currentTarget.parentElement.children().removeClass('menu-open');
                    
                    //Begin accordian behaviour
                    if (currentOpenMenu != $event.currentTarget) {
                        if(currentOpenMenu)
                            angular.element(currentOpenMenu).removeClass('menu-open');
                        currentOpenMenu = $event.currentTarget;
                    }
                    else if (angular.element($event.currentTarget).hasClass('menu-open'))
                        currentOpenMenu = null;
                    //End accordian behaviour

                    angular.element($event.currentTarget).toggleClass('menu-open');
                    
                    //$(this).parent().toggleClass('open');
                }

                scope.SubMenuClick = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    //this.parent().siblings().removeClass('open');
                    //$event.currentTarget.parentElement.children().removeClass('open');
                    angular.element($event.currentTarget).toggleClass('menu-open');
                    //$(this).parent().toggleClass('open');
                };

                scope.ItemClick = function (hrefPath) {
                    if (('ontouchstart' in window || navigator.maxTouchPoints) && document.documentElement.clientWidth < 1100) {
                        $('znavbar > ul.sidebar-menu a.menu-open').removeClass('menu-open');
                    }
                    $location.path(hrefPath);
                }
                
                element.html("");
                if (!angular.isDefined(menus))
                    return;
                if (menus.length == 0) {
                    alert('There is no menu element found');
                    return;
                }

                var CurrentUl = [];
                var div01 = angular.element("<ul>").addClass('nav sidebar-menu');
                element.append(div01);
                var menu_Title_li = angular.element("<li>").addClass('sidebar-label pt30').text('Menu');
                div01.append(menu_Title_li);
                var rootId = String(menus[0]['Parent']);
                CurrentUl[rootId] = div01;
                //var CurrentUl = {'0': div01};
                for (i = 0; i < menus.length; i++) {

                    var divLi = angular.element("<li>");
                    switch (menus[i]['Type']) {
                        case 'item':
                            var divA = angular.element("<a>");
                            divA.css('cursor', 'pointer');
                            if (menus[i]['URL'] == '' || (menus[i]['URL'] ? true : false)) {
                                //divA.attr('href', menus[i]['URL']);
                                divA.attr('ng-click', 'ItemClick("' + menus[i]['URL'] + '")');
                            }

                            if (menus[i]['ClickEvent'] != '' && (menus[i]['ClickEvent'] ? true : false)) {
                                divA.attr('ng-click', menus[i]['ClickEvent']);
                            }

                            if (menus[i]['Icon'] == '' && (menus[i]['Icon'] ? true : false))
                                divA.text(menus[i]['Label']);
                            else {
                                divA.html('<span class="' + menus[i]['Icon'] + '"></span> ' + menus[i]['Label']);
                            }
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            //console.log('menu building Id: ' + menus[i]['Id'] + ',  Parent: ' + menus[i]['Parent']);
                            divLi.append(divA);
                            break;
                        case 'dropdown':
                            //divLi.addClass('dropdown');
                            var divLiA = angular.element("<a>").addClass('accordion-toggle').attr({
                               // 'data-toggle': 'dropdown',
                               // 'role': 'button',
                                'href': '#',
                                'ng-click': 'DropDown_MenuClick($event)',
                                //'aria-haspopup': 'true',
                                //'aria-expanded': 'false'
                            }).html('<span class="' + menus[i]['Icon'] + '"></span> <span class="sidebar-title">' + menus[i]['Label'] + '</span> <span class="caret"></span>');
                            var divUl = angular.element("<ul>").addClass('nav sub-nav');
                            CurrentUl[String(menus[i]['Parent'])].append(divLi);
                            divLi.append(divLiA);
                            divLi.append(divUl);
                            CurrentUl[String(menus[i]['Id'])] = divUl;
                            //console.log('menu building Id: ' + menus[i]['Id'] + ',  Parent: ' + menus[i]['Parent']);
                            break;
                        case 'dropdown-submenu':
                            //divLi.addClass('dropdown dropdown-submenu');
                            var divLiA = angular.element("<a>").addClass('accordion-toggle').attr({
                                //'data-toggle': 'dropdown',
                                //'tabindex': '-1',
                                'ng-click': 'SubMenuClick($event)',
                                'href': '#'
                            }).html('<span class="' + menus[i]['Icon'] + '"></span> ' + menus[i]['Label'] + '<span class="caret"></span>');
                            var divUl = angular.element("<ul>").addClass('nav sub-nav');
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