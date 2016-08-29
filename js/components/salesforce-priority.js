function SalesforcePriorityCtrl ($scope, Search, client) {
	var activeColor = "#2A3F54";
	var colors = {
		low: '#fbf7c1',
		medium: '#fddf8b',
		high: '#f68d5c',
		critical: '#d53f50'
	};

	function setColors() {
		$scope.colors = $scope.labels.map(function (label) {
			return Search.hasFilter('SalesforcePriority', label) ? activeColor : colors[ label.toLowerCase() ];
		});

		$scope.dataset = {
			hoverBackgroundColor: $scope.labels.map(function (label) {
				return Search.hasFilter('SalesforcePriority', label) ? colors[ label.toLowerCase() ] : activeColor;
			})
		};
	}

	var queryObj = {
		size: 0,
		aggs: {
			salesforcePriorities: {
				terms: {
					field: "SalesforcePriority",
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

	console.log("priority query: ", JSON.stringify(queryObj));

	Search
		.query(queryObj)
		.then(function (resp) {
			console.log("priority resp: ", resp);

			var buckets = resp.aggregations["salesforcePriorities"].buckets;

			$scope.data = buckets.map(function (doc) {
				return doc.doc_count;
			});

			$scope.labels = buckets.map(function (doc) {
				return doc.key;
			});

			setColors();
		});

	$scope.$on('$routeUpdate', setColors);

	$scope.chartHoverPointer = function (e, mE) {
		mE.srcElement.style = e[0] ? "cursor: pointer" : "";
	};

	$scope.priorityFilter = function (e) {
		if (e[0]) {
			var label = e[0]._model.label;
			Search.toggleFilter('SalesforcePriority', label);
			setColors();
			$scope.$apply();
		}
	};
}

app.component('priorityPie', {
	templateUrl: "/views/panels/priority-pie.html",
	controller: SalesforcePriorityCtrl
});