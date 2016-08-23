app.component('tiles', {
	templateUrl: "/views/partials/tiles.html",
	controller: function ($scope, $rootScope, Search) {
		angular.extend($scope, Search);

		console.log("tiles query: ", JSON.stringify({
			bool: {
				filter: Search.getFilterQuery()
			}
		}));

		function showTickets() {
			Search.count({
				query: {
					bool: {
						filter: Search.getFilterQuery()
					}
				}
			}).then(function (resp) {
				$scope.matchingCount = resp.count;
			});
		}

		$scope.$on('$routeUpdate', showTickets);
		showTickets();
	}
});