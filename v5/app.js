var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    passport              = require("passport");
    passportLocal         = require("passport-local");
    expressSession        = require("express-session");

var app = express();

mongoose.connect("mongodb://localhost/yelp_camp_new_v2");
app.set('port',(process.env.PORT) || 5000);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

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

var userSchema = new mongoose.Schema({
  name : String,
  username : String,
  password : String
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("user", userSchema);

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
	next();
});

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req,res){
  Campground.find({},function(error, campgrounds){
    if(error){
      console.log("Database Connection Error");
      res.redirect("home");
    } else {
      res.render("campgrounds/gallery",{campgrounds : campgrounds});
    }
  });
});

app.post("/campgrounds", isLoggedIn ,function(req,res){
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
      console.log("Error occured during campground creation");
      res.redirect("/campgrounds/new");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(error, campground){
    if(error){
      console.log("Cannot find campground");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", {campground : campground});
    }
  });
});

app.get("/campgrounds/:id/reviews/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log("Error Occured");
      res.redirect("/campgrounds/"+req.params.id);
    } else {
      res.render("reviews/new",{campground : campground});
    }
  });
});

app.post("/campgrounds/:id/reviews", isLoggedIn, function(req, res){
  var description = req.body.description;
  var newComment  = {description : description};
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log("Error occured while finding the campground");
      res.redirect("/campgrounds");
    } else {
      Comment.create(newComment, function(error, comment){
        if(error){
          console.log("Error occured while creating comment");
          res.redirect("/campgrounds/"+req.params.id+"/reviews/new");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.author.name = req.user.name;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+req.params.id);
        }
      });
    }
  });
});

app.get("/register", function(req, res){
  res.render("authentication/register");
});

app.post("/register", function(req, res){
  var newUser = new User({ name : req.body.name, username : req.body.username });
  User.register(newUser, req.body.password, function(error, user){
    if(error){
      console.log("Error occured while registering");
      return res.render("authentication/register");
    } else {
      passport.authenticate("local")(req,res, function(){
        res.redirect("/campgrounds");
      });
    }
  });
});

app.get("/login", function(req, res){
  res.render("authentication/login");
});

app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/authentication/login"
  }) ,function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(app.get('port'), function(){
  console.log("Yelp Camp Server Started !");
});
