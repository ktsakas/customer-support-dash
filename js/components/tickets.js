app.component('tickets', {
	templateUrl: "/views/panels/tickets-table.html",
	controller: function ($scope, $rootScope, Search, client) {
		angular.extend($scope, Search);

		var columns = ["CreationDate", "LastUpdateDate", "Story.ID", "Story.Name", "Project.Name", "L3KanbanStage", "SalesforcePriority", "Author", "TotalPosts", "DaysInPreviousRevision"];

		var flattenObject = function(ob) {
			var toReturn = {};

			for (var i in ob) {
			if (!ob.hasOwnProperty(i)) continue;

			if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
			if (!flatObject.hasOwnProperty(x)) continue;

			toReturn[i + '.' + x] = flatObject[x];
			}
			} else {
			toReturn[i] = ob[i];
			}
			}
			return toReturn;
		};

		function convertToCSV (hitsToCSV) {
			hitsToCSV = hitsToCSV.map(function (hit) {
				return flattenObject(hit._source);
			});

			var csvContents = columns.join(',');

			for (var i= 0; i < hitsToCSV.length; i++) {
				var rowValues = [];
				for (var j= 0; j < columns.length; j++) {
					var val = hitsToCSV[i][ columns[j] ];
					if (typeof val == "string") val = '"' + val + '"';

					rowValues.push(val);
				}

				csvContents += "\r\n" + rowValues.join(',');
			}

			return encodeURIComponent(csvContents);
        }

        $scope.order = {
        	field: "Story.Name",
        	dir: "asc",
        };

		$scope.orderClass = function (orderField) {
			return ($scope.order.field == orderField) ? "order-" + $scope.order.dir : "";
		};

		$scope.toggleOrder = function (orderField) {
			// Change direction if the field is already the one used
			if ($scope.order.field == orderField) $scope.order.dir = ($scope.order.dir == "asc") ? "desc" : "asc";
			// Set the field to sort by
			$scope.order.field = orderField;
			findTickets();
		};

		$scope.downloadCSV = function (filename) {
			if ($scope.totalMatching <= 1000) {
				findTickets(1000).then((hits) => {
					console.log("all hits: ", hits);

					var a = document.createElement('a');
					a.href = 'data:attachment/csv,' + convertToCSV(hits);
					a.target = '_blank';
					a.download = filename;

					document.body.appendChild(a);
					a.click();
				});
			} else {
				alert("Please refine your query. We can only export up to 1000 tickets.");
			}
		}

		$scope.showMore = function () {
			size += 10;
			findTickets(size);
		};

		var size = 10;
		function findTickets (size) {
			var sortBy = {};
			sortBy[ $scope.order.field ] = { order: $scope.order.dir };

			return client.search({
				index: index,
				from: Search.getFrom(),
				size: size,
				body: {
					query: {
						bool: {
							filter: Search.getFilterQuery()
						}
					},
					sort: sortBy
				}
			}).then(function (resp) {

				$scope.totalMatching = resp.hits.total;

				$scope.hits = resp.hits.hits.map(function (hit) {
					hit._source.CreationDate = moment(hit._source.CreationDate).format("YYYY-MM-DD HH:ss");

					return hit;
				});

				return $scope.hits;
			}).catch(function (err) {
				console.log(err);
			});
		}

		$scope.filters = Search.getFilters();
		findTickets(size);

		$scope.hasFilters = function () {
			return Object.keys($scope.filters).length > 0;
		};

		$scope.$on('$routeUpdate', function () {
			size = 10;
			$scope.filters = Search.getFilters();
			findTickets(size);
		});
	}
});