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
// get article and note
////////////////////

const Article = require("./models/articles");
const Note = require("./models/notes");

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

const axios = require("axios");
const cheerio = require("cheerio");

////////////////////
// handlebars
////////////////////

app.engine("handlebars", exphbs({
     defaultLayout: "main",
     partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");
app.use(express.static("public"));
////////////////////
// mongoose
////////////////////

// mongoose.connect("mongodb://HEROKU DATABASE");
mongoose.connect("mongodb://localhost/mongoscrapper");

db.on("error", (error) => {
     console.log(`Mongoose Error:${error}`);
});

db.once("open", () => {
     console.log("Mongoose connection successful.");
});

////////////////////
// routes
////////////////////

app.get("/", (req, res) => {
     Article.find({ "saved": false }, (err, data) => {
          let hbsObject = {
               article: data
          };
          console.log(hbsObject);
          res.render("home", hbsObject);
     });
});

app.get("/saved", (req, res) => {
     Article.find({ "saved": true }).populate("notes").exe((err, articles) => {
          let hbsObject = {
               article: articles
          };
          res.render("saved", hbsObject);
     });
});

app.get("/scrapper", (req, res) => {
     axios.get("http://www.artnews.com/category/news/").then((response) => {
          var $ = cheerio.load(response.data);

          $("h2.entry-title").each((i, element) => {
               var result = {};

               result.title = $(element).text();

               result.link = $(element).children("a").attr("href");

               result.summary = $(element).siblings(".entry-summary").text().trim();

               db.Article.create(result)
                    .then((dbArticle) => {
                         console.log(dbArticle);
                    })
                    .catch((err) => {
                         console.log(err);
                    });
          });
     });
     res.send("Scrape Complete");
});

app.get("/articles", (req, res) => {
     Article.find({}, (err, data) => {
          if (err) {
               console.log(err);
          } else {
               res.json(data);
          }
     });
});

app.get("/articles:id", (req, res) => {
     Article.findOne({ "_id": req.params.id })
          .populate("note")
          .exec((err, data) => {
               if (err) {
                    console.log(err);
               } else {
                    res.json(data);
               }
          });
});

app.post("/articles/save:id", (req, res) => {
     Article.findOneAndUpdate({ "_id": req.params.id }, {
          "saved": true
     })
          .exec((err, data) => {
               if (err) {
                    console.log(err);
               } else {
                    res.send(data);
               }
          });
});

app.post("/articles/delete:id", (req, res) => {
     Articles.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
          .exec((err, data) => {
               if (err) {
                    console.log(err);
               } else {
                    res.send(data);
               }
          });
});

app.post("/notes/save/:id", (req, res) => {
     let newNote = new Note({
          body: req.body.text,
          article: req.params.id
     });
     console.log(req.body);
     newNote.save((err, note) => {
          if (err) {
               console.log(err);
          } else {
               Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
                    .exec((err) => {
                         if (err) {
                              console.log(err);
                              res.send(err)
                         } else {
                              res.send(note);
                         }
                    });
          }
     });
});

app.delete("notes/delete:id", (req, res) => {
     Note.findOneAndRemove({ "_id": req.params.note_id },
          (err) => {
               if (err) {
                    console.log(err);
                    res.send(err);
               } else {
                    Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
                         .exec((err) => {
                              if (err) {
                                   console.log(err);
                                   res.send(err);
                              } else {
                                   res.send("Note Deleted");
                              }
                         });
               }
          });
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