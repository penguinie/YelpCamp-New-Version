var express     = require("express"),
    bodyParser  = require("body-parser");

var app = express();

app.set('port',(process.env.PORT) || 5000);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

var Campgrounds = [
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"},
  {image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", title : "Nature's Beauty", description : "ABC"}
];

app.get("/", function(req, res){
  res.render("home");
});

app.get("/campgrounds", function(req,res){
  res.render("gallery",{campgrounds : Campgrounds});
});

app.post("/campgrounds",function(req,res){
  Campgrounds.push(req.body.campground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
  res.render("new");
});

app.listen(app.get('port'), function(){
  console.log("Yelp Camp Server Started !");
});
