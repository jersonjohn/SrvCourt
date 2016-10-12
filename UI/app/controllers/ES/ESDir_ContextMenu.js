angular.module("zDir_ContextMenu", [])
.directive("contextMenu", ['$compile', function ($compile) {
    contextMenu = {};
    contextMenu.restrict = "AE";
    contextMenu.link = function (lScope, lElem, lAttr) {
        lElem.on("contextmenu", function (e) {
            e.preventDefault(); // default context menu is disabled
            //  The customized context menu is defined in the main controller. To function the ng-click functions the, contextmenu HTML should be compiled.
            lElem.append($compile(lScope[lAttr.contextMenu])(lScope));
            // The location of the context menu is defined on the click position and the click position is catched by the right click event.
            $("#contextmenu-node").css("left", e.clientX);
            $("#contextmenu-node").css("top", e.clientY);
        });
        lElem.on("mouseleave", function (e) {
            console.log("Leaved the div");
            // on mouse leave, the context menu is removed.
            if ($("#contextmenu-node"))
                $("#contextmenu-node").remove();
        });
    };
    return contextMenu;
}]);
