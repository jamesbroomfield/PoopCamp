//require statements for all the node.js packages we're using and have installed
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),

	
	//requiring the MongoDB models we've written
	Campground = require("./models/campground"),
	Comment = require("./models/comment",),
	User = require("./models/user"),
	
	//requires the SeedDB js file we wrote to wipe and re-seed the database when the server starts
	//this was for testing really and the bit where it's called is now commented out
	seedDB = require("./seeds");

//Requiring Routes which are separate js files (i.e. not in app.js)
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

//Wipes DB and reseeds with fresh data every server restart
//seedDB();

//Express session setup
app.use(require("express-session")({
	secret: "Puppy smells of wee and sausages.",
	resave: false,
	saveUninitialized: false
}));

//Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

//This statement adds the variable currentUser to every route 
//so from anywhere you can check the currently logged in user.
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//Connect to MongoDB datatbase - first argument is location of DB, second just gets rid of some deprecation warnings
mongoose.connect("mongodb://localhost/poop_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//Tells the app to use bodyParser to deal with form submissions
app.use(bodyParser.urlencoded({extended: true}));

//Tells the app to look for ejs files in the views folder, no need to put the path or the file extension when calling
app.set("view engine", "ejs");

//Tells app where to find ???
app.use(express.static(__dirname + "/public"));

//Allows forms to submit PUT and DELETE methods (they can only use POST under HTML rules)
app.use(methodOverride("_method"));



//Tells the app to use the separate files established above for completing routes - i.e. they're not in the app.js file
//N.b the first argument shows the common structure of all routes so you only have to write the unique bits in the actual route js file.
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


//SERVER SETUP
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("PoopCamp server Has Started!");
});