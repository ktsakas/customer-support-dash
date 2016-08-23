var index = "rally";


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


app.service('client', function (esFactory) {
	return esFactory({
		host: 'http://309b29b7.ngrok.io',
		apiVersion: '2.3',
		// log: 'trace'
	});
});


app.filter('capitalize', function () {
	return function(input) {
		console.log("Whatever");
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : "";
	}
});

app.component('customerInfo', {
	templateUrl: "/views/partials/customerInfo.html"
});