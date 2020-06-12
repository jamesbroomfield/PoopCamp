var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Guffy Acres",
        image: "https://i2-prod.cambridge-news.co.uk/incoming/article12958592.ece/ALTERNATES/s1200b/Campsites.jpg",
        description: "A faint odour of beef wellington drifts over your pitch as you wake from consequetive fever dreams in which you were forced to inhale the trouser-breezes of several swarthy gentlemen from the South. 'Good Lord', you imagine yourself opining, 'Can it really be that this malodorous scent attracts the finest of miscreant badgers from all four corners of the wood to dance merrily in the evening sun for the pleasure of mine eyes?'"
    },
    {
        name: "Brownton Grounds",
        image: "https://www.telegraph.co.uk/content/dam/Travel/2016/July/camp-gwern-gof.jpg",
        description: "Everything here is tinged with the sepia tones of pant poopage. Embrace it, or exhaust yourself fighting the turd reality. Visit the campsite shop and buy some corrective glasses, the lenses of which purport to add other colours to nature's limited palette but be aware that these colours are beige, hazlenut and bumsludge."
    },
    {
        name: "Death Camp 2000",
        image: "https://assets.bedful.com/images/334484fb3277ecac8cd9557dd96941de46c4e315/small/Cuckoo%20Farm%20Campsite.jpg",
        description: "Built on the site of an Indian burial ground which was itself built on the site of a filthy pit, this site remains more the latter than the former. Do not sleep. Do not sleep for all who sleep find themselves trapped in a fever-dream, unable to wake until they've solved a rubiks cube that oozes salad cream from between it's ever-greasening cubes."
    }
];



function seedDB(){
   Campground.deleteMany({}, (err)=>{
    if(err){
        console.log(err);
    }
    console.log("removed campgrounds!");
    data.forEach(function(seed){
    Campground.create(seed, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("Created a Campground!!!");
            Comment.create({
                text: "Oh boy, this place really gave me the rogers!",
                author: "Fat Tony"
            }, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment!")
                }
            });
        }
    })
});
});

}

module.exports = seedDB;
