//angular.module("zDir_zPlot_Bar", [])

'use strict';

define(['app'], function (app) {

    var injectParams = ["$compile", "$window", "$timeout"];

    var zd = function ($compile, $window, $timeout) {

        //angular.module("amesApp").register
        //.directive("zplotbar", ["$compile", "$window", "$timeout", function ($compile, $window, $timeout) {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs, ctrl) {
                //var model = scope[attrs["value"]];
                //var id = attrs["id"];
                //var onChange = attrs["onchange"];
                //var label = attrs["label"];
                //var showLabel = attrs["showlabel"];
                //var readonly = attrs["readonly"];

                require(['/Scripts/app/plugin/plotly/plotly-1.10.2.min.js'], function (Plotly) {
                    var generatePlot = function generatePlotPie(isFullScreen) {
                        var WIDTH_IN_PERCENT_OF_PARENT = 100,
                            HEIGHT_IN_PERCENT_OF_PARENT = 50,
                            HEIGHT_OF_PARENT = 400;

                        elem.html("");
                        //var gd3 = angular.element('<div>').attr({
                        //    'style': 'width:80%;margin-left:10%;height:80%;margin-top:10vh'
                        //});
                        var d3 = Plotly.d3;
                        var gd3 = d3.select('#' + attrs['id'])
                        //.attr('onresize', 'Plot_ResizeEvent(' + attrs["id"] + ')')
                        .append('div');
                        if (isFullScreen == true)
                            gd3.style({
                                width: WIDTH_IN_PERCENT_OF_PARENT + '%',
                                height: '85vh',
                            });
                        else
                            gd3.style({
                                width: WIDTH_IN_PERCENT_OF_PARENT + '%',
                                height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
                            });


                        //var parent_gd3 = $('#' + attrs['id']).parents('.panel')
                        //.attr('onresize', 'Plot_ResizeEvent("' + attrs["id"] + '")');

                        scope.plotlyNode = scope.plotlyNode || {};
                        scope.plotlyNode[attrs['id']] = gd3.node();
                        var gd = scope.plotlyNode[attrs['id']];

                        scope.Plot_ResizeEvent = function (nodeId) {
                            // Plotly.redraw(this.plotlyNode[nodeId]);
                            Plotly.Plots.resize(this.plotlyNode[nodeId]);
                        }
                        //angular.element($window).bind('resize', function () 
                        var panelId = $(gd).parents('.panel:first').parent().attr('id');
                        angular.element($window).bind('resize:' + panelId, function (event, isFullScreen) {
                            generatePlot(isFullScreen);
                            //scope.Plot_ResizeEvent(attrs['id']);
                            // manuall $digest required as resize event
                            // is outside of angular
                            scope.$digest();
                        })

                        $compile(elem.contents())(scope);

                        $timeout(function () {

                            var x_properties = {
                                x: ['Zebras', 'Lions', 'Pelicans']
                            };

                            var trace1 = {
                                x: x_properties.x,
                                y: [90, 40, 60],
                                type: 'bar',
                                name: 'New York Zoo',
                                marker: {
                                    color: '#4fd8b0',
                                    line: {
                                        //  width: 0.5
                                    }
                                }
                            };

                            var trace2 = {
                                x: x_properties.x,
                                y: [10, 80, 45],
                                type: 'bar',
                                name: 'San Francisco Zoo',
                                marker: {
                                    color: '#ffbc0b',
                                    line: {
                                        // width: 0.5
                                    }
                                }
                            };

                            var data = [trace1, trace2];

                            var layout = {
                                barmode: 'stack',        //eg. group, stack
                                //title: 'Auto-Resize',
                                //font: {
                                //    size: 16
                                //}
                                xaxis: {
                                    tickfont: {
                                        size: 11,
                                        color: '#606060'
                                    }
                                },
                                yaxis: {
                                    title: 'USD (millions)',
                                    titlefont: {
                                        size: 14,
                                        color: 'rgb(107, 107, 107)'
                                    },
                                    tickfont: {
                                        size: 11,
                                        color: '#606060'
                                    }
                                },
                                legend: {
                                    x: 0,
                                    y: 1.2,
                                    bgcolor: 'rgba(255, 255, 255, 0)',
                                    bordercolor: 'rgba(255, 255, 255, 0)'
                                }
                            };

                            var config = {
                                showLink: false, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud'],
                                displayModeBar: false
                            };

                            Plotly.plot(gd, data, layout, config);
                            //window.onresize = (function (nodeId) {
                            //    scope.Plot_ResizeEvent(nodeId);
                            //})(attrs['id']);

                            // window.onresize = scope.Plot_ResizeEvent(gd);
                        }, 100);
                    }

                    generatePlot();
                });

            }
        }
        //}]);
    }
    zd.$inject = injectParams;

    app.register.directive('zplotbar', zd);

});