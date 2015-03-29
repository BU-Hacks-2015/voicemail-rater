var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate']);

animateApp.config(function($routeProvider) {
    $routeProvider
    	.when('/0', {
    		templateUrl: 'page-0.html',
            controller: '0Controller'
    	})
    	.when('/1', {
    		templateUrl: 'page-1.html',
            controller: '1Controller'
    	})
    	.when('/2', {
    		templateUrl: 'page-2.html',
            controller: '2Controller'
    	})
		
		.when('/3', {
    		templateUrl: 'page-3.html',
            controller: '3Controller'
    	})
    	.when('/4', {
    		templateUrl: 'page-4.html',
            controller: '4Controller'
    	})
		
		.when('/5', {
    		templateUrl: 'page-5.html',
            controller: '5Controller'
    	})
    	.when('/6', {
    		templateUrl: 'page-6.html',
            controller: '6Controller'
    	});

});

animateApp.controller('0Controller', function($scope) {
    $scope.pageClass = 'page-0';
});

animateApp.controller('1Controller', function($scope) {
    $scope.pageClass = 'page-1';
});

animateApp.controller('2Controller', function($scope) {
    $scope.pageClass = 'page-2';
});

animateApp.controller('3Controller', function($scope) {
    $scope.pageClass = 'page-3';
});

animateApp.controller('4Controller', function($scope) {
    $scope.pageClass = 'page-4';
});

animateApp.controller('5Controller', function($scope) {
    $scope.pageClass = 'page-5';
});

animateApp.controller('6Controller', function($scope) {
    $scope.pageClass = 'page-6';
});