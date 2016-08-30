app.component('tiles', {
	templateUrl: "/views/partials/tiles.html",
	controller: function ($scope, $rootScope, Search) {
		angular.extend($scope, Search);

		function showStats() {
			var customerFilter = Search.hasFilter("Customer") ? Search.decodeFilter("Customer", Search.getFilter("Customer")) : [],
				customerTicketCountQuery = !customerFilter.length ? {} : {
					query: {
						bool: {
							filter: Search.getQueryForFields(["Customer"])
						}
					}
				};

			Search
				.count(customerTicketCountQuery)
				.then(function (resp) {
					$scope.matchingCount = resp.count;
				});

			var avgDaysToResolvedQuery = {
				"query": {
					"bool": {
						"filter": Search.getQueryForFields(["Customer"]).concat({ "match": { "Status": "Resolved" } })
					}
				},
				"size": 0,
				"aggs": {
					"avgDaysToResolved": {
						"avg": {
							"script": "(doc['Entered'].value - doc['CreationDate'].value)/(24*60*60*1000) * 1.0"
						}
					}
				}
			};

			Search
				.query(avgDaysToResolvedQuery)
				.then(function (resp) {
					$scope.avgDaysToResolved = resp.aggregations["avgDaysToResolved"].value;
				});
		}

		$scope.$on('$routeUpdate', showStats);
		showStats();
	}
});