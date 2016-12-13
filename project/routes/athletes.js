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
};

var getPerformance = function (req, res, next){
    var num = 50;
    db.getTopNAthletes(num, function(err,results){
        if (err) throw err;
        req.data1 = results;
        return next();
    });
};

var getPhelpsvscountry = function (req,res, next){
    db.getPHILPS(function(err,results){
        if (err) throw err;
        req.data2 = results;
        next();
    });
}

var athletesanalysis = function(req,res){
    console.log("athletesanalysis success");
    res.render("athletesanalysis", {
        data1 : req.data1,
        data2 : req.data2
    });
};


// function countryName(req, res, next){
//     db.getTopMedalsOfCountry(function(err, results){
//         if(err) throw err;
//         req.cname = results;
//         return next();
//     });
// }
//
// function Performance(req, res, next){
//     db.getMenAndWomenPerform(function(err, results){
//         if(err) throw err;
//         req.cperformance = results;
//         next();
//     });
// }
//
// var analysis = function(req, res){
//     console.log("success");
//     res.render("analysis", {
//         cname: req.cname,
//         cperformance: req.cperformance
//     });
//     // });
// }
//
// async.parallel([
//     function(err,results) { db.getTopNAthletes(function(err,results)) },
//     function(err,results) { db.getPHILPS(function(err,results)) }
// ], function(err, results) {
//     res.render('athletesanalysis', { data1 : results[0], data2 : results[1] });
// });



module.exports = {
    getAllAthlete: getAllAthlete,
    getAthleteslist: getAthleteslist,
    getPerformance: getPerformance,
    getPhelpsvscountry: getPhelpsvscountry,
    athletesanalysis: athletesanalysis
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