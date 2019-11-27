////////////////////
// dependencies
////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const app = require("express");
const exphbs = require("express-handlebars");
const db = mongoose.connection;

////////////////////
// scrapper's
////////////////////

const request = require("request");
const cheerio = require("cheerio");

////////////////////
// port
////////////////////

const port = process.env.PORT || 3000

app.listen(PORT, function() {
     console.log(
       "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
       PORT,
       PORT
     );
   });