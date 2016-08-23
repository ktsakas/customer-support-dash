app.component('projects', {
	templateUrl: "/views/panels/projects.html",
	controller: function ($scope, $location, Search, client) {
		angular.extend($scope, Search);

		Search.query({
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
		}).then(function (resp) {
			$scope.projects = resp.aggregations[0].buckets;
		});
	}
});