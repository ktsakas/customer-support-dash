## Project Structure

This is a single page app, where the only NodeJS code is in server.js.
The server directs all traffic to index.html and AngularJS handles all routes.
As such the is no app folder.

### Folder structure
* css: css files
    - A lot of the CSS initially came from [Gentelella](https://colorlib.com/polygon/gentelella/index.html), so to add futher components you can copy css from their project to keep stuff consistent.
    - All CSS is written using [Less.js](http://lesscss.org/).
* docs: readme files
* js: javascript files (read "Under the hood" for more details)
* views: html files (read "Under the hood" for more details)

### Under the hood

Each panel on the dashboard is an AngularJS component in the `js/components` directory and has a coresponding html view in `views/panels`.

Each component's controller executes an ElasticSearch query to fetch the relevant data and make it available to the view.

All panels share the search factory class `js/search.js` and use it to extend their $scope.

The search factory is the core of the app and has the following functionality:
* Add aliases for query filters:
    - eg. "thisweek" is mapped to the object that is inserted to the query
    - All aliases are instantiated in the `main-ctrl.js`, currently we only have aliases for Projects and Timeframe filters.
* Updates the route to reflect the selected filters.
* Provides functionality to add/remove/toggle/check for filters.
* Can build part of the query sent ElasticSearch, by each component.
* Provides functions to perform queries on ElasticSearch.
