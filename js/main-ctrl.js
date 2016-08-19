app.controller('MainCtrl', function ($routeParams, Search, $scope) {
	$scope.$on('$routeUpdate', function () {
		Search.setFilters($routeParams);
	});

	console.log("init query: ", Search.getQueryObj());

	$scope.customer = $routeParams.customer;
});