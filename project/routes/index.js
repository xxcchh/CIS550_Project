// exports.home = function(req, res){
//   res.render('test.ejs', {});
// };
// exports.country = function(req, res){
//   res.render('country.ejs', {});
// };
// exports.athletes= function(req, res){
//   res.render('athletes.ejs', {});
// };
// exports.discipline = function(req, res){
//   res.render('discipline.ejs', {});
// };
var db = require('../db');


var homepage = function(req, res){
    // var x = request('http://www.youtube.com/embed/XGSy3_Czz8k')
    // req.pipe(x)
    // x.pipe(res)
	res.render('test', {});
}

// This is a test method
var testquery = function(req, res){
	// db.getTopMedalsOfCountry(function(err, results){
	db.getMenAndWomenPerform(function(err, results){
		if(err) throw err;
		res.render('testquery', {data: results});
	});
	// res.render('testquery', {});
}


// country related queries
var country = function(req, res){
	db.getMenAndWomenPerform(function(err, results){
		if(err) throw err;
		res.render('country', {data: results});
	});
}


// //athletes related queries
// //this is a test query
// //pass angularjs variable to node
// var athletes = function(req,res){
//     var name = req.body.swimmer;
//
//     db.getProfile(name, function(err,results){
//         if (err) throw err;
//         res.render('athletes',{
//             data:results
//         });
//     });
// }

// discipline related queries
var discipline = function(req, res){
	res.render('discipline', {});
}

module.exports = {
	homepage: homepage,
	country: country,
	// athletes: athletes,
	discipline: discipline,
	testquery: testquery
}