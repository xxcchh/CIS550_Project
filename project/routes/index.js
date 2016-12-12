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
var google = require('google')
var open = require('open')

var googleSearch = function(req, res){
    google.resultsPerPage = 5;
    google(req.s, function (err, res){
      if (err) {
          console.error(err);
      }
      else{
        var link = res.links[1];
        console.log(link.title + ' - ' + link.href);
        console.log(link.description + "\n");
        open(link.href);
      }
    });
};

var homepage = function(req, res){
    db.getShowOnHomePage(function(err, results){
    	if(err) throw err;
    	res.render('home', {data: results});
    });
}

// country related queries
var country = function(req, res){
	db.getMenAndWomenPerform(function(err, results){
		if(err) throw err;
		res.render('country', {data: results});
	});
}

var countryEconomics = function(req, res){

	db.getEconomicsOfHost(function(err, results){
		if(err) throw err;
		// console.log(results);
		// console.log(results[0][0]);
		res.render('economics', {
			data: results
		});
	});
}

function countryName(req, res, next){
	db.getTopMedalsOfCountry(function(err, results){
		if(err) throw err;
		req.cname = results;
		return next();
	});
}

function Performance(req, res, next){
	db.getMenAndWomenPerform(function(err, results){
		if(err) throw err;
		req.cperformance = results;
		next();
	});
}

var analysis = function(req, res){
	console.log("success");
	res.render("analysis", {
		cname: req.cname,
		cperformance: req.cperformance
	});
	// });
}


// athletes related queries
var athletes = function(req, res){
	res.render('athletes', {});
}

// discipline related queries
var discipline = function(req, res){
	res.render('discipline', {});
}

module.exports = {
	homepage: homepage,
	country: country,
	athletes: athletes,
	discipline: discipline,
	countryEconomics: countryEconomics,
	analysis: analysis,
	countryName: countryName,
	Performance : Performance,
	googleSearch: googleSearch
}