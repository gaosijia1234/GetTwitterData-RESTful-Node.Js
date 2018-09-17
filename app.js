const favs = require('./favs.json');
var express = require('express'),
  path = require('path'),
  app = express();

//set the port
app.set('port', 8080);

//tell express that we want to use the static folder
//for our static assets
app.use(express.static(path.join(__dirname, './static')));

// Listen for requests
var server = app.listen(app.get('port'), function () {
  console.log('The server is running on http://localhost:' + app.get('port'));
});

app.get('/api', function (req, res) {
  res.json(favs);
});

//Get all tweets (create time, id, and tweet text) available in the archive.
app.get('/api/createTweets', function (req, res) {
    var data = [];
    for( var i = 0; i < favs.length; i++){
        data.push({"time":favs[i].created_at,"id":favs[i].id,"text":favs[i].text});
    }
    res.json(data);
});

//Get all known Twitter users included in the archive.
app.get('/api/createUsers', function (req, res) {
    var data = [];
    for( var i = 0; i < favs.length; i++){
        data.push(favs[i].user);
    }
    res.json(data);
});

//Get a list of all external links (all links that appear in any field of a tweet.
// Use regular expressions) included in the tweets from the archive,
// the links should be grouped based on tweet ids.
app.get('/api/createLinks', function (req, res) {
    var data = {}; // make data an object

    for( var i = 0; i < favs.length; i++){
        var idAndLink = [];
        for (var j = 0; j < favs[i].entities.urls.length; j++){
        idAndLink.push(favs[i].entities.urls[j].url);
        }

        data[favs[i].user.id]= idAndLink;// the key of the data object is the id
    }
    res.json(data);
});

// Get the details about a given tweet (given the tweet’s id).
// :id reads, and put it as params.id with the name after :
app.get('/api/findTweetsById/:id', function (req, res) {
    res.json(favs.filter(tweet => tweet.id_str === req.params.id)[0]);
});

//Get detailed profile information about a given Twitter user (given the user’s screen name).
app.get('/api/findProfileByName/:name', function (req, res) {
    var user = favs.filter(tweet => tweet.user.name === req.params.name)[0].user;
    var data = {};
    for(key of Object.keys(user))
        if(key.indexOf("profile") == 0)
            data[key] = user[key];
    res.json(data);

});


// another way of the for loop
// for(url of favs[i].entities.urls)
//   data.push(url.url);