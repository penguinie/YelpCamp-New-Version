var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      res.redirect("/campgrounds/"+req.params.id);
    } else {
      res.render("reviews/new",{campground : campground});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var description = req.body.description;
  var newComment  = {description : description};
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      res.redirect("/campgrounds");
    } else {
      Comment.create(newComment, function(error, comment){
        if(error){
          res.redirect("/campgrounds/"+req.params.id+"/reviews/new");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.author.name = req.user.name;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Your review has been added successfully.");
          res.redirect("/campgrounds/"+req.params.id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(error, comment){
    if(error){
      res.redirect("back");
    } else {
      res.render("reviews/edit", { campground_id : req.params.id, comment : comment });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, comment){
    if(error){
      res.redirect("back");
    } else {
      req.flash("success", "Review updated successfully.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(error){
    if(error){
      res.redirect("back");
    } else {
      req.flash("success", "Review deleted successfully.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

module.exports = router;
