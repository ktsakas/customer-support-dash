var index = "rally";

/*
	App config.

	Routes everything to the dashboard view.
 */
var app = angular.module('CustomerDash', [
	'elasticsearch', 'ngRoute', 'chart.js'
]).config([
	'$locationProvider', '$routeProvider',
	function config($locationProvider, $routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: './views/dashboard.html',
				controller: 'MainCtrl',
				reloadOnSearch: false
			})
			.otherwise('/');

		$locationProvider.html5Mode(true);
	}
]);

/*
	ElasticSearch query service.
 */
app.service('client', function (esFactory) {
	return esFactory({
		host: 'http://na-testl01.gain.tcprod.local:9200',
		apiVersion: '2.3',
		// log: 'trace'
	});
});

/*
	Capitalize the first character of each word.
 */
app.filter('capitalize', function () {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : "";
	}
});