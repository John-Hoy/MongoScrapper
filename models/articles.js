////////////////////
// dependencies
////////////////////

const mongoose = require("mongoose");
const Note = require("./notes");
const Schema = mongoose.Schema;

////////////////////
// schema
////////////////////

let ArticleInfo = new Schema({
     title: {
          type: String,
          required: true
     },
     summary: {
          type: String,
          required: true
     },
     link: {
          type: String,
          required: true
     },
     saved: {
          type: Boolean,
          default: false
     },
     notes: [{
          type: Schema.Types.ObjectId,
          ref: "note"
     }]
});

let Article = mongoose.model("Article", ArticleInfo);

////////////////////
// exports
////////////////////

module.exports = Article;