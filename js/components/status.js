function StatusCtrl ($scope, Search, client) {
	client.search({
		index: "test",
		body: {
		  "query": {
				"bool": {
					"filter": Search.getFilterQuery()
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

		$scope.dataset = {
			hoverBackgroundColor: ['#2A3F54', '#2A3F54', '#2A3F54']
		};
			/*{
				value: 300,
				backgroundColor:'#F7464A',
				hoverBackgroundColor: '#000',
				label: 'Red'
			},
			{
				value: 50,
				backgroundColor: '#46BFBD',
				hoverBackgroundColor: '#000',
				label: 'Green'
			},
			{
				value: 100,
				backgroundColor: '#FDB45C',
				hoverBackgroundColor: '#000',
				label: 'Yellow'
			}
		};*/

		$scope.colors = [
			'#008fe6',
			'#61bc67',
			'#f7464a',
		];
	});

	$scope.chartHover = function (e, mE) {
		if (e[0]) {
			mE.srcElement.style = "cursor: pointer";
		} else {
			mE.srcElement.style = "";
		}
	};

	$scope.statusFilter = function (e) {

		if (e[0]) {
			var barName = e[0];
			var barName = e[0]._model.label;
			var idx = e[0]._index;
			$scope.colors[idx] = "#2A3F54";
			Search.addFilter('Status', barName);
			$scope.$apply();
			console.log("colors: ", $scope.colors);
		}
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