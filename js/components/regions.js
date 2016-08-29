app.component('regions', {
	templateUrl: "/views/panels/regions.html",
	controller: function ($scope, Search) {
		angular.extend($scope, Search);

		function showRegions() {
			var queryObj = {
				size: 0,
				aggs: {
					regions: {
						terms: {
							field: "Region",
							order: {
								_count: "desc"
							}
						}
					}
				}
			};

			var timeframeFilter = Search.getFilter("Timeframe");
			if (timeframeFilter) {
				timeframeFilter = Search.decodeFilter("Timeframe", timeframeFilter);

				queryObj.query = { bool: { filter: timeframeFilter } };
			}

			Search
				.query(queryObj)
				.then(function (resp) {
					$scope.regions = resp.aggregations["regions"].buckets;
				});
		}

		showRegions();
		$scope.$on('$routeUpdate', showRegions);
	}
});