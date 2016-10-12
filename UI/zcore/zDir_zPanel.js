angular.module("zDir_zPanel", [])
.directive("zpanel", ["$compile", "$timeout", function ($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attrs, ctrl) {
            var name = attrs['name'];
            var label = attrs['label'];
            var field = scope.f_panel[name];
            
            //panel block
            var div00 = angular.element('<div>').addClass('panel')
            .attr({
              //  'id': attrs['id'],
                'data-panel-remove': attrs['panelremove'],
                'data-panel-color': attrs['panelcolor'],
                'data-panel-fullscreen': attrs['panelfullscreen'],
                'data-panel-title': attrs['paneltitle'],
                'data-panel-collapse': attrs['panelcollapse']
            });

            var divPanelHeading = angular.element('<div>').addClass('panel-heading');
            var divPanelTitle = angular.element('<span>').addClass('panel-title').text(label);
            divPanelHeading.append(divPanelTitle);

           

            var divPanelBody = angular.element('<div>').addClass('panel-body');
              //  .attr({ 'style': 'display:table-cell; height:80vh'});
            div00.append(divPanelHeading);
            div00.append(divPanelBody);

            for (var i = 0; i < field.length; i++) {
                var fName = field[i].Name;
                scope.f_panel[fName] = [];
                scope.f_panel[fName] = field[i];
                var div_zInput = angular.element('<z-input>').attr({
                    'field': fName,
                    'zform': 'F1',
                    'zmodel': 'group.zModel',
                    'index': '{{$index + 1}}',
                    'group': 'group'
                });
                divPanelBody.append(div_zInput);
            }

            elem.append(div00);
            $compile(elem.contents())(scope);

            $timeout(function () {
                // Init AllCP Panels
                $('.allcp-panels').allcppanel({
                    grid: '.allcp-grid',
                    draggable: true,
                    preserveGrid: true,
                    onStart: function () { },
                    onFinish: function () {
                        $('.allcp-panels').addClass('animated fadeIn').removeClass('fade-onload');
                       // demoHighCharts.init();
                       // runVectorMaps();
                    },
                    onSave: function () {
                        $(window).trigger('resize');
                    }
                });
                
            }, 0);


        }
    }
}]);
