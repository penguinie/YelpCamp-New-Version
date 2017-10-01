var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  title : String,
  image : String,
  description : String,
  created : { type : Date , default : Date.now() },
  comments : [{ type : mongoose.Schema.Types.ObjectId , ref : "Comment" }],
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
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
