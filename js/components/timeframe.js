app.component('timeframe', {
	templateUrl: "/views/panels/timeframe.html",
	controller: function ($scope, Search) {
		angular.extend($scope, Search);
	}
});