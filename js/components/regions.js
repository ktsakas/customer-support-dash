app.component('regions', {
	templateUrl: "/views/panels/regions.html",
	controller: function ($scope, Search, client) {
		angular.extend($scope, Search);

		client.search({
			index: "test",
			body: {
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
				        "size": 5,
				        "order": {
				          "_count": "desc"
				        }
				      }
				    }
				  }
				}
		}).then(function (resp) {
			$scope.regions = resp.aggregations[0].buckets;
		});
	}
});