'use strict';
//zDir_zPlot_Pie
define(['app'], function (app) {

    var injectParams = ["$compile", "$window", "$timeout"];
    var zd = function ($compile, $window, $timeout) {

        //angular.module("zDir_zPlot_Pie", [])
        //.directive("zplotpie", ["$compile", "$window", "$timeout", function ($compile, $window, $timeout) {
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


                            var data = [{
                                values: [16, 15, 12, 6, 5, 4, 42],
                                labels: ['US', 'China', 'European Union', 'Russian Federation', 'Brazil', 'India', 'Rest of World'],
                                domain: {
                                    x: [0, 0.85]
                                },
                                name: 'GHG Emissions',
                                hoverinfo: 'label+percent+name',
                                // textinfo: 'none',
                                hole: .6,
                                type: 'pie'
                            }];


                            var layout = {
                                // title: 'Global Emissions 1990-2011',
                                legend: {
                                    x: -0.3,
                                    y: 1.3,
                                    bgcolor: 'rgba(255, 255, 255, 0)',
                                    bordercolor: 'rgba(255, 255, 255, 0)'
                                },
                                annotations: [
                                  //{
                                  //    font: {
                                  //        size: 20
                                  //    },
                                  //    showarrow: false,
                                  //    text: 'GHG',
                                  //    x: 0.2,
                                  //    y: 0.5
                                  //}
                                ],
                                // height: 600,
                                // width: 600
                            };

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

    app.register.directive('zplotpie', zd);

});