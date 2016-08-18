function SalesforcePriorityCtrl ($scope, Search, client) {
	var filters = Search.getFilterQuery();
	console.log("filters: ", filters);

	client.search({
		index: "test",
		body: {
		  "query": {
				"bool": {
					"filter": filters
				}
			},
		  "size": 0,
		  "aggs": {
		    "0": {
		      "terms": {
		        "field": "SalesforcePriority",
		        "size": 4,
		        "order": {
		          "_count": "desc"
		        }
		      }
		    }
		  }
		}
	}).then(function (resp) {
		var buckets = resp.aggregations[0].buckets;
		console.log("buckets: ", resp);

		$scope.data = buckets.map(function (doc) {
			return doc.doc_count;
		});

		$scope.labels = buckets.map(function (doc) {
			return doc.key.split(' ');
		});

		$scope.colors = [
			'#fddf8b', // Medium
			'#f68d5c', // High
			'#d53f50', // Critical
			'#fbf7c1', // Low
		];
	});

	$scope.chartHover = function (e) {
		console.log("e: ", e);
	};

	$scope.priorityFilter = function (e) {
		var barName = e[0]._model.label;

		Search.addFilter('SalesforcePriority', barName.join(" "));
	};
}

app.component('priorityBar', {
	templateUrl: "/views/panels/priority-bar.html",
	controller: SalesforcePriorityCtrl
});

app.component('priorityPie', {
	templateUrl: "/views/panels/priority-pie.html",
	controller: SalesforcePriorityCtrl
});