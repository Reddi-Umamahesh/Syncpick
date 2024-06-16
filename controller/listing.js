const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res, next) => {
  const listings = await listing.find({});

  res.render("./listings/index.ejs", { listings });
};
module.exports.category = async (req, res) => {
  const queryString = req.query.q;
  const listings = await listing.find({ category: queryString });
  if (listings.length == 0) {
    res.render("./listings/noServices.ejs", { queryString });
  } else {
    res.render("./listings/category.ejs", { listings, queryString });
  }
};
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  const newpost = new listing(req.body.listing);
  newpost.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(newpost);
  newpost.image = { url, filename };
  console.log(mapToken);
  let response = await geocodingClient
    .forwardGeocode({
      query: newpost.location,
      limit: 1,
    })
    .send();
  console.log(response.body.features[0].geometry);
  newpost.geometry = response.body.features[0].geometry;
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
  let originalUrl = post.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");
  console.log(originalUrl);
  if (!post) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { post, originalUrl });
};
// module.exports.update = async (req, res, next) => {
//   const id = req.params.id;

//   let temp = await listing.findByIdAndUpdate(id, { ...req.body.listing });
//   if (typeof req.file !== undefined) {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     temp.image = { url, filename };
//     await temp.save();
//   }
//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };
// module.exports.destroy = async (req, res, next) => {
//   const id = req.params.id;
//   await listing.findByIdAndDelete(id);
//   req.flash("success", "Listing Deleted!");
//   res.redirect("/listings");
// };
module.exports.update = async (req, res, next) => {
  const id = req.params.id;

  // Update the listing with the new data
  let temp = await listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // Update the image if a new one is provided
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    temp.image = { url, filename };
  }

  // Geocode the new location to get the coordinates
  if (req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (response.body.features.length > 0) {
      temp.geometry = response.body.features[0].geometry;
    }
  }
  console.log(temp);
  // Save the updated listing
  await temp.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroy = async (req, res, next) => {
  const id = req.params.id;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
