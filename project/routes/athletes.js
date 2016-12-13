var db = require('../db');



// athletes related queries
var getAllAthlete = function(req, res){
    db.getAllAthlete(function(err, results){
        if(err) throw err;
        res.render('athletes', {data: results});
    });
};

var getProfile = function(req,res){
    // var name = req.body.swimmer;
    var key = 1;

    db.getProfile(key, function(err,results){
        if (err) throw err;

        res.render('profile',{
            data:results
        });
        return res.json(results);
    });
};

var getAthleteslist = function(req,res){
    db.showAthleteProfile(function(err,results){
        if (err) throw err;
        res.render('athleteslist',{data:results});
    });
}

var getPerformance = function (req, res){
    var num = 10;
    db.getTopNAthletes(num, function(err,results){
        if (err) throw err;
        res.render('athletesanalysis', {data:results});
    });
}

module.exports = {
    getAllAthlete: getAllAthlete,
    getProfile: getProfile,
    getAthleteslist: getAthleteslist,
    getPerformance: getPerformance
};


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