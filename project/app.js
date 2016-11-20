/**
 * Created by chen on 11/20/16.
 */


var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , stylus = require('stylus')
    , nib = require('nib')
    , cons  = require('consolidate')
;

// Initialize express
var app = express()

// View engine setup use html
app.engine('html', cons.swig)
app.set('view engine', 'html');







init_app(app)


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
app.get('/', function (req, res) {
    res.send('Express Works');
});
app.listen(app.get('port'), function () {
    console.log('Express started press Ctril-C to terminate');
});


// This is app initialization code
function init_app() {
//    All environments
    app.set('port', process.env.PORT || 8080)
//    Use html to do views
    app.set('views', path.join(__dirname, 'views'));
    

}



