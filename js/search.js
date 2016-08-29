app.factory('Search', function($location, $rootScope, $routeParams, client){
	// All filter values are arrays
	var filters = {};
	var defaults = [
		{ match: { "Story.Type": "L3/salesforce" } },
		{ missing: { "field": "Exited" } },
	];

	var aliases = {};

	// this.addFieldNameAlias("Missing", "missing");

	for (param in $routeParams) {
		filters[param] = Array.isArray($routeParams[param])
			? $routeParams[param] : [ $routeParams[param] ];
	}

	console.log("initer filters: ", JSON.stringify(filters));


	return {
		addAlias(fieldAlias, valueAlias, queryObj) {
			if ( !Array.isArray(queryObj) ) throw "queryObj must be an array.";

			aliases[fieldAlias + ":" + valueAlias] = queryObj;
		},

		decodeAliases (encoded) {
			var decoded = {};

			for (field in encoded) {
				decoded[field] = [];

				encoded[field].forEach((value) => {
					var aliasKey = field + ":" + value;					

					if (aliases[aliasKey]) {
						decoded[field] = decoded[field].concat(aliases[aliasKey]);
					} else {
						decoded[field].push(value);
					}
				});
			}

			return decoded;
		},

		decodeFilters (encoded) {
			var decoded = {};

			for (field in encoded) {
				decoded[field] = [];

				encoded[field].forEach((value) => {
					if (typeof value != "string")  {
						decoded[field].push(value);
					} else {
						var match = { match: {} };
						match.match[field] = value.toLowerCase();
						decoded[field].push(match);
					}
				});
			}

			return decoded;
		},

		addMissingFilter (field) {
			if (!filters["Missing"]) filters["Missing"] = [];

			filters["Missing"].push(field);
			$location.search(filters);
		},

		/*addMatchFilter (field, value) {
			if (!filters[field]) filters[field] = [];
			if (filters[field].indexOf(value) != -1) return;

			filters[field].push(value);

			$location.search(filters);
		},*/

		// TODO
		setDefaults(filterObj) {

		},

		setFilters(filtersObj) {
			filters = filtersObj;
		},

		setFilter(field, filterObj) {
			filters[field] = [ filterObj ];

			$location.search(filters);

			return 0;
		},

		// The search parameter is optional
		hasFilter(field, search) {
			if (!search) return filters[field];
			else {
				return filters[field] && filters[field].find(function (value) {
					return value.toLowerCase() == search.toLowerCase();
				});
			}
		},

		toggleFilter(field, value) {
			if (this.hasFilter(field, value)) {
				this.removeFilter(field, value);
				return false;
			} else {
				this.addFilter(field, value);
				return true;
			}
		},

		// The value parameter is optional
		removeFilter(field, value) {
			if (!value) {
				delete filters[field];
			} else {
				var idx = filters[field].indexOf(value);
				if (idx == -1) return;

				filters[field].splice(idx, 1);

				if (filters[field].length == 0) 
					delete filters[field];
			}

			$location.search(filters);
		},

		addFilter(field, value) {
			if (!filters[field]) filters[field] = [];
			if (filters[field].indexOf(value) != -1) return;

			filters[field].push(value);
			$location.search(filters);

			return filters[field].length - 1;
		},

		getFilter(field) {
			return filters[field];
		},

		getFilterQuery(excludeField) {
			var decoded = this.decodeAliases(filters);
			decoded = this.decodeFilters(decoded);

			var query = [];
			for (field in decoded) {
				// console.log(field + " -- " + excludeField);
				if (field == excludeField) continue;

				query.push({ or: decoded[field] });
			}

			query = query.concat(defaults);

			return query;
		},

		query(queryObj) {
			return client.search({
				index: index,
				body: queryObj
			});
		},

		count(queryObj) {
			return client.count({
				index: index,
				body: { query: queryObj }
			});
		},

		getFilters() {
			console.log("getting filters: ", JSON.stringify(filters));
			return filters;
		}
	};
});