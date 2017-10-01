var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  description : String,
  created : { type : Date, default : Date.now() },
  author : {
    id :
    {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "User"
    },
    username : String,
    name : String
  }
});
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
