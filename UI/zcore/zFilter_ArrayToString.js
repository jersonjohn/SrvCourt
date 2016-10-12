angular.module("zFilter_ArrayToString", [])

.filter("arrayToString", function () {

    return function (items, itemFieldName) {
        //var lookUp = function (id) {
            //var lookUpList = [{ "id": "cd75e906-fe23-4432-ad75-27abd479be0e", "label": "Admin" }, { "id": "a8b6ccc8-0fc1-4a05-aa52-15f054d4ad71", "label": "Guest" }, { "id": "ca4a22ab-144a-4fdf-a8bb-2a0cf63f954f", "label": "SuperAdmin" }, { "id": "519cf314-bcce-42f7-b3f3-21f93046a8de", "label": "User" }];
            //for (j = 0; j < lookUpList.length; j++) {
            //    if (id == lookUpList[j][lookUpFieldName]) {
            //        return lookUpList[j][lookUpResultFieldName];
            //    }
            //}
        //}
        var resultStr = "";

        if (items) {
            for (i = 0; i < items.length; i++) {
                //resultStr = resultStr + lookUp(items[i][itemFieldName]);
                var str = items[i][itemFieldName];
                resultStr = resultStr + str.slice(str.indexOf("~") + 1)
                resultStr = resultStr + ((i < items.length - 1) ? ', ' : '')
            };

        }
        if (resultStr == "") resultStr = "None selected";
        return resultStr;
    }
});