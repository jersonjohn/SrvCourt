angular.module("zDir_ZGrid", ["zSrv_CookieStore", "zDir_zNoDirty"])
.directive("zgrid", ['$compile', '$q', '$http', '$timeout', 'zSrv_OAuth2', 'zSrv_CookieStore', '$location', function ($compile, $q, $http, $timeout, zSrv_OAuth2, zSrv_CookieStore, $location) {
    return {
        //scope: {
        //    gridName: '@gridname',
        //    gridDataSet: '@gridSet',
        //    resourceURL: '=resourceurl',
        //    gridEditClickURL: '=attrs.editclickurl',
        //    columnFields: '=columnfields',
        //    externalPagination
        //    allowGridDataExport
        //    enableSaveGridState

        //    enableRowSelect
        //    enableMultiSelect
        //    enableFullRowSelect,
        //    indexKey
        //},
        link: function (scope, element, attrs) {
            var gridName = null;
            var myGrid = null;
            var gridDataSet = null;
            var resourceURL = null;
            var columnFields = null;
            var externalPagination = null;
            var allowGridDataExport = null;
            var enableSaveGridState = null;
            var enableRowSelect = null;
            var enableMultiSelect = null;
            var enableFullRowSelect = null;
            var indexKey = null;
 
            var httpTimerPool = [];
            var gridCurrentState = {};
            var gridEditClickURL = null;

            var _associateType = function (formDataType) {

                //ToDo: for number type
                switch (formDataType) {
                    case 'date':
                    case 'zdate':
                    case 'month':
                    case 'zmonth':
                    case 'zuidatetime':
                    case 'zdatetime':
                        return 'date';
                        break;
                    case 'checkbox':
                        return 'boolean';
                        break;
                    case 'number':
                    case 'currency':
                        return 'number';
                        break;
                    default:
                        return 'string';
                        break;
                };
            };

            var _getfilterHeaderTemplate = function (formDataType) {
                switch (formDataType) {
                    case 'date':
                    case 'zdate':
                        return '<div class="ui-grid-filter-container"><label class="field"><input type="text" class="gui-input" znodirty zuidatepicker ng-model="col.filters[0].term">' +
                            //'<div role="button" class="ui-grid-filter-button ng-scope" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined &amp;&amp; colFilter.term !== null &amp;&amp; colFilter.term !== \'\'" tabindex="0" aria-hidden="false" aria-disabled="false"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter" aria-label="Remove Filter">&nbsp;</i></div>' +
                        '<label class="field"><input type="text" znodirty class="gui-input" zuidatepicker ng-model="col.filters[1].term"></label></div>';
                        break;
                    case 'month':
                    case 'zmonth':
                        return '<div class="ui-grid-filter-container"><label class="field"><input type="text" class="gui-input" znodirty zuimonthpicker ng-model="col.filters[0].term">' +
                            //'<div role="button" class="ui-grid-filter-button ng-scope" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined &amp;&amp; colFilter.term !== null &amp;&amp; colFilter.term !== \'\'" tabindex="0" aria-hidden="false" aria-disabled="false"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter" aria-label="Remove Filter">&nbsp;</i></div>' +
                        '<label class="field"><input type="text" znodirty class="gui-input" zuimonthpicker ng-model="col.filters[1].term"></label></div>';
                        break;
                    case 'zuidatetime':
                    case 'zdatetime':
                        return '<div class="ui-grid-filter-container"><label class="field"><input type="text" class="gui-input" znodirty zuiDateTimePicker ng-model="col.filters[0].term">' +
                           // '<div role="button" class="ui-grid-filter-button ng-scope" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined &amp;&amp; colFilter.term !== null &amp;&amp; colFilter.term !== \'\'" tabindex="0" aria-hidden="false" aria-disabled="false"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter" aria-label="Remove Filter">&nbsp;</i></div>' +
                        '<label class="field"><input type="text" znodirty class="gui-input" zuiDateTimePicker ng-model="col.filters[1].term"></label></div>';

                        break;
                    default:
                        return '<div class="ui-grid-filter-container"><label class="field"><input type="text" class="gui-input" znodirty ng-model="col.filters[0].term">' +
                           // '<div role="button" class="ui-grid-filter-button ng-scope" ng-click="removeFilter(colFilter, $index)" ng-if="!colFilter.disableCancelFilterButton" ng-disabled="colFilter.term === undefined || colFilter.term === null || colFilter.term === \'\'" ng-show="colFilter.term !== undefined &amp;&amp; colFilter.term !== null &amp;&amp; colFilter.term !== \'\'" tabindex="0" aria-hidden="false" aria-disabled="false"><i class="ui-grid-icon-cancel" ui-grid-one-bind-aria-label="aria.removeFilter" aria-label="Remove Filter">&nbsp;</i></div>' +
                        '</label></div>';

                        //return null;
                        break;
                }
            };

            var _createColumnDefs = function (colResult, formData, grp) {
                //var colResult = [];
                for (var i = 0; i < formData.length; i++) {
                    var record = formData[i];
                    if (record.Type == 'zalert' || record.Type == 'zbuttons' || record.Type == 'zgrid' || record.Type == 'zmfb' || record.Type == 'ztree' )
                        continue;
                    if (record.Type == 'zdiv' || record.Type == 'ztab' || record.Type == 'zpanel') {
                        _createColumnDefs(colResult, record.Value, grp);
                        continue;
                    }

                    var cellClassFunc = null;
                    if (record.cellClass) {
                        cellClassFunc = scope.$eval(record.cellClass);
                    }


                    var column = {
                        name: record.Name,
                        displayName: record.Name,
                        field: record.Value,
                        enableHiding: record.enableHiding,
                        visible: record.gridColVisible,
                        type: _associateType(record.Type),
                        width: record.width,
                        minWidth: record.minWidth,
                        enableCellEdit: record.enableCellEdit,
                        enableFiltering: record.enableFiltering,
                        enableSorting: record.enableSorting,
                        enablePinning: record.enablePinning,
                        pinnedLeft: record.pinnedLeft,
                        pinnedRight: record.pinnedRight,
                        cellFilter: record.cellFilter,
                        filterHeaderTemplate: (record.filterHeaderTemplate ? record.filterHeaderTemplate : _getfilterHeaderTemplate(record.Type)),
                        filterCellFiltered: record.filterCellFiltered,
                        filters: record.filters,
                        cellTemplate: record.cellTemplate,
                        cellClassFunc: cellClassFunc,
                        cellClass: function (grid, row, col, rowIndex, colIndex) {
                            if (col.colDef.cellClassFunc != null) {
                                var val = grid.getCellValue(row, col);
                                return col.colDef.cellClassFunc(val);
                            }
                        },
                        //cellTooltip: function (row, col) {
                        //    return row.entity[col.field];
                        //},
                        cellTooltip: true,
                        headerTooltip: function (col) {
                            return col.displayName;
                        }
                    };
                    if (grp.showGridEditButton) {
                        if (record.Name == 'Id') {
                            if (!record.cellTemplate) {
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center; cursor:pointer" ng-click= "grid.appScope.' + gridDataSet + '.editModel(' +
                                    grp.gridClickKey + ')"><a> {{row.entity.' + column.field + '}} </a></div>'

                            }
                        }
                    }
                    if (!column.cellTemplate) {
                        switch (record.Type) {
                            case 'number':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;" uib-tooltip="{{COL_FIELD}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD | number}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;">{{row.entity.' + column.field + '}}</div>';
                                break;
                            case 'currency':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;" uib-tooltip="{{COL_FIELD | currency}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD | currency}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;">${{row.entity.' + column.field + '}}</div>';
                                break;
                            case 'date':
                            case 'zdate':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;" uib-tooltip="{{COL_FIELD | date:\'dd/MM/yyyy\'}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD | date:"dd/MM/yyyy" }}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;">{{row.entity.' + column.field + ' | date:"dd/MM/yyyy"}}</div>';
                                break;
                            case 'zdatetime':
                            case 'zuidatetime':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;" uib-tooltip="{{COL_FIELD | date:\'medium\'}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD | date:"medium"}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;">{{row.entity.' + column.field + ' | date:"dd/MM/yyyy,  hh:mm a"}}</div>';
                                break;
                            case 'zmonth':
                            case 'month':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;" uib-tooltip="{{COL_FIELD | date:\'yyyy-MM\'}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD | date:"yyyy-MM"}}</div>';
                            column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.' + column.field + ' | date:"yyyy-MM"}}</div>';
                                break;
                            case 'boolean':
                            case 'checkbox':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;">{{COL_FIELD}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.' + column.field + '}}</div>';
                                break;
                            case 'rtext':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;" uib-tooltip="{{COL_FIELD}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:right;">{{row.entity.' + column.field + '}}</div>';
                                break;
                            case 'ctext':
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;" uib-tooltip="{{COL_FIELD}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{COL_FIELD}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.' + column.field + '}}</div>';
                                break;
                            default:
                                //column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;" uib-tooltip="{{COL_FIELD}}" tooltip-append-to-body="true" tooltip-popup-delay="400">{{::row.entity.' + column.field + '}}</div>';
                                column.cellTemplate = '<div class="ui-grid-cell-contents" style="text-align:left;">{{row.entity.' + column.field + '}}</div>';
                                break;
                        }
                    }

                    colResult.push(column);
                };
                if (grp.showGridEditButton) {
                    var editColumn = {
                        name: 'Edit',
                        enableHiding: false,
                        visible: true,
                        width: 65,
                        minWidth: 50,
                        enableFiltering: false,
                        enableSorting: false,
                        enablePinning: false,
                        pinnedRight: true,
                        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;" ng-click="grid.appScope.' +
                            gridDataSet + '.editModel(' + grp.gridClickKey + ')"><a class="btn btn-xs btn-primary"><span class="glyphicon glyphicon-edit"></span></a></div>'

                        //cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;"><a class="btn btn-xs btn-primary" ng-click="grid.appScope.group.editModel(' +
                        //    grp.gridClickKey + ')"><span class="glyphicon glyphicon-edit"></span> Edit</a></div>'
                    }
                    colResult.push(editColumn);
                }
                return colResult;
            }

            var _listGridOptions = function (grp, colFields) {
                //var colFields = _formFields(grp);
                //var colFields = columnFields;

                var _httpPost = function (serviceURL, parameters) {
                    var deferred = $q.defer();
                    //var domainURL = apiServiceBaseUri;
                    //if (serviceURL.indexOf('http') >= 0)
                    //    domainURL = "";

                    $http.post(serviceURL, parameters).success(function (response) {
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        deferred.reject(err);
                        //console.log(err);
                        //alert(err);
                    });
                    return deferred.promise;
                }

                var _httpGet = function (serviceURL, parameters) {
                    var deferred = $q.defer();
                    //var domainURL = apiServiceBaseUri;
                    //if (serviceURL.indexOf('http') >= 0)
                    //    domainURL = "";

                    $http({
                        url: serviceURL,
                        method: "GET",
                        params: parameters
                    }).success(function (response) {
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        deferred.reject(err);
                        //console.log(err);
                        //alert(err);
                    });
                    return deferred.promise;
                }

                var stateRestoring = false;

                var selectedRows = [];

                var _getData = function (gridSet, refId) {
                                       
                    var deferred = $q.defer();

                    //To cancel any previous request
                    //while (httpRequestPool.length > 0) {
                    //    var previousRequest = httpRequestPool.pop();
                    //    previousRequest.resolve();
                    //    console.log("Cancel Previous Request. Length is " + httpRequestPool.length);
                    //};
                    while (httpTimerPool.length > 0) {
                        var previousTimer = httpTimerPool.pop();
                        $timeout.cancel(previousTimer);
                        
                    }
                    
                    //httpRequestPool.push(deferred);
                    var timer = 150;
                    var httpTimer = $timeout(function () {
                        console.log('call get Data ******');
                        //stateRestoring = true;
                        //gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);

                        var pageSetting = {
                            referId: (refId ? refId : grp.referenceId),
                            pageNo: gridSet.paginationOptions.pageNumber - 1,
                            pageSize: gridSet.paginationOptions.pageSize,
                            sortColumnName: gridSet.paginationOptions.sortColumnName,
                            sortOrder: gridSet.paginationOptions.sortOrder,
                            filterParams: gridSet.paginationOptions.filterParams,
                            parameters: gridSet.paginationOptions.parameters,
                        };

                        if (externalPagination) {
                            if (resourceURL) {
                                grp.isLoading = true;
                                var pos = resourceURL.slice(0, resourceURL.length - 1).lastIndexOf("/");
                                var p1 = resourceURL.slice(0, pos + 1);
                                var p2 = resourceURL.slice(pos + 1);
                                //zSrv_OAuth2.storeInMemory('ngLocation', pageSetting);
                                _httpPost(p1 + 'Page' + p2, pageSetting)
                                .then(function (result) {
                                    if (result.data) {
                                        gridSet.totalItems = result.data.totalCount;
                                        gridSet.data = result.data.dataSet;
                                    } else {
                                        gridSet.totalItems = result.totalCount;
                                        gridSet.data = result.dataSet;
                                    }
                                    grp.isLoading = false;
                                    //stateRestoring = false;
                                    deferred.resolve();

                                }, function (err) {
                                    grp.isLoading = false;
                                    //stateRestoring = false;
                                    deferred.reject();
                                });
                            }
                        } else {
                            //grp.isLoading = true;
                            //if (pageSetting.referId) {
                            //    grp.zModel = grp.modelResource.query({ referId: pageSetting.referId });
                            //    //grp.zModel = grp.ngResource(grp.resourceURL + ":referId", { referId: id },
                            //    //    {
                            //    //        query: { method: "GET" }
                            //    //    }).query();
                            //}
                            //else

                            if (resourceURL) {
                                //if(resourceURL.indexOf("oauth2/") == 0) {
                                //    resourceURL.replace("oauth2/", zSrv_OAuth2.OAuth2.BaseUri);
                                //}
                                //var modelResource = grp.ngResource(resourceURL + ":referId", { referId: String(pageSetting.referId) },  //@Id is model.Id
                                //{
                                //    create: { method: "POST" }, save: { method: "PUT" },
                                //    remove: { method: "DELETE" }
                                //});
                                grp.isLoading = true;
                                //grp.zModel = modelResource.query();
                                _httpGet(resourceURL, { referId: pageSetting.referId })
                               .then(function (data) {
                                   //grp.zModel = data;
                                   gridSet.totalItems = data.length;
                                   gridSet.data = data;

                                   //grp.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.OPTIONS);
                                   //console.log('GridName: ' + gridName + ' models records size is ' + grp.zModel.length);
                                   grp.isLoading = false;
                                   //stateRestoring = false;
                                   grp.ListModelAfterSuccess(data);
                                   deferred.resolve();
                               }, function (err) {
                                   console.log('GridName: ' + gridName + ' - getPage event error: ' + err);
                                   grp.alerts.push({ type: "danger", msg: err });
                                   grp.isLoading = false;
                                   //stateRestoring = false;
                                   deferred.reject();
                               });
                            }
                            else if (grp.modelResource) {
                                grp.isLoading = true;
                                grp.zModel = grp.modelResource.query();
                                grp.zModel.$promise.then(function (data) {
                                    //grp.zModel = data;
                                    gridSet.totalItems = data.length;
                                    gridSet.data = data;
                                    //grp.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.OPTIONS);
                                    console.log('GridName: ' + gridName + ' models records size is ' + grp.zModel.length);
                                    grp.isLoading = false;
                                    //stateRestoring = false;
                                    grp.ListModelAfterSuccess(data);
                                    deferred.resolve();
                                }, function (err) {
                                    console.log('GridName: ' + gridName + ' - getPage event error: ' + err);
                                    grp.alerts.push({ type: "danger", msg: err });
                                    grp.isLoading = false;
                                    //stateRestoring = false;
                                    deferred.reject();
                                });
                            }
                        }
                    }, timer);
                    httpTimerPool.push(httpTimer);
                    return deferred.promise;
                }

                var _saveGridState = function (gridSet) {
                    var gridSave = gridSet.gridApi.saveState.save();
                    zSrv_CookieStore.putObject(gridName + ':' + resourceURL, gridSave);
                    zSrv_CookieStore.putObject(gridName + ':' + resourceURL + 'Paging', gridSet.paginationOptions);
                };

                var _restoreGridState = function (gridSet, refId) {
                    if (!zSrv_OAuth2.isExistInMemory($location.path() + 'GridState')) {
                        zSrv_CookieStore.getObject(gridName + ':' + resourceURL).then(function (r) {
                            if (r.status == 'success') {
                                stateRestoring = true;
                                console.log('call restoreGridState @ cookieStore');
                                gridCurrentState = angular.fromJson(r.data);
                                gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);

                                zSrv_CookieStore.getObject(gridName + ':' + resourceURL + 'Paging').then(function (p) {
                                    gridSet.paginationOptions = angular.fromJson(p.data);
                                    gridSet.enableVerticalScrollbar = gridSet.paginationOptions.enableScrollbars;
                                    gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);
                                    //gridSet.getPage();
                                    _getData(gridSet, refId).then(function () {
                                        //gridSet.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.COLUMN);
                                        console.log('update gridSet.paginationCurrentPage');
                                        gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                                        console.log('update gridSet.paginationPageSize');
                                        gridSet.paginationPageSize = gridSet.paginationOptions.pageSize;
                                        console.log('update gridWindowSize');
                                        gridSet.gridWindowSize();
                                        stateRestoring = false;
                                    });
                                });
                            } else {
                                stateRestoring = true;
                               // console.log('call restoreGridState @ No cookie and No memory');
                                _getData(gridSet, refId).then(function () {
                                    gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                                    gridSet.paginationPageSize = gridSet.paginationOptions.pageSize;
                                    gridSet.gridWindowSize();
                                    stateRestoring = false;
                                });
                            }
                        }, function () {
                        });
                    } else {
                        stateRestoring = true;
                        gridSet.data = [];
                        console.log('call restoreGridState @  Memory');
                        gridCurrentState = zSrv_OAuth2.restoreInMemory($location.path() + 'GridState');
                        zSrv_OAuth2.clearInMemory($location.path() + 'GridState');

                        if (zSrv_OAuth2.isExistInMemory($location.path() + 'Paging')) {

                            gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);
                            gridSet.paginationOptions = zSrv_OAuth2.restoreInMemory($location.path() + 'Paging');
                            zSrv_OAuth2.clearInMemory($location.path() + 'Paging');
                            gridSet.enableVerticalScrollbar = gridSet.paginationOptions.enableScrollbars;
                        }
                        
                        $timeout(function () {
                            gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);
                            console.log("call saveState.restore after timeout");
                        }, 100);
                        $timeout(function () {
                            stateRestoring = false;
                            console.log("set stateRestoring to false after timeout");
                        }, 1000);
                        _getData(gridSet, refId).then(function () {
                            //gridSet.gridApi.core.notifyDataChange(grp.uiGridConstants.dataChange.COLUMN);
                            //gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);
                            gridSet.gridApi.saveState.restore(grp.ngScope, gridCurrentState);
                            gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                            gridSet.paginationPageSize = gridSet.paginationOptions.pageSize;
                            gridSet.gridWindowSize();
                            
                            //stateRestoring = false;
                            console.log('stateRestoring is ' + stateRestoring);
                        });

                    }
                };

                var _colResult = [];
                _createColumnDefs(_colResult, colFields, grp);

                var gridSet = {
                    saveFocus: false,
                    saveScroll: true,
                    saveGroupingExpandedStates: true,
                    enableSorting: true,
                    enableFiltering: true,
                    showGridFooter: true,
                    enableGridMenu: true,
                    exporterMenuCsv: true,
                    exporterMenuPdf: false,

                    enableRowSelection: enableRowSelect,
                    enableFullRowSelection: false, // enableFullRowSelect,
                    multiSelect: enableMultiSelect,

                    enableVerticalScrollbar: 1, // grp.uiGridConstants.scrollbars.NEVER,
                    paginationPageSizes: [10, 25, 50, 100, 250, 500],
                    //paginationPageSize: 10,
                    useExternalPagination: (externalPagination ? externalPagination : false),
                    useExternalSorting: (externalPagination ? externalPagination : false),
                    useExternalFiltering: (externalPagination ? externalPagination : false),
                    //columnDefs: _createColumnDefs(formData, grp),
                    columnDefs: _colResult,  //_createColumnDefs(colFields, grp),

                    gridMenuCustomItems: [
                      {
                          title: 'Filter',
                          icon: 'glyphicon glyphicon-filter',
                          action: function ($event) {
                              gridSet.enableFiltering = !gridSet.enableFiltering;
                              this.grid.api.core.notifyDataChange(grp.uiGridConstants.dataChange.COLUMN);
                          },
                          order: 1
                      },
                      {
                          title: 'Scrollbar',
                          icon: 'glyphicon glyphicon glyphicon-sort',
                          action: function ($event) {
                              gridSet.enableVerticalScrollbar = (gridSet.enableVerticalScrollbar == 0) ? 1 : 0;
                              gridSet.paginationOptions.enableScrollbars = gridSet.enableVerticalScrollbar;
                              if (gridSet.enableVerticalScrollbar == 0) {
                                  gridSet.paginationOptions.scrollPageSize = gridSet.paginationOptions.pageSize;
                                  gridSet.gridWindowSize();
                              }
                              this.grid.api.core.notifyDataChange(grp.uiGridConstants.dataChange.COLUMN);
                          },
                          order: 2
                      },
                      {
                          title: 'Save Setting',
                          icon: 'glyphicon glyphicon-save',
                          action: function ($event) {
                              _saveGridState(gridSet);
                          },
                          order: 211
                      },
                      {
                          title: 'Restore Setting',
                          icon: 'glyphicon glyphicon-open',
                          action: function ($event) {
                              _restoreGridState(gridSet);
                          },
                          order: 212
                      },
                      {
                          title: 'Clear Setting',
                          icon: 'glyphicon glyphicon-remove-circle',
                          action: function ($event) {
                              zSrv_CookieStore.remove(gridName + ':' + resourceURL);
                              zSrv_CookieStore.remove(gridName + ':' + resourceURL + 'Paging');
                              //                     grp.ngCookies.remove(grp.cookieGridState);
                              //                     grp.gridApi.saveState.restore(grp.scope, {});
                              /// Create a alert to notify user is restored successfully.
                          },
                          order: 213
                      }
                    ],

                    gridWindowSize: function () {
                        if (gridSet.enableVerticalScrollbar == 0) {
                            gridSet.gridApi.core.refresh();
                            var row_height = 38;
                            var header_height = 230; //213;
                            var psize = (gridSet.paginationOptions.pageSize > gridSet.totalItems) ? gridSet.totalItems : gridSet.paginationOptions.pageSize;
                            var height = row_height * psize + header_height;
                            //var height = row_height * gridSet.paginationPageSize + header_height;
                            $('.ui-grid').height(height);
                            gridSet.gridApi.grid.handleWindowResize();
                        } else {
                            gridSet.gridApi.core.refresh();
                            var row_height = 38;
                            var header_height = 230; //173;
                            var psize = (gridSet.paginationOptions.scrollPageSize > gridSet.totalItems) ? gridSet.totalItems : gridSet.paginationOptions.scrollPageSize;
                            var height = row_height * psize + header_height;
                            //var height = row_height * gridSet.paginationPageSize + header_height;
                            $('.ui-grid').height(height);
                            gridSet.gridApi.grid.handleWindowResize();
                        }
                    },

                    saveGridState: function() {
                        _saveGridState(gridSet);
                    },

                    restoreGridState: function () {
                        _restoreGridState(gridSet);
                    },

                    getPage: function (refId) {     //getPage ********************
                        _restoreGridState(gridSet, refId)
                        //if (zSrv_OAuth2.isExistInMemory($location.path() + 'GridState')) {

                        //    if (zSrv_OAuth2.isExistInMemory($location.path() + 'Paging')) {
                        //        gridSet.paginationOptions = zSrv_OAuth2.restoreInMemory($location.path() + 'Paging');
                        //        zSrv_OAuth2.clearInMemory($location.path() + 'Paging');

                        //    }

                        //    _getData(refId).then(function () { 
                        //        var gridState = zSrv_OAuth2.restoreInMemory($location.path() + 'GridState');
                        //        zSrv_OAuth2.clearInMemory($location.path() + 'GridState');
                        //        stateRestoring = true;
                        //        gridSet.gridApi.saveState.restore(grp.ngScope, gridState);
                        //        gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                        //        gridSet.paginationPageSize = gridSet.paginationOptions.pageSize;
                        //        gridSet.gridWindowSize();
                        //        stateRestoring = false;
                        //    });
                        //} else {
                        //    _getData(refId).then(function () {
                        //        gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                        //        gridSet.paginationPageSize = gridSet.paginationOptions.pageSize;
                        //        gridSet.gridWindowSize();
                                
                        //    });
                        //}
                       // });
                    },

                    selectedRows: [],

                    editModel: function (id) {
                        if (this.useExternalPagination == true) {
                            zSrv_OAuth2.storeInMemory($location.path() + 'Paging', this.paginationOptions);
                            zSrv_OAuth2.storeInMemory($location.path() + 'GridState', this.gridApi.saveState.save());
                        }
                        if (gridEditClickURL)
                            $location.path(gridEditClickURL + "/" + id);
                        else
                            $location.path(grp.editModelURL + "/" + id);
                    },

                    paginationOptions:  {
                        pageNumber: 1,
                        pageSize: 10, 
                        sortColumnName: '',
                        sortOrder: '',
                        filterParams: [],
                        enableScrollbars: 0,
                        scrollPageSize: 10,
                        parameters: scope.$eval(attrs.gridset).parameters,
                    },

                    isRowSelectable: function (row) {
                        return true;
                    },

                    gridApi: {},

                    onRegisterApi: function (gridApi) {
                        gridSet.gridApi = gridApi;
                        gridSet.restoreGridState();

                        gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                            if (row.isSelected == true) {
                                if (!gridSet.selectedRows["'" + row.entity[indexKey] + "'"]) {
                                    gridSet.selectedRows["'" + row.entity[indexKey] + "'"] = row.entity;
                                    gridSet.selectedRows.length++;
                                }
                            } else {
                                delete gridSet.selectedRows["'" + row.entity[indexKey] + "'"];
                                gridSet.selectedRows.length--;
                            }
                            var msg = 'No of row selected is ' + gridSet.selectedRows.length;
                            console.log(msg);
                        });

                        gridApi.selection.on.rowSelectionChangedBatch(scope, function (rows) {
                            for (var r = 0; r < rows.length; r++) {
                                var row = rows[r];
                                if (row.isSelected == true) {
                                    if (!gridSet.selectedRows["'" + row.entity[indexKey] + "'"]) {
                                        gridSet.selectedRows["'" + row.entity[indexKey] + "'"] = row.entity;
                                        gridSet.selectedRows.length++;
                                    }
                                } else {
                                    delete gridSet.selectedRows["'" + row.entity[indexKey] + "'"];
                                    gridSet.selectedRows.length--;
                                }
                            }
                            var msg = 'No of row selected is ' + gridSet.selectedRows.length;
                            console.log(msg);
                        });

                        if (gridSet['useExternalFiltering'] == true)
                            gridApi.core.on.filterChanged(scope, function () {
                                if (!stateRestoring) {
                                    var grid = this.grid;
                                    while (gridSet.paginationOptions.filterParams.length > 0)
                                        gridSet.paginationOptions.filterParams.pop();
                                    for (var c = 0; c < grid.columns.length; c++)
                                        for (var f = 0; f < grid.columns[c].filters.length; f++) {
                                            if (!grid.columns[c].filters[f].term)
                                                continue;
                                            var filterParams = {};
                                            switch (grid.columns[c].colDef.type) {
                                                case 'string':
                                                case 'number':
                                                case 'boolean':
                                               // case 'date':
                                                    filterParams.key = grid.columns[c].field;
                                                    filterParams.ops = (grid.columns[c].filters[f].condition ? String(grid.columns[c].filters[f].condition) : "==");
                                                    filterParams.value = grid.columns[c].filters[f].term;
                                                    break;
                                                case 'date':
                                                    filterParams.key = grid.columns[c].field;
                                                    filterParams.ops = (f==0 ? '32' : '128')
                                                    //filterParams.ops = (grid.columns[c].filters[f].condition ? String(grid.columns[c].filters[f].condition) : "==");
                                                    filterParams.value = grid.columns[c].filters[f].term;
                                                    break;
                                            }
                                            gridSet.paginationOptions.filterParams.push(filterParams);
                                        }
                                    console.log('call zgrid - useExternalFiltering');
                                    _getData(gridSet).then(function () {
                                        gridSet.gridWindowSize();
                                    });
                                }
                            });

                        if (gridSet['useExternalSorting'] == true)
                            gridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
                                if (!stateRestoring) {
                                    if (sortColumns.length == 0) {
                                        gridSet.paginationOptions.sortColumnName = '';
                                        gridSet.paginationOptions.sortOrder = '';
                                    } else {
                                        gridSet.paginationOptions.sortColumnName = sortColumns[0].field;
                                        gridSet.paginationOptions.sortOrder = sortColumns[0].sort.direction;
                                    }
                                    console.log('call zgrid - useExternalSorting');
                                    _getData(gridSet).then(function () {
                                        gridSet.gridWindowSize();
                                    });
                                }
                            });

                        if (gridSet['useExternalPagination'] == true) {
                            gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                                if (gridSet.paginationOptions.pageNumber != newPage || gridSet.paginationOptions.pageSize != pageSize) {
                                    gridSet.paginationOptions.pageNumber = newPage;
                                    
                                    if (gridSet.enableVerticalScrollbar == 0) {
                                        gridSet.paginationOptions.pageSize = pageSize;
                                        gridSet.paginationOptions.scrollPageSize = pageSize;
                                    } else {
                                        gridSet.paginationOptions.pageSize = pageSize;
                                    }
                                    console.log('call zgrid - useExternalPagination');
                                    _getData(gridSet).then(function () {
                                        gridSet.gridWindowSize();
                                    });
                                    //this.grid.api.core.refresh();
                                    //var row_height = 30;
                                    //var header_height = 173;
                                    //var height = row_height * pageSize + header_height;
                                    //$('.ui-grid').height(height);
                                    //this.grid.api.grid.handleWindowResize();
                                }
                            });
                        } else {
                            gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                                //gridSet.paginationCurrentPage = gridSet.paginationOptions.pageNumber;
                                console.log('call zgrid - use NON ExternalFiltering');
                                if (gridSet.enableVerticalScrollbar == 0) {
                                    gridSet.paginationOptions.pageSize = pageSize;
                                    gridSet.paginationOptions.scrollPageSize = pageSize;
                                } else {
                                    gridSet.paginationOptions.pageSize = pageSize;
                                }
                                gridSet.gridWindowSize();
                                //gridSet.gridApi.core.refresh();
                                //var row_height = 30;
                                //var header_height = 173;
                                //var psize = (pageSize > gridSet.totalItems) ? gridSet.totalItems : pageSize
                                //var height = row_height * psize + header_height;
                                //$('.ui-grid').height(height);
                                //gridSet.gridApi.grid.handleWindowResize();
                            });
                        }
                        //grp.gridDefaultState = gridApi.saveState.save();
                    },


                    //,
                    //onRegisterApi: function (gridApi) {
                    //    $scope.gridApi = gridApi;
                    //}
                };
                return gridSet;
            };

            var generateGrid = function () {
                gridName = attrs.gridname;
                gridDataSet = attrs.gridset; //scope.$eval(attrs["gridSet"]);
                
                resourceURL = scope.$eval(attrs.resourceurl);
                gridEditClickURL = scope.$eval(attrs.editclickurl);
                columnFields = scope.$eval(attrs.columnfields); //scope.$eval(attrs["columnFields"]);
                externalPagination = (attrs.externalpagination === "true");
                allowGridDataExport = (attrs.allowgriddataexport === "true");
                enableSaveGridState = (attrs.enablesavegridstate === "true");

                enableRowSelect = (attrs.enablerowselect === "true");
                enableMultiSelect = (attrs.enablemultiselect === "true");
                enableFullRowSelect = (attrs.enablefullrowselect === "true");
                indexKey = attrs.indexkey;


                var allowExport = allowGridDataExport ? allowGridDataExport : false;
                var allowSaveState = enableSaveGridState ? enableSaveGridState : false;
                var divGrid = angular.element("<div>").addClass('ui-grid').attr({
                    'ui-grid': gridDataSet,
                    'ui-grid-pagination': true,
                    'ui-grid-exporter': allowExport,
                    'ui-grid-save-state': allowSaveState,
                    'ui-grid-selection': true,
                    'ui-grid-pinning': true, 
                    'ui-grid-resize-columns': attrs.allowcolumnresize || true,
                    'ui-grid-move-columns': true,
                    'ui-grid-cellnav': true
                });
                element.html("");
                element.append(divGrid);
                $compile(element.contents())(scope);

                var group_pos = gridDataSet.indexOf('.');
                var group_name = gridDataSet.slice(0, group_pos);
                var group_var = gridDataSet.slice(group_pos + 1);
                var myGroup = scope[group_name]; //scope.$eval(gridDataSet);
                //myGrid.listGridOptions = _listGridOptions;
                //todo: hardcode gridOptions here.
                myGroup[group_var] = _listGridOptions(myGroup, columnFields);
               // $compile(element.contents())(scope);
                //myGroup.gridOptions.getPage();
                //myGroup[group_var].restoreGridState();  // inside restoreGridState will run getPage()
                //myGroup[group_var].getPage();
            }

            generateGrid();
            //var gridWatchAttr = scope.$eval(attrs.columnfields);
            //if (angular.isArray(gridWatchAttr))
            //    generateGrid();


            //scope.$watch(scope.$eval(attrs.columnfields), function (newValue, oldValue) {
            //    if(angular.isArray(newValue))
            //        generateGrid();
            //});
        },
        restrict: "E",
        replace: true
    }
}]);