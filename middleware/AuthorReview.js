import Review from "../models/Review.js"; // make sure the file name and case match

async function isReviewAuthor(req, res, next) {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if ( !review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

export default isReviewAuthor;
