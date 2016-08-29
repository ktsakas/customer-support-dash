app.component('tickets', {
	templateUrl: "/views/panels/tickets-table.html",
	controller: function ($scope, $rootScope, Search, client) {
		findTickets = function () {
			console.log("query: ", JSON.stringify({
				index: index,
				body: {
					query: {
						bool: {
							filter: Search.getFilterQuery()
						}
					}
				}
			}));

			client.search({
				index: index,
				body: {
					query: {
						bool: {
							filter: Search.getFilterQuery()
						}
					}
				}
			}).then(function (resp) {
				$scope.hits = resp.hits.hits.map(function (hit) {
					hit._source.CreationDate = moment(hit._source.CreationDate).format("YYYY-MM-DD HH:ss");

					return hit;
				});
			}).catch(function (err) {
				console.log(err);
			});
		}

		$scope.filters = Search.getFilters();

		$scope.hasFilters = function () {
			return Object.keys($scope.filters).length > 0;
		};

		$scope.$on('$routeUpdate', findTickets);
		findTickets();
	}
});