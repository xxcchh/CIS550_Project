exports.home = function(req, res){
  res.render('test.ejs', {});
};
exports.country = function(req, res){
  res.render('country.ejs', {});
};
exports.athletes= function(req, res){
  res.render('athletes.ejs', {});
};
exports.discipline = function(req, res){
  res.render('discipline.ejs', {});
};