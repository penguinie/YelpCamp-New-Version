var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

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
  comments : [{ type : mongoose.Schema.Types.ObjectId , ref : "Comment" }]
});
var Campground = mongoose.model("Campground", campgroundSchema);

var commentSchema = new mongoose.Schema({
  author : String,
  description : String,
  created : { type : Date, default : Date.now() }
});
var Comment = mongoose.model("Comment", commentSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/", function(req, res){
  res.render("home");
});

//=============================
//CAMPGROUND ROUTES
//=============================

app.get("/campgrounds", function(req,res){
  Campground.find({},function(error, campgrounds){
    if(error){
      console.log("Database Error");
      res.redirect("home");
    } else {
      res.render("campgrounds/gallery",{campgrounds : campgrounds});
    }
  });
});

app.post("/campgrounds",function(req,res){
  var title       = req.body.title;
  var image       = req.body.image;
  var description = req.body.description;
  var newCampground = { title : title, image : image, description : description };
  Campground.create(newCampground, function(error, campground){
    if(error){
      console.log("Error occured during campground creation");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(req,res){
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

//=============================
//COMMENT ROUTE
//=============================

app.get("/campgrounds/:id/reviews/new", function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log("Error Occured");
      res.redirect("/campgrounds/"+req.params.id);
    } else {
      res.render("reviews/new",{campground : campground});
    }
  });
});

app.post("/campgrounds/:id/reviews", function(req, res){
  var author      = req.body.author;
  var description = req.body.description;
  var newComment  = {author : author, description : description};
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log("Error occured while finding the campground");
      res.redirect("/campgrounds");
    } else {
      Comment.create(newComment, function(error, comment){
        if(error){
          console.log("Error occured while creating comment");
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+req.params.id);
        }
      });
    }
  });
});

app.listen(app.get('port'), function(){
  console.log("Yelp Camp Server Started !");
});
