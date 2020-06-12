var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware")


//ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});

//==============
//AUTH ROUTES
//==============

//Registration form SHOW ROUTE
router.get("/register", (req, res)=>{
	res.render("register");
});

//Registration form CREATE ROUTE
router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Congratulations, " + newUser.username + ". You're registered!");
			res.redirect("/campgrounds");
		});
	});
});


//Login SHOW ROUTE
router.get("/login", (req, res)=>{
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res)=>{
});

//LOGOUT ROUTE
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "Well done, you logged out.");
    res.redirect("/campgrounds");
});


module.exports = router;