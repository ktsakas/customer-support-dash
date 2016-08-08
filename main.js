var app = angular.module('CustomerDash', ['elasticsearch']);

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

app.service('client', function (esFactory) {
	return esFactory({
		host: 'localhost:9200',
		apiVersion: '2.3',
		log: 'trace'
	});
});

app.controller('RegionFilterController', function ($scope, Search, client) {
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
});

app.controller('ProjectFilterController', function ($scope, Search, client) {
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