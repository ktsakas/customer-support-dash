function StatusCtrl ($scope, $filter, Search) {
	var activeColor = "#2A3F54";
	var colors = ['#26b99a', '#3498db', '#9b59b6'];

	function setColors() {
		$scope.colors = $scope.labels.map(function (label, i) {
			return Search.hasFilter('Status', label) ? activeColor : colors[i];
		});

		$scope.dataset = {
			hoverBackgroundColor: $scope.labels.map(function (label, i) {
				return Search.hasFilter('Status', label) ? colors[i] : activeColor;
			})
		};
	}

	function queryStatus() {
		var queryObj = {
			size: 0,
			aggs: {
				status: {
					terms: {
						field: "Status",
						order: {
							_count: "desc"
						}
					},
					aggs: {
		                avg_age: {
		                    avg: {
		                         script: "(DateTime.now().getMillis() - doc['Entered'].value)/(24*60*60*1000) * 1.0"
		                    }
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
				var buckets = resp.aggregations["status"].buckets;

				$scope.data = buckets.map(function (doc) {
					return doc.doc_count;
				});

				$scope.barData = buckets.map(function (doc) {
					console.log("doc: ", doc);

					return doc.avg_age.value;
				});

				$scope.labels = buckets.map(function (doc) {
					return $filter('capitalize')(doc.key);
				});

				setColors();
				$scope.$on('$routeUpdate', setColors);
			});
	}

	$scope.chartHoverPointer = function (e, mE) {
		mE.srcElement.style = e[0] ? "cursor: pointer" : "";
	};

	$scope.statusFilter = function (e) {

		if (e[0]) {
			// var barName = e[0];
			var barName = e[0]._model.label;
			Search.toggleFilter('Status', barName);
			setColors();
			$scope.$apply();
		}
	};

	queryStatus();
}


app.component('statusPie', {
	templateUrl: "/views/panels/status-pie.html",
	controller: StatusCtrl
});

app.component('statusBar', {
	templateUrl: "/views/panels/status-bar.html",
	controller: StatusCtrl
});