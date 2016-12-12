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
    , bodyParser = require('body-parser')
    , athletes = require('./routes/athletes')
;

// Initialize expres
var app = express();

// View engine setup use ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Set static files
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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

//  When we get a request for {app}/ we should call routes/index.js
// app.get('/', function (req, res) {
    // res.send('Express Works');
    // res.render('home.ejs')
//     res.render('test.ejs')
// });

// //  We have country, athlete, discipline
// app.get('/country', routes.country);
// app.get('/athlete', routes.athlete);
// app.get('/discipline', routes.discipline);

app.get('/', routes.homepage);
app.get('/country', routes.country);
app.get('/athletes', athletes.getAllAthlete);
app.get('/profile', athletes.getProfile);
app.get('/discipline', routes.discipline);

var jsonParser = bodyParser.json();
app.post('/profile', jsonParser, athletes.getProfile);

// This is a test page
app.get('/testquery', routes.testquery);

// This is app initialization code
function init_app() {
//    All environments
    app.set('port', process.env.PORT || 8080);
//    Use html to do views
    app.set('views', path.join(__dirname, 'views'));
}



