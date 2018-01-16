app.factory('factory', ['$rootScope', function ($rootScope) {
    var factory = {};
    factory.checksession = function () {
        if($rootScope.setting.login.remember){
            if (typeof($rootScope.$localStorage.user) !== 'undefined') {
                $rootScope.$timeout(function () {
                    //$rootScope.$state.go('app.dashboard');
                },0)
            } else {
                if (Cookies.get('username') !== undefined)
                    $rootScope.$state.go('member.login.v3');
                else
                    $rootScope.$state.go('member.login.v3');
            }
        }else{
            if (typeof($rootScope.$sessionStorage.user) !== 'undefined') {
                $rootScope.$timeout(function () {
                    //$rootScope.$state.go('app.dashboard');
                },0)
            } else {
                if (Cookies.get('username') !== undefined)
                    $rootScope.$state.go('member.login.v3');
                else
                    $rootScope.$state.go('member.login.v3');
            }
        }

    };

    return factory;
}]);
