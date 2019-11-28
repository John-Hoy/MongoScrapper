////////////////////
// dependencies
////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const exphbs = require("express-handlebars");
const db = mongoose.connection;

////////////////////
// morgan
////////////////////

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

////////////////////
// scrapper's
////////////////////

const request = require("request");
const cheerio = require("cheerio");

////////////////////
// port
////////////////////

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
     console.log(
       `==> 🌎  Listening on port. Visit http://localhost:${PORT}/ in your browser`
     );
   });