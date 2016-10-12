'use strict';
//zDir_zPlot_RangeSlider
define(['app'], function (app) {

    var injectParams = ["$compile", "$window", "$timeout"];
    var zd = function ($compile, $window, $timeout) {
        //angular.module("zDir_zPlot_RangeSlider", [])
        //.directive("zplotrangeslider", ["$compile", "$window", "$timeout", function ($compile, $window, $timeout) {
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
                    var generatePlot = function generatePlotRangeSlider(isFullScreen) {
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
                        }
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

                            var rawDataURL = 'https://raw.githubusercontent.com/plotly/datasets/master/2016-weather-data-seattle.csv';
                            var xField = 'Date';
                            var yField = 'Mean_TemperatureC';

                            var selectorOptions = {
                                buttons: [{
                                    step: 'month',
                                    stepmode: 'backward',
                                    count: 1,
                                    label: '1m'
                                }, {
                                    step: 'month',
                                    stepmode: 'backward',
                                    count: 6,
                                    label: '6m'
                                }, {
                                    step: 'year',
                                    stepmode: 'todate',
                                    count: 1,
                                    label: 'YTD'
                                }, {
                                    step: 'year',
                                    stepmode: 'backward',
                                    count: 1,
                                    label: '1y'
                                }, {
                                    step: 'all',
                                }],
                            };

                            var config = {
                                showLink: false, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud'],
                                displayModeBar: false
                            };

                            Plotly.d3.csv(rawDataURL, function (err, rawData) {
                                if (err) throw err;

                                var data = prepData(rawData);
                                var layout = {
                                    title: 'Time series with range slider and selectors',
                                    xaxis: {
                                        rangeselector: selectorOptions,
                                        rangeslider: {}
                                    },
                                    yaxis: {
                                        fixedrange: true
                                    }
                                };

                                Plotly.plot(gd, data, layout, config);
                            });

                            function prepData(rawData) {
                                var x = [];
                                var y = [];

                                rawData.forEach(function (datum, i) {

                                    x.push(new Date(datum[xField]));
                                    y.push(datum[yField]);
                                });

                                return [{
                                    mode: 'lines',
                                    x: x,
                                    y: y
                                }];
                            }
                        }, 100);
                    }

                    generatePlot();

                });

            }
        }
    }
    zd.$inject = injectParams;

    app.register.directive('zplotrangeslider', zd);

});