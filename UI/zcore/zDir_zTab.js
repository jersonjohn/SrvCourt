angular.module("zDir_zTab", [])
.directive("ztab", ["$compile", function ($compile) {
    return {
        //require: 'ngModel',
        restrict: 'E',
        replace: true,
        //scope: {
        //    name: '@',
        //    field: '=',
        //    label: '@',
        //    group: '=',
        //    modelGroup: "="
        //},
        link: function (scope, elem, attrs, ctrl) {
            var name = attrs['name'];
            var label = attrs['label'];
            var field = scope.f_tab[name];

            //tab control
            if (!scope.group.tabStatus)
                scope.group.tabStatus = {};
            if (!scope.group.tabStatus[name])
                scope.group.tabStatus[name] = [];
            scope.activeTab = scope.group.tabStatus[name];
            scope.activeTab[0] = 1;

            scope.tabLinkClick = function (ev, target) {
                for (var i = 0; i < scope.activeTab.length; i++) {
                    if (scope.activeTab[i] == 1)
                        scope.activeTab[i] = 0; //0 is inactive
                }
                
                scope.activeTab[Number(target)] = 1; // 1 is active
            }

            //tab block
            var div00 = angular.element('<div>').addClass('col-xs-12 col-sm-12 col-md-12 col-lg-12 mb25 tab-block').attr({
                'id': field['Id']
            });
            var divTabContent = null;
            var divTabUl = angular.element('<ul>').addClass('nav nav-tabs');
            var tabLabel = label.split(',');
            for(var t=0; t<tabLabel.length; t++) {
                var divTabLi = angular.element('<li>').attr('style', 'cursor:pointer');
                if (t==0)
                    divTabLi.addClass('active');
                var divTabA = angular.element('<a>').attr({
                    'ng-click': 'tabLinkClick($event, "' + t + '")',
                    //'href': '#t' + t,
                    'data-toggle': 'tab',
                }).text(tabLabel[t]);
                divTabUl.append(divTabLi);
                divTabLi.append(divTabA);
            }
            div00.append(divTabUl);

            divTabContent = angular.element('<div>').addClass('tab-content p20').attr('id', name);
            div00.append(divTabContent);

            
            //scope.f = [];
            for (var i = 0; i < field.length; i++) {
                var fName = field[i].Name;
                scope.f_tab[fName] = [];
                scope.f_tab[fName] = field[i];
                var div_zInput = angular.element('<z-input>').attr({
                    'field': fName,
                    'zform': 'F1',
                    'zmodel': 'group.zModel',
                    'index': '{{$index + 1}}',
                    'group': 'group'
                });
                //if (divTabContent) {
                //    div_zInput.attr('id', 't' + i);
                //    divTabContent.append(div_zInput);
                //}
                //else
                divTabContent.append(div_zInput);
            }

            elem.append(div00);
            $compile(elem.contents())(scope);
        }
    }
}]);
