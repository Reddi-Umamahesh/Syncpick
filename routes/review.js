const express = require("express");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({ mergeParams: true });
const review = require("../models/review.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};
//Reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newRev = new review(req.body.review);
    list.reviews.push(newRev);
    await newRev.save();
    await list.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${list.id}`);
  })
);

//Reviews Deletes
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
