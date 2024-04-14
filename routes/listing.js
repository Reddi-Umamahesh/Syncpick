const express = require("express");

const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router();

//validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};
//home
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await listing.find({});
    res.render("./listings/index.ejs", { listings });
  })
);
//create new
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});
//create new
router.post(
  "/new",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newpost = new listing(req.body.listing);
    if (newpost.image == "") {
      newpost.image =
        "https://images.unsplash.com/photo-1584661156681-540e80a161d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxMTY0NjAwOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080";
    }
    console.log(newpost);
    newpost.save();
    res.redirect("/listings");
  })
);
//show
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { post });
  })
);
//update
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await listing.findById(id);
    res.render("./listings/edit.ejs", { post });
  })
);
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
