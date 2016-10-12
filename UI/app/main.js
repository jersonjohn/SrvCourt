require.config({
    baseUrl: '/Scripts/app',
    urlArgs: "vi=" + (new Date()).getTime(),
    paths: {
        'routeResolver': 'services/routeResolver',
        'appControllersDirectory': 'Scripts/app/controllers'
        //'codemirror': '/Scripts/library/codemirror/lib/codemirror',
        //'javascriptCodemirror': '/Scripts/library/codemirror/mode/javascript/javascript',
        //'uiCodemirror': '/Scripts/library/codemirror/ui-codemirror.min',
        //'uglify': '/Scripts/library/uglify2/uglify.min'
    }
});

require(
    [
        'app',
        'routeResolver',
    ],
    function () {
        //var mvc5Model = window.location.search.substring(1).split('&');
        angular.bootstrap(document, ['amesApp']);
        
    });