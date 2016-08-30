app.controller('MainCtrl', function ($routeParams, Search, $scope) {
	/* Project aliases */
	
	Search.addAlias("UnderProject", "iHotelier", [
		{ term: { ProjectHierarchy: "reservations" } },
		{ term: { ProjectHierarchy: "reservation ice box" } }
	]);

	Search.addAlias("UnderProject", "CMDAS", [{
		term: { ProjectHierarchy: "channel management development and adapter support" }
	}]);

	/* Time aliases */

	Search.addAlias("Timeframe", "thisweek", [{
		range: {
			CreationDate: { gte: "now-7d/d", lte: "now" }
		}
	}]);

	Search.addAlias("Timeframe", "lastweek", [{
		range: {
			CreationDate: { gte: "now-14d/d", lte: "now-7d/d" }
		}
	}]);

	Search.addAlias("Timeframe", "thismonth", [{
		range: {
			CreationDate: { gte: "now-1M/M", lte: "now" }
		}
	}]);

	Search.addAlias("Timeframe", "lastmonth", [{
		range: {
			CreationDate: { gte: "now-2M/M", lte: "now-1M/M" }
		}
	}]);

	$scope.customer = $routeParams.customer;
});