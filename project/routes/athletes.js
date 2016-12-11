var db = require('../db');

// athletes related queries
var getAllAthlete = function(req, res){
    db.getAllAthlete(function(err, results){
        if(err) throw err;
        res.render('athletes', {data: results});
    });
}

var getProfile = function(req,res){
    var name = req.body.swimmer;

    db.getProfile(name, function(err,results){
        if (err) throw err;
        res.render('test2',{
            data:results
        });
    });
}
module.exports = {
    getAllAthlete: getAllAthlete,
    getProfile: getProfile
}


// app.post('/api/book', function(req, res, next){
//     var cope = req.body.params;
//     var query = connection.query('insert into cope set ?', cope, function(err, result) {
//         if (err) {
//             console.error(err);
//             return res.send(err);
//         } else {
//             return res.send('Ok');
//         }
//     });