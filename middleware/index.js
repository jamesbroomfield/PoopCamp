const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){  //N.b - this OR statement handles an error - see bottom for full info
                req.flash("error", "Hmm. That campground doesn't appear to be here. Sorry and that.");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }		
            }
        });
    } else {
        req.flash("error", "Rat farts! You'll need to log in first, chum.");
        res.redirect("back");
    }
};
 
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){ //again, check note at bottom for explanation here
                req.flash("error", "Hmm. That comment doesn't appear to exist. Not sure what to say.");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }		
            }
        });
    } else {
        req.flash("error", "Rat farts! You'll need to log in first, chum.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Rat farts! You'll need to log in first, chum.");
    res.redirect("/login");
};


module.exports = middlewareObj;

//OK, that OR  (||) statement. Basically, it's really easy to break the app by mucking with the address when it contains IDs
// like the ones MongoDB uses. If you alter the part of the address thats the ID but just by one character so it's still a valid
// mongoDB ID, then the DB will search for it and return NULL. It' doesn't cause an error so the code continues to run. Then when
//you try to update or edit something with the wrong ID, it crashes cause the variable is NULL. This OR statement checks for an 
//error, if there is none it then checks that the variable is not null. !null returns true for some weird reason so OR can be used 
//to handle it.