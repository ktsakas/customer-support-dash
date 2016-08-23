app.component('regions', {
	templateUrl: "/views/panels/regions.html",
	controller: function ($scope, Search) {
		angular.extend($scope, Search);

		function showRegions() {
			Search.query({
				"query": {
					"bool": {
						"filter": Search.getFilterQuery("Region")
					}
				},
				  "size": 0,
				  "aggs": {
				    "0": {
				      "terms": {
				        "field": "Region",
				        "order": {
				          "_count": "desc"
				        }
				      }
				    }
				  }
			}).then(function (resp) {
				$scope.regions = resp.aggregations[0].buckets;
			});
		}

		showRegions();
		$scope.$on('$routeUpdate', showRegions);
	}
});