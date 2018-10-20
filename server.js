var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var exphbs = require("express-handlebars");

app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

require('./routes/routes.js')(app);


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });