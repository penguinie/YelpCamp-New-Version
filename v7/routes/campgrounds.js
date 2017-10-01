var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

router.get("/", function(req,res){
  Campground.find({},function(error, campgrounds){
    if(error){
      res.redirect("home");
    } else {
      res.render("campgrounds/gallery",{campgrounds : campgrounds});
    }
  });
});

router.post("/", middleware.isLoggedIn ,function(req,res){
  var title       = req.body.title;
  var image       = req.body.image;
  var description = req.body.description;
  var author      = {
    id : req.user._id,
    username : req.user.username,
    name : req.user.name
  }
  var newCampground = { title : title, image : image, description : description, author : author };
  Campground.create(newCampground, function(error, campground){
    if(error){
      res.redirect("/campgrounds/new");
    } else {
      req.flash("success", "Campground created successfully.");
      res.redirect("/campgrounds");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(error, campground){
    if(error){
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", {campground : campground});
    }
  });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    res.render("campgrounds/edit", {campground : campground});
  });
});

router.put("/:id", middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, campground){
    if(error){
      res.redirect("/campgrounds/"+req.params.id+"/edit");
    } else {
      req.flash("success", "Campground updated successfully.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(error){
    if(error){
      res.redirect("/campgrounds/"+req.params.id);
    } else {
      req.flash("success", "Campground deleted successfully.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
