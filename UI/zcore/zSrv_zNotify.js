angular.module("zSrv_zNotify", [])
.service("zSrv_zNotify", ['$http', '$q', '$rootScope', 'zSrv_OAuth2', function ($http, $q, $rootScope, zSrv_OAuth2) {

    var sF = {};

    // Stack directions/positions array
    var Stacks = {
        stack_top_right: {
            "dir1": "down",
            "dir2": "left",
            "push": "top",
            "spacing1": 10,
            "spacing2": 10
        },
        stack_top_left: {
            "dir1": "down",
            "dir2": "right",
            "push": "top",
            "spacing1": 10,
            "spacing2": 10
        },
        stack_bottom_left: {
            "dir1": "right",
            "dir2": "up",
            "push": "top",
            "spacing1": 10,
            "spacing2": 10
        },
        stack_bottom_right: {
            "dir1": "left",
            "dir2": "up",
            "push": "top",
            "spacing1": 10,
            "spacing2": 10
        },
        stack_bar_top: {
            "dir1": "down",
            "dir2": "right",
            "push": "top",
            "spacing1": 0,
            "spacing2": 0
        },
        stack_bar_bottom: {
            "dir1": "up",
            "dir2": "right",
            "spacing1": 0,
            "spacing2": 0
        },
        stack_context: {
            "dir1": "down",
            "dir2": "left",
            "context": $("#stack-context")
        }
    };

 
    // Change width if fullwidth on
    function _findWidth(s) {
        if (s == "stack_bar_top") {
            return "100%";
        }
        if (s == "stack_bar_bottom") {
            return "70%";
        } else {
            return "290px";
        }
    }


    var _note = function (noteStyle, title, text, noteShadow, noteOpacity, noteStack, noteDelay) {

        // Define var if not defined yet
        noteStyle = noteStyle ? noteStyle : "success";  //dark, primary, success, info, warning, danger, alert, system    
        noteStack = noteStack ? noteStack : "stack_top_right";
        noteOpacity = noteOpacity ? noteOpacity : "1";  //0.75, 1
        noteShadow = noteShadow ? noteShadow : "true";
        noteDelay = noteDelay ? noteDelay : 3000;

        // Create new Notification
        new PNotify({
            title: title,
            text: text,
            shadow: noteShadow,
            opacity: noteOpacity,
            addclass: noteStack,
            type: noteStyle,
            stack: Stacks[noteStack],
            width: _findWidth(noteStack),
            delay: noteDelay
        });

    }


    sF.note = _note;
   

    return sF;

}]);