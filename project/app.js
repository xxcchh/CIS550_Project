/**
 * Created by chen on 11/20/16.
 */

// Modules needed
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , stylus = require('stylus')
    , nib = require('nib')
    , cons  = require('consolidate')
    , engine = require('ejs-locals')
    , bodyParser = require('body-parser');
;

// Initialize express
var app = express();

// View engine setup use ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser());

// Set static files
app.use(express.static("public"));


init_app(app);


// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

// app.get('/', routes.homepage, function (req, res) {
//     var text = req.s;
//     return routes.googleSearch(text);
// });
app.get('/', routes.homepage);
app.get('/', routes.googleSearch('hello'));
app.get('/country', routes.country);
app.get('/athletes', routes.athletes);
app.get('/discipline', routes.discipline);
app.get('/economics', routes.countryEconomics);
app.get('/analysis', routes.countryName, routes.Performance, routes.analysis);

// This is app initialization code
function init_app() {
//    All environments
    app.set('port', process.env.PORT || 8080);
//    Use html to do views
    app.set('views', path.join(__dirname, 'views'));
}



