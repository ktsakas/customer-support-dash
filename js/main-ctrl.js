app.controller('MainCtrl', function ($routeParams, Search, $scope) {
	$scope.$on('$routeUpdate', function () {
		Search.setFilters($routeParams);

		console.log(Search.getFilters());
	});

	$scope.customer = $routeParams.customer;
});