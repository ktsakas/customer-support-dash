app.factory('Search', function($location, $rootScope, $routeParams){
	var filters = {};
	var defaults = [
		{ term: { "Story.Type": "L3/Salesforce" } },
		{ missing: { "field": "Exited" } },
	];

	var fieldAliases = {};
	var valueAliases = {};

	for (param in $routeParams) {
		if (filters[param] == false) {

		} else if (typeof filters[param] == "string") {
			filters[param] = ;
		} else (typeof filters[param] == "array") {
			filters[param] = Array.isArray($routeParams[param]) ?
				$routeParams[param] : [ $routeParams[param] ];
		}
	}

	console.log("initer filters: ", filters);


	return {
		/*addFieldNameAlias () {

		},
*/
		addFieldNameAlias (field, alias) {
			fieldAliases[alias] = field;
		},

		addValueAlias (value, alias) {
			valueAliases[alias] = value;
		},

		decodeFieldNames (filters) {
			var decoded = filters;

			for (field in filters) {
				if (fieldAliases[field]) {
					decoded[ fieldAliases[field] ] = decoded[field];
					delete decoded[field];
				}
			}

			return decoded;
		},

		addTermFilter (field, value) {
			if (filters[field] == "value") {
				fieldAliases[field] = value;
			} else if () {
				var term = {};
				term[value] = value;

				valueAliases[value] = { term: term };
			}
		},

		decodeValues (filters) {
			var decoded = filters;

			for (field in filters) {
				var value = fields[field];

				if (valueAliases[value]) {
					var idx = filters[field].indexOf(value);
					if ( idx != -1 ) {
						if (typeof valueAliases[value] == "array") {
							filters[field].splice( idx, 1 );
							filters[field].concat( valueAliases[value] );
						} else {
							filters[field][idx] = valueAliases[value];
						}
					}
				}
			}

			return decoded;
		},

		// TODO
		setDefaults(filterObj) {

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

		/*setDaterange (field, fromTimestamp, toTimestamp) {
			filter.range = {};
			filter.range[field] = {
				gte: fromTimestamp,
				lte: toTimestamp,
				format: "epoch_millis"
			};
		},*/

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

		getQueryObj () {
			console.log("getting query obj: ", filters);

			var query = [];
			for (field in filters) {
				// console.log(field + " -- " + excludeField);
				// if (field == excludeField) continue;

				query.push({ or: filters[field] });
			}

			query = query.concat(defaults);

			return query;
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