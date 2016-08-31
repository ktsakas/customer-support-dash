app.component('sidebar', {
	templateUrl: "/views/partials/sidebar.html",
	controller: function ($routeParams, $scope, Search, client) {
		angular.extend($scope, Search);

		client.search({
			index: index,
			body: {
				"size": 0,
				"aggs": {
					"customers": {
						"terms": {
							"field": "Customer",
							"order": { "_term": "asc" }
						}
					},
					"customerGroups": {
						"terms": {
							"field": "CustomerGroup",
							"order": { "_term": "asc" }
						}
					}
				}
			}
		}).then(function (resp) {
			$scope.customers = resp.aggregations["customers"].buckets;
			$scope.customerGroups = resp.aggregations["customerGroups"].buckets;
		});
	}
});