app.factory('Search', function($location, $rootScope, $routeParams, client) {
	/**
	 * The filters object is decoded based on the aliases object,
	 * in order to build the ElasticSearch query.
	 */
	var filters = {/*
			"{field name alias}": "{field value alias}"

			or 

			"{actual field name}": "{actual query obj}"
		*/},
	
		// Default query filters
		defaults = [
			// Only L3/Salesforce tickets
			{ match: { "Story.Type": "L3/salesforce" } },
			// Get events/revisions that do not have an exited date
			// that is we only care about the current state of each ticket
			{ missing: { "field": "Exited" } },
		],

		// Map aliases to query values
		aliases = {/*
			"{field name alias}:{value alias}": {query obj}
		*/},
	
		// ElasticSearch query from parameter
		from;


	/*
	 Read the route parameters to generate the query filters.
	 */
	for (param in $routeParams) {
		if (param == "from") {
			from = $routeParams.from;
		} else {
			filters[param] = Array.isArray($routeParams[param])
				? $routeParams[param] : [ $routeParams[param] ];
		}
	}

	console.log("initer filters: ", JSON.stringify(filters));


	return {
		/**
		 * Adds an alias for a filter to the list of aliases,
		 * which can later be used as a filter.
		 *
		 * Note: the query obj is an array that means a single filter can
		 * correspond to multiple ElasticSearch filters.
		 * 
		 * @param {string} fieldAlias field name
		 * @param {string} valueAlias field value
		 * @param {array} queryObj    query object for ElasticSearch
		 */
		addAlias(fieldAlias, valueAlias, queryObj) {
			if ( !Array.isArray(queryObj) ) throw "queryObj must be an array.";

			aliases[fieldAlias + ":" + valueAlias] = queryObj;
		},

		/**
		 * Decodes values of a specific field based on the aliases.
		 * 
		 * @param  {string} field       name of the field to decode
		 * @param  {array} encodedField list of filter values
		 * @return {array}              decoded filters
		 */
		decodeAliases (field, encodedField) {
			var decodedField = [];

			encodedField.forEach((value) => {
				var aliasKey = field + ":" + value;					

				// If there exists an alias for a value
				// map it to that query object
				if (aliases[aliasKey]) {
					decodedField = decodedField.concat(aliases[aliasKey]);

				// Otherwise keep it as is
				} else {
					decodedField.push(value);
				}
			});

			return decodedField;
		},

		/**
		 * Field values that have not matched any aliases are translated to term filters.
		 * 
		 * @param  {string} field        filter field name
		 * @param  {array} encodedField  filter values
		 * @return {array}               array decoded filter objects
		 */
		decodeFormat (field, encodedField) {
			var decodedField = [];

			encodedField.forEach((value) => {
				if (typeof value != "string")  {
					decodedField.push(value);
				} else {
					var match = { match: {} };
					match.match[field] = value.toLowerCase();
					decodedField.push(match);
				}
			});

			return decodedField;
		},

		/**
		 * Decode a filter for a field to a valid ElasticSearch query object (can be multiple filters).
		 * 
		 * @param  {string} field        field name
		 * @param  {array} encodedField  encoded field values
		 * @return {array}               decoded field values
		 */
		decodeFilter (field, encodedField) {
			return this.decodeFormat(field, this.decodeAliases(field, encodedField));
		},

		/**
		 * Iteratively decode the entire filters object to an ElasticSearch query object.
		 * 
		 * @param  {object} encoded        encoded filters object
		 */
		decodeFilters (encoded) {
			var decoded = {};

			for (field in encoded)
				decoded[field] = this.decodeFilter(field, encoded[field]);

			return decoded;
		},

		/**
		 * Set a filter for a field to a specific value.
		 * This will override any previous filters for that column.
		 * 
		 * @param {string} field     name of the column
		 * @param {object} filterObj the object or alias to filter by
		 */
		setFilter(field, filterObj) {
			filters[field] = [ filterObj ];

			$location.search(filters);
		},

		/**
		 * Check if a filter exists for a specific field.
		 * Optionally use search to check if a filter for a field has a specific value.
		 * 
		 * @param {string} field     name of the column
		 * @param {object} search    filter value to search for
		 */
		hasFilter(field, search) {
			if (!search) return !!filters[field];
			else {
				return filters[field] && !!filters[field].find(function (value) {
					return value.toLowerCase() == search.toLowerCase();
				});
			}
		},

		/**
		 * Toggles a filter on and off alternatively.
		 * 
		 * @param  {string} field the name of the field/column or an alias
		 * @param  {object} value the query object or an alias
		 * @return {boolean}      whether the filter was removed or added
		 */
		toggleFilter(field, value) {
			if (this.hasFilter(field, value)) {
				this.removeFilter(field, value);
				return false;
			} else {
				this.addFilter(field, value);
				return true;
			}
		},

		/**
		 * Removes a filter from the filters list of and if no values
		 * are left for a given field remove the field from the filters.
		 *
		 * You can remove all filters for a field if you don't provide a value.
		 * 
		 * @param  {string} field field name
		 * @param  {string or obj} value (optional) field value or alias
		 */
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


			// Update the route
			$location.search(filters);
		},

		/**
		 * Appends a filter to the list of filters for a specific field.
		 * 
		 * @param {string} field field name
		 * @param {object} value field value alias or object
		 */
		addFilter(field, value) {
			if (!filters[field]) filters[field] = [];
			if (filters[field].indexOf(value) != -1) return;

			filters[field].push(value);
			// Update the route
			$location.search(filters);

			return filters[field].length - 1;
		},

		getFrom() {
			return from || 0;
		},

		/**
		 * Get all filters for a specific field.
		 * 
		 * @param  {string} field
		 * @return {object}
		 */
		getFilter(field) {
			return filters[field];
		},

		/**
		 * Given a whitelist of fields it builds a query based
		 * on the values that have been selected for those fields.
		 * 
		 * @param  {array} includeFields list of field names
		 * @return {object}              query object
		 */
		getQueryForFields(includeFields) {
			var decoded = this.decodeFilters(filters);

			var query = [];
			includeFields.forEach((field) => {
				query.push({ or: decoded[field] });
			});

			query = query.concat(defaults);

			return query;
		},

		/**
		 * Builds a query for all filters selected but excludes excludeField.
		 * 
		 * @param  {array} excludeField field name to exclude filters for
		 * @return {object}             query object
		 */
		getFilterQuery(excludeField) {
			var decoded = this.decodeFilters(filters);

			var query = [];
			for (field in decoded) {
				// console.log(field + " -- " + excludeField);
				if (field == excludeField) continue;

				query.push({ or: decoded[field] });
			}

			query = query.concat(defaults);

			return query;
		},

		/**
		 * Perform search query on ElasticSearch.
		 * 
		 * @param  {object} queryObj
		 * @return {Promise}
		 */
		query(queryObj) {
			return client.search({
				index: index,
				body: queryObj
			});
		},

		/**
		 * Perform count query in ElasticSearch.
		 * 
		 * @param  {object} queryObj
		 * @return {Promise}
		 */
		count(queryObj) {
			return client.count({
				index: index,
				body: queryObj
			});
		},

		/**
		 * @return {object} filters
		 */
		getFilters() {
			return filters;
		}
	};
});