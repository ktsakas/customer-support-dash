app.factory('Search', function($location, $rootScope, $routeParams){
	var filters = {};
	var defaults = [
		{ term: { "Story.Type": "L3/Salesforce"} },
		{ missing: { "field": "Exited" } }
	];

	for (param in $routeParams) {
		filters[param] = Array.isArray($routeParams[param]) ?
			$routeParams[param] : [ $routeParams[param] ];
	}
	console.log("filters: ", filters);


	return {
		// TODO
		setDefaults(fieltrsObj) {

		},

		setFilters(filtersObj) {
			filters = filtersObj;
		},

		setFilter(field, filterObj) {
			filters[field] = [ filterObj ];

			$location.search(filters);
			$rootScope.$emit("filterUpdate");

			return 0;
		},

		hasFilter(field, value) {
			return filters[field] && filters[field].indexOf(value) != -1;
		},

		toggleFilter(field, value) {
			if (this.hasFilter(field, value)) {
				this.removeFilter(field, value);
			} else {
				this.addFilter(field, value);
			}
		},

		removeFilter(field, value) {
			var idx = filters[field].indexOf(value);

			if (idx != -1) {
				delete filters[field].splice(idx, 1);

				console.log("filters: ", filters[field], filters[field].length);

				if (filters[field].length == 0) 
					delete filters[field];

				$location.search(filters);
				$rootScope.$emit("filterUpdate");

				return true;
			} else {
				return false;
			}
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

		getFilterQuery(excludeField) {
			var queryFilter = [];
			for (field in filters) {
				console.log(field + " -- " + excludeField);
				if (field == excludeField) continue;

				queryFilter.push({
					or: filters[field].map(function (val) {
						var term = {};
						term[field] = val;

						return { term: term };
					})
				});
			}

			queryFilter = queryFilter.concat(defaults);

			return queryFilter.length > 0 ? queryFilter : {};
		},

		getFilters() {
			return filters;
		}
	};
});