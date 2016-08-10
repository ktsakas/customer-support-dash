var app = angular.module('CustomerDash', [
	'elasticsearch', 'ngRoute'
]).config([
	'$locationProvider', '$routeProvider',
	function config($locationProvider, $routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: './views/dashboard.html',
				controller: 'DashboardController'
			})
			.when('/:customer', {
				templateUrl: './views/dashboard.html',
				controller: 'DashboardController'
			})
			.otherwise('/');

		$locationProvider.html5Mode(true);
	}
]);

app.service('client', function (esFactory) {
	return esFactory({
		host: 'http://40f35fbe.ngrok.io/',
		apiVersion: '2.3',
		log: 'trace'
	});
});

app.component('sidebar', {
	templateUrl: "/views/partials/sidebar.html",
	controller: function ($routeParams, $scope, client) {
		console.log("Rout parameters: ", $routeParams);

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

app.component('kanbanStates', {
	templateUrl: "/views/panels/kanban-states.html"
});


app.component('topbar', {
	templateUrl: "/views/partials/topbar.html"
});

app.controller('DashboardController', function ($routeParams, $scope) {
	$scope.customer = $routeParams.customer;
});

app.filter('capitalize', function() {
	return function(input) {
		console.log("Whatever");
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : "";
	}
});

app.factory('Search', function(){
	return {
		filters: ["one"]
	};
});

app.component('regions', {
	templateUrl: "/views/panels/regions.html",
	controller: function ($scope, Search, client) {
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

app.component('details', {
	templateUrl: "/views/partials/details.html"
});

app.component('tickets', {
	templateUrl: "/views/panels/tickets-table.html",
	controller: function ($scope, Search, client) {
		console.log("What is this?");

		client.search({
			index: "test",
			body: {
				query: {
					bool: {
						filter: {
							term: { Region: "asia" }
						}
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
});

app.component('projects', {
	templateUrl: "/views/panels/projects.html",
	controller: function ($scope, Search, client) {
		$scope.activeRegion = Search;

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

app.controller('MainController', function ($scope, client) {
	client.search({
		index: "test",
		body: {
			query: {
				bool: {
					filter: {
						term: { Region: "asia" }
					}
				}
			}
		}
	}).then(function (resp) {
		console.log(resp.hits.hits);
		$scope.hits = resp.hits.hits;
	}).catch(function (err) {
		console.log(err);
	});
});