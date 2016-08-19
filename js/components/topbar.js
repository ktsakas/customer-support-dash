app.component('topbar', {
	templateUrl: "/views/partials/topbar.html",
	controller: function ($scope, $rootScope, Search) {
		angular.extend($scope, Search);

		$scope.filters = Search.getFilters();
		$scope.hasFilters = function () {
			return Object.keys($scope.filters).length > 0;
		}

		$rootScope.$on('filterUpdate', function () {
			$scope.filters = Search.getFilters();
		});
	}
});