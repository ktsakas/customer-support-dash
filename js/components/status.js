function StatusCtrl ($scope, Search, client) {
	var filters = Search.getFilterQuery();

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
		        "field": "Status",
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

		$scope.data = buckets.map(function (doc) {
			return doc.doc_count;
		});

		$scope.labels = buckets.map(function (doc) {
			return doc.key;
		});

		$scope.colors = [
			'#97bbcd',
			'#61bc67',
			'#f7464a',
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

app.component('statusPie', {
	templateUrl: "/views/panels/status-pie.html",
	controller: StatusCtrl
});

app.component('statusBar', {
	templateUrl: "/views/panels/status-bar.html",
	controller: StatusCtrl
});