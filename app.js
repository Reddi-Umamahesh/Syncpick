const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { type } = require("os");
const { Mongoose } = require("mongoose");
const listing = require("./models/listing");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Syncpick");
}

port = 8080;
app.listen(port, (req, res) => {
  console.log("app is listining");
});
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
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};
//home
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const listings = await listing.find({});
    res.render("./listings/index.ejs", { listings });
  })
);
//create new
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});
//create new
app.post(
  "/listings/new",
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
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { post });
  })
);
//update
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await listing.findById(id);
    res.render("./listings/edit.ejs", { post });
  })
);
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Worng" } = err;
  console.log(err);
  console.log("error occured");
  res.status(statusCode).render("./error.ejs", { err });
});

//Reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res, next) => {
    let list = await listing.findById(req.params.id);
    let newRev = new review(req.body.review);
    list.reviews.push(newRev);
    await newRev.save();
    await list.save();
    res.redirect(`/listings/${list.id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
});
