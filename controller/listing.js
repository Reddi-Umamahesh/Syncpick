const listing = require("../models/listing.js");
module.exports.index = async (req, res, next) => {
  const listings = await listing.find({});
  res.render("./listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  const newpost = new listing(req.body.listing);
  newpost.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(newpost);
  newpost.image = { url, filename };
  await newpost.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListings = async (req, res, next) => {
  const id = req.params.id;
  const post = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!post) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { post });
};

module.exports.renderUpdateForm = async (req, res, next) => {
  const id = req.params.id;
  const post = await listing.findById(id);
  if (!post) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { post });
};
module.exports.update = async (req, res, next) => {
  const id = req.params.id;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroy = async (req, res, next) => {
  const id = req.params.id;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
