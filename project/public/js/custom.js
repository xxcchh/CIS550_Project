// google search
var google = require('google');
var open = require('open');
var googleSearch = function(text){

    google.resultsPerPage = 5;
    var nextCounter = 0;
     
    google(text, function (err, res){
    
      if (err) {
          console.error(err);
      }
      else{
        var link = res.links[1];
        console.log(link.title + ' - ' + link.href);
        console.log(link.description + "\n");
        open(link.href);
      }
     
      // for (var i = 0; i < res.links.length; ++i) {
      //   var link = res.links[i];
      //   console.log(link.title + ' - ' + link.href)
      //   console.log(link.description + "\n")
      // }
     
      // if (nextCounter < 4) {
      //   nextCounter += 1
      //   if (res.next) res.next()
      // }
    });

}

// googleSearch('Rio 2016');

$(document).ready(function() {
        var lolz = $('#s');
        var kk = $('#kk');
        kk.click(function() {
            alert(lolz.val());
        });
});