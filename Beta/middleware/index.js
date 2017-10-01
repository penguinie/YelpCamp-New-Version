var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("warning", "You need to be logged in to do that");
  res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(error, campground){
      if(error){
        res.redirect("back");
      } else {
        if(campground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You do not have access to edit/delete someone's post.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("warning", "You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(error, comment){
      if(error){
        res.redirect("back");
      } else {
        if(comment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You do not have access to edit/delete someone's comment.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("warning", "You need to be logged in to do that");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
