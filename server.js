var express = require('express');
var app = express();
var path = require('path');
var mongo = require("mongodb").MongoClient;
var urlRegex = require('url-regex');
var rg = require('rangen');
var validUrl = require('valid-url');
var dburl = process.env.dburl;


var myURL, checkURL, shortURL;
app.use('/',express.static('public'));

app.get('/new/:url(*)',function(req,res){

   myURL = req.params.url;
  
   if (validUrl.isUri(myURL)){
     mongo.connect(dburl, function (err, db) {
        if (err) {
          res.end('Unable to connect to the mongoDB server. Error:');
          return console.log(err);
        } else {
          console.log('Connection established to', dburl);
           
          var urlList = db.collection('urlList');
          var short = rg.id(2, 'n');
          
          urlList.insert([{url: myURL, short: short}],function(){
             var data = {
                         original_url: myURL,
                         short_url: 'http://'+req.headers['host']+'/'+short
                        }
            res.send(data);
           });
              
          db.close();
        }
    });
   
  } else {
   res.json({
      original: myURL,
      error: "is not a URL"
   });
  }

});

app.get('/:id',function(req,res){
  var id = req.params.id;
  
  mongo.connect(dburl, function (err, db) {
        if (err) {
          res.end('Unable to connect to the mongoDB server. Error:');
          return console.log(err);
        } else {
          console.log('Connection established to', dburl);
           
          var urlList = db.collection('urlList');
          
          urlList.find({short:id}).toArray(function(err,docs){
              if(err){
                  res.end('not found')
                  return console.log('read',err);
              } else {
                    if(docs.length>0){
                        db.close();
                        res.redirect(docs[0].url);
                    } else {
                        db.close();
                        res.end('error')
                    }
              }
          })

        }
    });

});


app.get('/', function(req, res) {
  var fileName = path.join(__dirname, '/views/index.html');
  res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
