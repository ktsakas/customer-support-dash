app.component('topbar', {
	templateUrl: "/views/partials/topbar.html",
	controller: function ($scope, $rootScope, Search) {
		angular.extend($scope, Search);

		$scope.filters = Search.getFilters();
		console.log("got filters: ", $scope.filters);

		$scope.hasFilters = function () {
			return Object.keys($scope.filters).length > 0;
		}

		$scope.$on('$routeUpdate', function () {
			$scope.filters = Search.getFilters();
		});
	}
});