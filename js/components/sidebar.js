app.component('sidebar', {
	templateUrl: "/views/partials/sidebar.html",
	controller: function ($routeParams, $scope, $http, Search, client) {
		angular.extend($scope, Search);

		$http.get('/js/focus-customers.json').then(function(res) {
			$scope.focusCustomers = res.data;                
		});

		client.search({
			index: index,
			body: {
				"size": 0,
				"aggs": {
					"0": {
						"terms": {
							"field": "Customer",
							"order": { "_term": "asc" }
						}
					}
				}
			}
		}).then(function (resp) {
			$scope.customers = resp.aggregations[0].buckets;
		});
	}
});