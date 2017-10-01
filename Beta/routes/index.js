var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("home");
});

router.get("/register", function(req, res){
  res.render("authentication/register");
});

router.post("/register", function(req, res){
  var newUser = new User({ name : req.body.name, username : req.body.username });
  User.register(newUser, req.body.password, function(error, user){
    if(error){
      req.flash("register", error.message);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req,res, function(){
        req.flash("success", "Welcome to YelpCamp! You have registered yourself successfully.");
        res.redirect("/campgrounds");
      });
    }
  });
});

router.get("/login", function(req, res){
  res.render("authentication/login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }) ,function(req, res){
});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You have been logged out successfully.")
  res.redirect("/campgrounds");
});

module.exports = router;
