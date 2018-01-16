/* -------------------------------
 1.0 CONTROLLER - PPC Dashboard
 ------------------------------- */
app.controller('permissionController', [
    '$scope',
    '$element',
    '$log',
    '$rootScope',
    'pendingRequests',
    'passData', function ($scope, $element, $log, $rootScope, pendingRequests, passData) {
        var vm = this;
        vm.myElements = $element;

        vm.treeInitilize = treeInitilize();
        vm.checkboxStyle = "checkbox checkbox-inline checkbox-primary";
        console.log(vm);

        //~ function treeInitilize() {
            //~ $rootScope.$http.get($rootScope.setting.constant.data + 'permission.json').success(function (data) {
                //~ vm.permission_data = data.data;
                //~ $rootScope.$timeout(function () {
                    //~ angular.element(document).ready(function () {
                        //~ $("#treeview").hummingbird();
                    //~ });
                //~ }, 0);
            //~ });
        //~ }
        
        function treeInitilize() {
            $rootScope.$http.get($rootScope.setting.constant.ajaxurl + 'user_lists').success(function (data) {
                vm.permission_data = data.key;
                vm.permission_datamod = data.key_mod;
                var permission_title = [];
                angular.forEach(vm.permission_datamod, function(value, key){
					permission_title.push(value);
					return true;	
				});
				vm.permission_title = permission_title;
				
                $rootScope.$timeout(function () {
                    angular.element(document).ready(function () {
                        $("#treeview").hummingbird();
                    });
                }, 0);
            });
        }
        
        $scope.saveData = function() {
			var user_id = angular.element('#user_id').val();
			vm.albumNameArray = [];
			  angular.forEach(vm.permission_title, function(permission){
				if (!!permission.selected) 
				{
					vm.albumNameArray.push(permission.moduleid);
				}
					//console.log(permission.subtitle);
					angular.forEach(permission.subtitle, function(permission_sub){
					
					if (!!permission_sub.selected) 
					{
						//console.log(permission_sub.display_name);
						vm.albumNameArray.push(permission_sub.module_id);
					}
				  })
			  })
			  
			  $rootScope.$http({
				method: 'POST',
				url   : $rootScope.setting.constant.ajaxurl + 'save_user_lists',
				data  : {module_list : vm.albumNameArray, user_id : user_id}
				}).then(function successCallback(response) {
				
			}, function errorCallback(response) {
				
				});
			 
		}


    } ]);
