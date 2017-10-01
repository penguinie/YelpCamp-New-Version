var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    passport              = require("passport");
    passportLocal         = require("passport-local");
    expressSession        = require("express-session");
    methodOverride        = require("method-override");
    flash                 = require("connect-flash");
    Campground            = require("./models/campground");
    Comment               = require("./models/comment");
    User                  = require("./models/user");
    campgroundRoutes      = require("./routes/campgrounds");
    commentRoutes         = require("./routes/comments");
    indexRoutes           = require("./routes/index");

var app = express();

mongoose.connect("mongodb://localhost/yelp_camp_new_v2");

app.set('port',(process.env.PORT) || 5000);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(expressSession({
  secret : "Once upon a time, there was a lion in my garden !",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  res.locals.register = req.flash("register");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", commentRoutes);

app.listen(app.get('port'), "0.0.0.0" , function(){
  console.log("Yelp Camp Server Started !");
});
