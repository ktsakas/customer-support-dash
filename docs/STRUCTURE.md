## Project Structure

This is a single page app, where the only NodeJS code is in server.js.
The server directs all traffic to index.html and AngularJS handles all routes.
As such the is no app folder.

### Folder structure
* css: css files
    - A lot of the CSS initially came from [Gentelella](https://colorlib.com/polygon/gentelella/index.html), so to add futher components you can copy css from their project to keep stuff consistent.
    - All CSS is written using [Less.js](http://lesscss.org/).
* docs: readme files
* js: javascript files (read bellow for more details)

### Javascript
* components folder: Each panel on the dashboard is an AngularJS component, where the controller performs the 

