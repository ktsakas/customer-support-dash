app.component('timeframe', {
	templateUrl: "/views/panels/timeframe.html",
	controller: function ($scope) {
		var quickPeriods = {
			"thisweek": {
				from: moment().unix(),
				to: moment().subtract(1, 'week').unix()
			},
			"lastweek": {
				from: moment().subtract(1, 'week').unix(),
				to: moment().subtract(2, 'week').unix()
			},
			"thismonth": {
				from: moment().unix(),
				to: moment().subtract(1, 'month').unix()
			},
			"lastmonth": {
				from: moment().subtract(1, 'month').unix(),
				to: moment().subtract(2, 'month').unix()
			}
		};

		$scope.setPeriod = function (value) {
			
		};
	}
});