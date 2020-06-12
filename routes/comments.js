var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//COMMENTS NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			res.flash("error", "Crazy, that campsite don't exist.");
			res.redirect("back");
		} else {
			res.render("comments/new", {campground: campground});	
		}
	});
});

//COMMENTS CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if (err){
					req.flash("error", "Hmm, something went wrong. Bad luck.");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "New comment added.");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});



router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if(err || !foundCampground){
			req.flash("error", "That campground doesn't seem to exist here, pal.");
			return res.redirect("back");			
		}
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
	})
});

//COMMENTS UPDATE ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment Updated.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//COMMENTS DESTROY!!!! ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership,  (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
			req.flash("success", "Comment deleted.");
            res.redirect("back");
        }
    });
});



//Export statement
module.exports = router;