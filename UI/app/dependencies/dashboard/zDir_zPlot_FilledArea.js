'use strict';
//zDir_zPlot_FilledArea
define(['app'], function (app) {

    var injectParams = ["$compile", "$window", "$timeout"];

    var zd = function ($compile, $window, $timeout) {
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

                    var generatePlot = function generatePlotFilledArea(isFullScreen) {
                        var WIDTH_IN_PERCENT_OF_PARENT = 100,
                            HEIGHT_IN_PERCENT_OF_PARENT = 50;

                        elem.html("");

                        var d3 = Plotly.d3;
                        var gd3 = d3.select('#' + attrs['id'])
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

                        scope.plotlyNode = scope.plotlyNode || {};
                        scope.plotlyNode[attrs['id']] = gd3.node();
                        var gd = scope.plotlyNode[attrs['id']];

                        scope.Plot_ResizeEvent = function (nodeId) {
                            //  Plotly.redraw(this.plotlyNode[nodeId]);
                            Plotly.Plots.resize(this.plotlyNode[nodeId]);
                            Plotly.redraw(this.plotlyNode[nodeId]);
                        }
                        var panelId = $(gd).parents('.panel:first').parent().attr('id');
                        angular.element($window).bind('resize:' + panelId, function (event, isFullScreen) {

                            generatePlot(isFullScreen);
                            // scope.Plot_ResizeEvent(attrs['id']);
                            // manuall $digest required as resize event
                            // is outside of angular
                            scope.$digest();
                        })

                        $compile(elem.contents())(scope);

                        $timeout(function () {

                            var trace1 = {
                                x: [1, 2, 3, 4],
                                y: [0, 2, 3, 5],
                                fill: 'tozeroy',
                                fillcolor: '#4fd8b0',
                                type: 'scatter',
                                mode: 'none'
                            };

                            var trace2 = {
                                x: [1, 2, 3, 4],
                                y: [3, 5, 1, 7],
                                fill: 'tonexty',
                                fillcolor: '#ffbc0b',
                                type: 'scatter',
                                mode: 'none'
                            };

                            var layout = {
                                title: 'Overlaid Chart Without Boundary Lines',
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
                            };

                            var data = [trace1, trace2];

                            var config = {
                                showLink: false, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud'],
                                displayModeBar: false
                            };

                            Plotly.plot(gd, data, layout, config);
                        }, 100);
                    }

                    generatePlot();
                });

            }
        }
    }
    zd.$inject = injectParams;

    app.register.directive('zplotfilledarea', zd);

});