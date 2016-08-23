app.directive('kanbanStatesBarChart', function ($timeout) {
	return {
		restrict: 'E',
		template: '<canvas style="width: 484px; height: 242px; min-height: 500px;" width="484" height="242"></canvas>',
		link: function($scope, element) {

			var ctx = element[0].getElementsByTagName('canvas')[0];

			var mybarChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: ["Advance Investigation", "In-Progress", "Verified", "Completed", "Closed", "N/A"],
					datasets: [{
						label: '# of Tickets',
						backgroundColor: "#26B99A",
						data: [51, 30, 40, 28, 92, 50]
					}]
				},

				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			});

			console.log(ctx.height);
		}
	};
});

app.component('kanbanStates', {
	templateUrl: "/views/panels/kanban-states.html",
	controller: function ($scope, Search, client) {
		var filters = Search.getFilterQuery();
		filters.push({ missing: { field: "Exited" } });
		console.log("filters: ", filters);

		client.search({
			index: index,
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
			        "field": "L3KanbanStage",
			        "size": 8,
			        "order": {
			          "_count": "desc"
			        }
			      }
			    }
			  }
			}
		}).then(function (resp) {
			var buckets = resp.aggregations[0].buckets;
			
			// Delete closed (there are too many)
			buckets.shift();

			$scope.data = buckets.map(function (doc) {
				return doc.doc_count;
			});

			$scope.labels = buckets.map(function (doc) {
				return doc.key.split(' ');
			});
		});

		$scope.chartHover = function (e) {
			console.log("e: ", e);
		};

		$scope.kanbanFilter = function (e) {
			var barName = e[0]._model.label;

			Search.addFilter('L3KanbanState', barName.join(" "));
		};
	}
});