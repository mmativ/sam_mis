/* Global Setting
 ------------------------------------------------ */
app.factory('setting', [ '$rootScope', '$location', function ($rootScope, $location) {
    var setting = {
        constant: {
            name         : "SAM MIS",
            tag          : "SAM MIS Reports",
            version      : "0.1",
            url          : "",
            panel_color  : "panel panel-inverse",
            button       : "btn btn-primary btn-sm ",
            primary_color: "btn-primary",
            label_color  : "primary",
            loading_bar  : "loading_bar_bottom", //loading_bar_bottom, loading_bar_top
            base_url     : $location.$$absUrl.split("#")[ 0 ],
            image_url    : $location.$$absUrl.split("#")[ 0 ] + 'assets/img/',
            css          : $location.$$absUrl.split("#")[ 0 ] + 'assets/css/',
            js           : $location.$$absUrl.split("#")[ 0 ] + 'assets/js/',
            plugins      : $location.$$absUrl.split("#")[ 0 ] + 'assets/plugins/',
            data         : $location.$$absUrl.split("#")[ 0 ] + 'data/',
            //ajaxurl      : $location.$$absUrl.split("#")[ 0 ] + 'php/CRMDashboard/',
            ajaxurl      : 'http://10.100.9.33/sam_mis/mis/php/CRMDashboard/',

        },
        layout  : {
            pageSidebarMinified   : false,
            pageFixedFooter       : false,
            pageRightSidebar      : false,
            pageTwoSidebar        : false,
            pageTopMenu           : true,
            pageWithoutSidebar    : true,
            pageBoxedLayout       : false,
            pageContentFullHeight : false,
            pageContentFullWidth  : false,
            pageContentInverseMode: false,
            pageSidebarTransparent: false,
            pageWithFooter        : true,
            pageLightSidebar      : false,
            pageMegaMenu          : false,
            pageBgWhite           : false,
            pageWithoutHeader     : false,
            paceTop               : false,
            notification          : false
        },
        login   : {
            remember: ''
        }

    };
    return setting;
} ]);
