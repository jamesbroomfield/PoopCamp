const 	express = require("express"),
 		router = express.Router({mergeParams: true}),
 		Campground = require("../models/campground"),
 		middleware = require("../middleware");


//INDEX ROUTE
router.get("/", (req, res)=>{	
	Campground.find({}, (err, campgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:campgrounds, currentUser:req.user});
		}
	});	
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	// let name = req.body.name;
	// let price = req.body.price;
	// let image = req.body.image;
	// let desc = req.body.description;
	// let author = {
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	let newCampground = {
		name: req.body.name, 
		price: req.body.price, 
		image: req.body.image, 
		description: req.body.description, 
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "New campsite created.");
			res.redirect("/campgrounds"); 
		}
	});	
});

//SHOW ROUTE
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundSite) {
		if (err || !foundSite){ //see end of middleware/index.js if you can't remember why we do this.
		req.flash("error", "Hmm, something has gone terribly wrong. Sorry.");	
		res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundSite});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=> {
			Campground.findById(req.params.id, function(err, foundCampground){
					res.render("campgrounds/edit", {campground: foundCampground});
			});		
});

//UPDATE ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campsite updated.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DESTROY ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
			req.flash("success", "Campsite deleted.");
            res.redirect("/campgrounds");
        }
    });
});







//EXPORT STATEMEMT
module.exports = router;