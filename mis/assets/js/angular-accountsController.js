/* -------------------------------
 1.0 CONTROLLER - ACCOUNTS Dashboard
 ------------------------------- */
app.controller('accountsController', [
    '$scope',
    '$element',
    '$log',
    '$rootScope',
    'pendingRequests',
    'passData', function ($scope, $element, $log, $rootScope, pendingRequests, passData) {
		
	var myElements = $element;
	var $accounts_first_level_elem = '', $accounts_second_level_elem = '', $accounts_consolidate_elem = '';
    var callback = '';
    $scope.table_headers = '';
    $scope.table_headers_second = '';
    $scope.main_level_data = passData.getData();

    if ($scope.main_level_data.length === 0) {
        $rootScope.$state.go('app.dashboard');
    }
    $scope.first_panel_title = $scope.main_level_data[ 0 ].arg;


    /** START ACCOUNTS FIRST LEVEL PANEL
     **************************************************************** **/
    $scope.accounts_first_level_table_function = function () {
        $accounts_first_level_elem = $('.accounts_first_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#accounts_first_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "accounts_first_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'accounts',
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
            idTable           : "accounts_first_level_table",
            idTable_callback  : "accounts_first_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [ 
                {
                    checkbox: true,
                    sortable: false
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
                }, {
                    visible   : false,
                    switchable: false
                } ]
          

        });
    };
    
    $scope.accounts_first_level_table_http_function = function (data) {
        $rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'accounts_all_level_table_http_function', data.arg_data).then(function successCallback(response) {
			console.log(response.data);
            var levelone_header = response.data.head_val;
            var array = levelone_header.split(',');            
            $scope.table_headers = array;
            $scope.hdr_count = array.length-7;
            if (response.data.status) {
                $rootScope.$timeout(function () {
                    $scope.accounts_first_level_table_function();
                    
                    if(response.data.key)
                    {
						$scope.AllData = response.data.key
					}
					
                    var levelone = [];
                    var total = 0;
                    var Set1 = [];
                    $scope.leveltwo = [];
                    $.grep($scope.AllData, function (v, i) {
                        if (v.level_id === '1') {
							if(v.Total_Value != null)
							{
								a=v.Total_Value.replace(/\,/g,''); 
							}else{
								a=0;
							}
							Set1.push(parseInt(a));
                            levelone.push(v);
                            return true;
                        }
                        if (v.level_id === '2') {
							
                            $scope.leveltwo.push(v);
                            return true;
                        }
                    });
                    $scope.total = Set1.reduce((p,c) => p + c);
                    $accounts_first_level_elem.bootstrapTable('load', $rootScope.service.put_data(levelone));
                }, 0);
                passData.clearData();
            } else {

            }

        }, function errorCallback(response) {

        });
    };
    
   
    $scope.accounts_first_level_table_document_ready = function () {
        $button = $('#resetSearch');
        $('#accounts_first_level_toolbar').find('select').change(function () {
            $accounts_first_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $accounts_first_level_elem.bootstrapTable('resetSearch');
        });
    };

    /** END ACCOUNTS FIRST LEVEL PANEL
     **************************************************************** **/


    /** START ACCOUNTS SECOND LEVEL PANEL
     **************************************************************** **/
    $scope.accounts_second_level_panel_front_show = false;
    $('.accounts_first_level_table').on('click-row.bs.table', function (e, arg1, arg2) {
        $scope.$apply(function () {
            var leveltwodata = [];
            var Set2 = [];
			$.grep($scope.leveltwo, function (v, i) {
				if (arg1.link_id === v.link_id ) {
					if(v.Total_Value != null){
						b=v.Total_Value.replace(/\,/g,''); 
					}
					else{
						b=0;
					}
					Set2.push(parseInt(b));
					leveltwodata.push(v);
					return true;
				}
			});
			$scope.total2 = Set2.reduce((p,c) => p + c);
            $scope.second_panel_title = arg1;
            var leveltwodata_header = leveltwodata[0].columnheader_test;
            var array_2nd = leveltwodata_header.split(',');           
            $scope.table_headers_second = array_2nd; 
            $scope.hdr2_count = array_2nd.length-7;           
            $scope.accounts_second_level_panel_front_show = true;            
            $rootScope.$timeout(function(){
				$accounts_second_level_elem = myElements.find('.accounts_second_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#accounts_second_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "accounts_second_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'accounts',
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
            idTable           : "accounts_second_level_table",
            idTable_callback  : "accounts_second_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [
				{
                    checkbox: true,
                    sortable: false
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
                }, {
                    visible   : false,
                    switchable: false
                }
                
                 ]
          

        });
				$accounts_second_level_elem.bootstrapTable('load', $rootScope.service.put_data(leveltwodata));
			},0)
            
        });

    });

    $scope.accounts_second_level_table_document_ready = function () {
        $button = $('#accounts_second_level_resetSearch');
        $('#accounts_second_level_toolbar').find('select').change(function () {
            $accounts_second_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $accounts_second_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END ACCOUNTS SECOND LEVEL PANEL
     **************************************************************** **/


    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
            if ($scope.main_level_data.length >= 1) {
                var data = {
                    arg_data: $scope.main_level_data[ 0 ].arg
                };
                
                $scope.accounts_first_level_table_http_function(data);
            }
            $scope.accounts_first_level_table_document_ready();

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
    if (a === 'accounts_first_level_table') {
        $(b).find("input[name*='_date']").datepicker({
            format: 'dd/mm/yyyy'
        });
    }
};
