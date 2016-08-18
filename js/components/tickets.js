app.component('tickets', {
	templateUrl: "/views/panels/tickets-table.html",
	controller: function ($scope, $rootScope, Search, client) {
		findTickets = function () {
			console.log("query: ", JSON.stringify({
				index: "test",
				body: {
					query: {
						bool: {
							filter: Search.getFilterQuery()
						}
					}
				}
			}));

			client.search({
				index: "test",
				body: {
					query: {
						bool: {
							filter: Search.getFilterQuery()
						}
					}
				}
			}).then(function (resp) {
				console.log(resp.hits.hits);
				$scope.hits = resp.hits.hits;
			}).catch(function (err) {
				console.log(err);
			});
		}

		// console.log("search: ", Search.getFilters());

		$rootScope.$on('filterUpdate', function () {
			findTickets();
		});

		findTickets();
	}
});