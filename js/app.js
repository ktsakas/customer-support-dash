var app = angular.module('CustomerDash', [
	'elasticsearch', 'ngRoute', 'chart.js'
]).config([
	'$locationProvider', '$routeProvider',
	function config($locationProvider, $routeProvider) {
		$routeProvider
			.when('/what', {
				templateUrl: './views/dashboard.html',
				controller: 'DashboardController',
				reloadOnSearch: false
			})
			.otherwise('/what');

		$locationProvider.html5Mode(true);
	}
]);

app.controller('DashboardController', function ($routeParams, Search, $scope) {
	$scope.$on('$routeUpdate', function () {
		Search.setFilters($routeParams);

		console.log(Search.getFilters());
	});

	$scope.customer = $routeParams.customer;
});

app.service('client', function (esFactory) {
	return esFactory({
		host: 'http://e4562535.ngrok.io',
		apiVersion: '2.3',
		log: 'trace'
	});
});

app.component('sidebar', {
	templateUrl: "/views/partials/sidebar.html",
	controller: function ($routeParams, $scope, client) {

		client.search({
			index: "test",
			body: {
				"query": {
					"match_all": {}
				},
				"size": 0,
				"aggs": {
					"0": {
						"terms": {
							"field": "Customer",
							"order": {
								"_term": "asc"
							}
						}
					}
				}
			}
		}).then(function (resp) {
			console.log("customers: ", resp.aggregations[0].buckets);
			$scope.customers = resp.aggregations[0].buckets;
		});
	}
});

app.directive('kanbanStatesBarChart', function ($timeout) {
	return {
		restrict: 'E',
		template: '<canvas style="width: 484px; height: 242px; min-height: 500px;" width="484" height="242"></canvas>',
		link: function($scope, element) {
			$timeout(function () {

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

			}, 1000);
		}
	};
});

app.component('kanbanStates', {
	templateUrl: "/views/panels/kanban-states.html",
	controller: function ($scope) {
		$scope.labels = [["Advance", "Investigation"], "In-Progress", "Verified", "Completed", "Closed", "N/A"];
		$scope.series = ['Series A', 'Series B'];

		$scope.data = [51, 30, 40, 28, 92, 50];
	}
});


app.component('topbar', {
	templateUrl: "/views/partials/topbar.html"
});

app.filter('capitalize', function() {
	return function(input) {
		console.log("Whatever");
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : "";
	}
});

app.factory('Search', function($location, $rootScope){
	var filters = {};

	return {
		setFilters(filtersObj) {
			filters = filtersObj;
		},

		setFilter(field, filterObj) {
			filters[field] = [ filterObj ];

			$location.search(filters);
			$rootScope.$emit("filterUpdate");

			return 0;
		},

		removeFilter(field, idx) {
			delete filters[field][idx];
		},

		addFilter(field, filterObj) {
			if (!filters[field]) filters[field] = [];
			// Do not add duplicate filters
			if ( filters[field].indexOf(filterObj) != -1 ) return;

			filters[field].push(filterObj);

			$location.search(filters);
			$rootScope.$emit("filterUpdate");

			return filters[field].length - 1;
		},

		getFilters() {
			return filters;
		}
	};
});

app.component('regions', {
	templateUrl: "/views/panels/regions.html",
	controller: function ($scope, Search, client) {
		angular.extend($scope, Search);

		client.search({
			index: "test",
			body: 
				{
				  "query": {
				    "filtered": {
				      "query": {
				        "query_string": {
				          "query": "*",
				          "analyze_wildcard": true
				        }
				      },
				      "filter": {
				        "bool": {
				          "must": [
				            {
				              "query": {
				                "query_string": {
				                  "analyze_wildcard": true,
				                  "query": "*"
				                }
				              }
				            },
				            {
				              "range": {
				                "Entered": {
				                  "gte": 1312815720426,
				                  "lte": 1470668520426,
				                  "format": "epoch_millis"
				                }
				              }
				            }
				          ],
				          "must_not": []
				        }
				      }
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

app.component('customerInfo', {
	templateUrl: "/views/partials/customerInfo.html"
});

app.component('tickets', {
	templateUrl: "/views/panels/tickets-table.html",
	controller: function ($scope, $rootScope, Search, client) {
		buildFilter = function () {
			var filters = Search.getFilters(),
				queryFilter = [];
			for (field in filters) {
				var term = {};
				term[field] = filters[field];

				queryFilter.push({ term: term });
			}

			return queryFilter.length > 0 ? { or: queryFilter } : {};
		};

		findTickets = function () {
			client.search({
				index: "test",
				body: {
					query: {
						bool: {
							filter: buildFilter()
						}
					}
				}
			}).then(function (resp) {
				console.log(resp.hits.hits);
				$scope.hits = resp.hits.hits;
			}).catch(function (err) {
				console.log(err);
			});
		}

		// console.log("search: ", Search.getFilters());

		$rootScope.$on('filterUpdate', function () {
			findTickets();
		});

		findTickets();		
	}
});

app.component('projects', {
	templateUrl: "/views/panels/projects.html",
	controller: function ($scope, $location, Search, client) {
		angular.extend($scope, Search);

		client.search({
			index: "test",
			body: 
				{
				  "query": {
				    "filtered": {
				      "query": {
				        "query_string": {
				          "query": "*",
				          "analyze_wildcard": true
				        }
				      },
				      "filter": {
				        "bool": {
				          "must": [
				            {
				              "query": {
				                "query_string": {
				                  "analyze_wildcard": true,
				                  "query": "*"
				                }
				              }
				            },
				            {
				              "range": {
				                "Entered": {
				                  "gte": 1312815720426,
				                  "lte": 1470668520426,
				                  "format": "epoch_millis"
				                }
				              }
				            }
				          ],
				          "must_not": []
				        }
				      }
				    }
				  },
				  "size": 0,
				  "aggs": {
				    "0": {
				      "terms": {
				        "field": "ProjectHierarchy",
				        "size": 200,
				        "order": {
				          "_count": "desc"
				        }
				      }
				    }
				  }
				}
		}).then(function (resp) {
			$scope.projects = resp.aggregations[0].buckets;
		});
	}
});