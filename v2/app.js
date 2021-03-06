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
  created : { type : Date , default : Date.now() }
});
var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req,res){
  Campground.find({},function(error, campgrounds){
    if(error){
      console.log("Database Error");
    } else {
      res.render("gallery",{campgrounds : campgrounds});
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
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(req,res){
  res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id, function(error, campground){
    if(error){
      console.log("Cannot find campground");
    } else {
      res.render("show", {campground : campground});
    }
  });
});

app.listen(app.get('port'), function(){
  console.log("Yelp Camp Server Started !");
});
