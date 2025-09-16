const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async(req,res) =>{
    // res.send('You Made It!!')
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a New Review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res) =>{
    // res.send('Delete Me!!')
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' , 'successfully Deleted review')
    res.redirect(`/campgrounds/${id}`)
}