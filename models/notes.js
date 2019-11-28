////////////////////
// dependencies
////////////////////

const mongoose = require("mongoose");

////////////////////
// schema
////////////////////

const Schema = mongoose.Schema;

let NoteInfo = new Schema({
     body: {
          type: String
     },
     article: {
          type: Schema.Types.ObjectId,
          ref: "Article"
     }
});

let Note = mongoose.model("Note", NoteInfo);

////////////////////
// export
////////////////////

module.exports = Note;