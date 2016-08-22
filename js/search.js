app.factory('Search', function($location, $rootScope, $routeParams){
	// All filter values are arrays
	var filters = {};
	var defaults = [
		{ term: { "Story.Type": "L3/Salesforce" } },
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
						console.log("found alias", field, aliasKey, aliases[aliasKey]);
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
						var term = { term: {} };
						term.term[field] = value;
						decoded[field].push(term);
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

		/*addTermFilter (field, value) {
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
				filters[field].splice(idx, 1);

				console.log("filters: ", filters[field], filters[field].length);

				if (filters[field].length == 0) 
					delete filters[field];

				$location.search(filters);

				return true;
			} else {
				return false;
			}
		},

		addFilter(field, value) {
			if (!filters[field]) filters[field] = [];
			if (filters[field].indexOf(value) != -1) return;

			filters[field].push(value);
			$location.search(filters);

			return filters[field].length - 1;
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

		getFilters() {
			console.log("getting filters: ", JSON.stringify(filters));
			return filters;
		}
	};
});