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
// handlebars
////////////////////

app.engine("handlebars", exphbs({
     defaultLayout: "main",
     partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

////////////////////
// mongoose
////////////////////

// mongoose.connect("mongodb://HEROKU DATABASE");
mongoose.connect("mongodb://localhost/mongoscrapper");

db.on("error", function (error) {
     console.log("Mongoose Error: ", error);
});

db.once("open", function () {
     console.log("Mongoose connection successful.");
});

////////////////////
// routes
////////////////////

app.get("/", (req, res) => {

});

app.get("/saved", (req, res) => {

});

app.get("/scrapper", (req, res) => {

});

app.get("/articles", (res, res) => {

});

app.get("/articles:id", (res, res) => {

});

app.post("/articles/save:id", (res, res) => {

});

app.post("/articles/delete:id", (res, res) => {

});

app.post("/notes/saved:id", (req, res) => {

});

app.delete("notes/delete:id", (req, res) => {

});
////////////////////
// port
////////////////////

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
     console.log(
          `==> 🌎  Listening on port. Visit http://localhost:${PORT}/ in your browser`
     );
});