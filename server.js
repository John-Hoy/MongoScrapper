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
     request("https://www.nytimes.com/", (err, response, html) => {
          let $ = cheerio.load(html);
          $("artcile").each((i, element) => {
               let result = {};

               summary = ""
               if ($(this).find("ul").length) {
                    summary = $(this).find("li").first().text();
               } else {
                    summary $(this).find("p").text();
               };

               result.title = $(this).find("h2").text();
               result.summary = summary;
               result.link = `https://www.nytimes.com${$(this).find("a").attr("href")}`;
          })
     })

});

app.get("/articles", (res, res) => {
     Article.find({}, (err, data) => {
          if (err) {
               console.log(err);
          } else {
               res.json(data);
          }
     });
});

app.get("/articles:id", (res, res) => {
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

app.post("/articles/save:id", (res, res) => {
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

app.post("/articles/delete:id", (res, res) => {
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