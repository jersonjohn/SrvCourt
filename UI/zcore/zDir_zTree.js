angular.module("zDir_zTree", [])
.directive("ztree", ["$compile", "$rootScope", "$timeout", function ($compile, $rootScope, $timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.group.toggleNodes = function (scope) {
                scope.toggle();
            };

            scope.group.removeNode = function (scope) {
                scope.remove();
                if (scope.group.removedNode)
                    scope.group.removedNode(scope);
            };

            var _getRootNodesScope = function () {
                return angular.element(document.getElementById("tree-root")).scope();
            };


            scope.group.treeNodesCollapseAll = function () {
                var t = _getRootNodesScope();
                t.collapseAll();
            };

            scope.group.treeNodesExpandAll = function () {
                var t = _getRootNodesScope();
                t.expandAll();
            };

            //scope.group.nodeAccept = function (sourceNodeScope, destNodesScope, destIndex) { };
            //scope.group.beforeDrag = function (sourceNodeScope) { };
            //scope.group.removedNode = function (node) { };
            //scope.group.droppedNode = function (event) { };

            scope.group.treeOptions = {
                //Check if the current dragging node can be dropped in the ui-tree-nodes
                //Return true if allow otherwise false
                accept: function (sourceNodeScope, destNodesScope, destIndex) {
                    if (scope.group.nodeAccept)
                        scope.group.nodeAccept(sourceNodeScope, destNodesScope, destIndex);
                    else return true;
                },

                //Check if the current selected node can be dragged
                //Return true if allow otherwise false
                beforeDrag: function (sourceNodeScope) {
                    if (scope.group.beforeDrag)
                        scope.group.beforeDrag(sourceNodeScope);
                    else return true;
                },

                //If a node is removed, the removed callback will be called
                removed: function (node) {
                    if (scope.group.removedNode)
                        scope.group.removedNode(node);
                },

                //If a node moves it's position after dropped, the nodeDropped callback will be called
                dropped: function (event) {
                    if (scope.group.droppedNode)
                        scope.group.droppedNode(event);
                }
            }

            var generateTree = function () {

                var isAllowDragDrop = attrs['allowdragdrop'];
                var model = attrs['model'];
                var renderView = attrs['renderview'] || 'nodes_render';
                var renderViewPath = '/Templates/ui_tree/' + renderView + '.html';

                
                var str_data_nodrag = "";
                var flag_nodrop = false;
                if (!isAllowDragDrop) {
                    str_data_nodrag = "data-nodrag";
                    flag_nodrop = true
                }
                var divTree = angular.element("<div>");
                //switch(nodes.toLowerCase()) {
                //    case 'nodes':
                divTree.html(
                    '<div ui-tree="group.treeOptions" id="tree-root" data-nodrop-enabled="' + flag_nodrop + '">' +
                        '<ol ui-tree-nodes  ng-model="' + model + '">' +
                            '<li ng-repeat="(key, node) in ' + model + '" ui-tree-node ' + str_data_nodrag + ' ng-include="\'' + renderViewPath + '\'"></li>' +
                        '</ol>' +
                    '</div>'
                );
                //        break;
                //    case 'value':
                //        divTree.html(
                //            '<div ui-tree id="tree-root" data-nodrop-enabled="' + flag_nodrop + '">' +
                //                '<ol ui-tree-nodes  ng-model="' + model + '">' +
                //                    '<li ng-repeat="node in ' + model + '" ui-tree-node ' + str_data_nodrag + ' ng-include="\'/Templates/ui_tree/nodes_value_render.html\'"></li>' +
                //                '</ol>' +
                //            '</div>'
                //        );
                //        break;
                //}

                element.append(divTree);
                $compile(element.contents())(scope);
            }

            //$rootScope.$watch('refreshImage', function (newValue, oldValue) {
            //    if (newValue == true)
                    generateTree();
            //});

        },
        restrict: "E",
        replace: true
    }
}]);