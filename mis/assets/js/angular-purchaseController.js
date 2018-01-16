/* -------------------------------
 1.0 CONTROLLER - PPC Dashboard
 ------------------------------- */
app.controller('purchaseController', [
    '$scope',
    '$element',
    '$log',
    '$rootScope',
    'pendingRequests',
    'passData', function ($scope, $element, $log, $rootScope, pendingRequests, passData) {
		
	var myElements = $element;
	var $purchase_first_level_elem = '', $purchase_second_level_elem = '', $purchase_consolidate_elem = '';
    var callback = '';
    $scope.table_headers = '';
    $scope.table_headers_second = '';
    $scope.main_level_data = passData.getData();

    if ($scope.main_level_data.length === 0) {
        $rootScope.$state.go('app.dashboard');
    }
    $scope.first_panel_title = $scope.main_level_data[ 0 ].arg;


    /** START PURCHASE FIRST LEVEL PANEL
     **************************************************************** **/
    $scope.purchase_first_level_table_function = function () {
        $purchase_first_level_elem = $('.purchase_first_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#purchase_first_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "purchase_first_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'PURCHASE',
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
            idTable           : "purchase_first_level_table",
            idTable_callback  : "purchase_first_level_table",
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
    
    $scope.purchase_first_level_table_http_function = function (data) {
        $rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'purchase_all_level_table_http_function', data.arg_data).then(function successCallback(response) {
            var levelone_header = response.data.head_val;
            var array = levelone_header.split(',');            
            $scope.table_headers = array;
            $scope.hdr_count = array.length-7;
            if (response.data.status) {
                $rootScope.$timeout(function () {
                    $scope.purchase_first_level_table_function();
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
							if(v.Total_Value)
							{
								a=v.Total_Value.replace(/\,/g,''); 
							}if(v.Pending_GRN_Value)
							{
								a=v.Pending_GRN_Value.replace(/\,/g,''); 
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
                    $purchase_first_level_elem.bootstrapTable('load', $rootScope.service.put_data(levelone));
                }, 0);
                passData.clearData();
            } else {

            }

        }, function errorCallback(response) {

        });
    };
    
   
    $scope.purchase_first_level_table_document_ready = function () {
        $button = $('#resetSearch');
        $('#purchase_first_level_toolbar').find('select').change(function () {
            $purchase_first_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $purchase_first_level_elem.bootstrapTable('resetSearch');
        });
    };

    /** END PURCHASE FIRST LEVEL PANEL
     **************************************************************** **/


    /** START PURCHASE SECOND LEVEL PANEL
     **************************************************************** **/
    $scope.purchase_second_level_panel_front_show = false;
    $('.purchase_first_level_table').on('click-row.bs.table', function (e, arg1, arg2) {
        $scope.$apply(function () {
            var leveltwodata = [];
            var Set2 = [];
			$.grep($scope.leveltwo, function (v, i) {
				if (arg1.link_id === v.link_id ) {
					if(v.Total_Value){
						b=v.Total_Value.replace(/\,/g,''); 
					}
					if(v.Pending_GRN_Value)
					{
						b=v.Pending_GRN_Value.replace(/\,/g,''); 
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
            $scope.purchase_second_level_panel_front_show = true;            
            $rootScope.$timeout(function(){
				$purchase_second_level_elem = myElements.find('.purchase_second_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#purchase_second_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "purchase_second_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'PURCHASE',
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
            idTable           : "purchase_second_level_table",
            idTable_callback  : "purchase_second_level_table",
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
				$purchase_second_level_elem.bootstrapTable('load', $rootScope.service.put_data(leveltwodata));
			},0)
            
        });

    });

    $scope.purchase_second_level_table_document_ready = function () {
        $button = $('#purchase_second_level_resetSearch');
        $('#purchase_second_level_toolbar').find('select').change(function () {
            $purchase_second_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $purchase_second_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END PURCHASE SECOND LEVEL PANEL
     **************************************************************** **/


    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
            if ($scope.main_level_data.length >= 1) {
                var data = {
                    arg_data: $scope.main_level_data[ 0 ].arg
                };
                
                $scope.purchase_first_level_table_http_function(data);
            }
            $scope.purchase_first_level_table_document_ready();

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
    if (a === 'purchase_first_level_table') {
        $(b).find("input[name*='_date']").datepicker({
            format: 'dd/mm/yyyy'
        });
    }
};
