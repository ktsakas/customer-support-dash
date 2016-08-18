app.component('topbar', {
	templateUrl: "/views/partials/topbar.html",
	controller: function ($scope, $rootScope, Search) {
		angular.extend($scope, Search);

		$scope.filters = Search.getFilters();

		$rootScope.$on('filterUpdate', function () {
			$scope.filters = Search.getFilters();
		});
	}
});