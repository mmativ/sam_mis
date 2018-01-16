/* -------------------------------
 1.0 CONTROLLER - MD Dashboard
 ------------------------------- */
app.controller('followupController', [
    '$scope',
    '$element',
    '$log',
    '$rootScope',
    'pendingRequests',
    'passData', function ($scope, $element, $log, $rootScope, pendingRequests, passData) {
		
	var myElements = $element;
	var $followup_first_level_elem = '';
    var callback = '';
    $scope.table_headers = '';



    /** START FOLLOWUP FIRST LEVEL PANEL
     **************************************************************** **/
    $scope.followup_first_level_table_function = function () {
        $followup_first_level_elem = $('.followup_first_level_table').bootstrapTable({
            pagination        : false,
            search            : true,
            showColumns       : true,
            showExport        : false,
			height:450,
            toolbar           : '#followup_first_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "followup_first_level_table",
            keyEvents         : true,
			fixedColumns: true,
            fixedNumber: 3,
            exportOptions     : {
                fileName    : 'FOLLOWUP',
                excelstyles : [ 'border-bottom' ],
                ignoreColumn: [ 'columnheader' ],
                jspdf       : {
                    orientation: 'l',
                    format     : 'a4',
                    autotable  : {
                        theme             : 'grid',
                        styles            : {
                            fontSize: 8,
                            overflow: 'linebreak'
                        },
                        headerStyles      : {
                            rowHeight: 20,
                            fillColor: [ 52, 73, 94 ],
                            textColor: 255,
                            fontStyle: 'bold',
                            halign   : 'center',
                        },
                        alternateRowStyles: {
                            fillColor: [ 226, 231, 235 ]
                        }
                    }
                }
            },
            reorderableColumns: true,
            advancedSearch    : true,
            idTable           : "followup_first_level_table",
            idTable_callback  : "followup_first_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [ 
                {
                    visible   : false,
                    switchable: false
                },{
                    visible   : false,
                    switchable: false
                },
                {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                } ]
          

        });
    };
    
    $scope.followup_first_level_table_http_function = function (data) {
        $rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'followup_all_level_table_http_function', data.arg_data).then(function successCallback(response) {
            var levelone_header = response.data.head_val;
            var array = levelone_header.split(',');            
            $scope.table_headers = array;
            $scope.hdr_count = array.length-7;
            if (response.data.status) {
                $rootScope.$timeout(function () {
                    $scope.followup_first_level_table_function();
                    if(response.data.key)
                    {
						$scope.AllData = response.data.key
					}					
                    var levelone = [];
                    $.grep($scope.AllData, function (v, i) {                       
                        levelone.push(v);
                        return true;                       
                    });
                    //console.log(levelone);
                    $followup_first_level_elem.bootstrapTable('load', $rootScope.service.put_data(levelone));
                }, 0);
                passData.clearData();
            } else {

            }

        }, function errorCallback(response) {

        });
    };
    
   
    $scope.followup_first_level_table_document_ready = function () {
        $button = $('#resetSearch');
        $followup_first_level_excel_download = $('#followup_first_level_excel_download');
        $('#followup_first_level_toolbar').find('select').change(function () {
            $followup_first_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $followup_first_level_elem.bootstrapTable('resetSearch');
        });
		
        $followup_first_level_excel_download.click(function () {
            $('#followup_first_level_table').tableExport({
				fileName: "sFileName",
				type: 'excel',                        
			});
        });
    };

    /** END FOLLOWUP FIRST LEVEL PANEL
     **************************************************************** **/

    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
            
            $scope.followup_first_level_table_http_function('');
            
            $scope.followup_first_level_table_document_ready();

        }, 0);
    });
    /** END DOCUMENT READY
     **************************************************************** **/
}]);

function snoFormatter(value, row, index) {
    return 1 + index;
}

var advance_search_call_back = function (a, b) {
    "use strict";
    if (a === 'followup_first_level_table') {
        $(b).find("input[name*='_date']").datepicker({
            format: 'dd/mm/yyyy'
        });
    }
};
