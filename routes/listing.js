const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
//validation

//home
router.get("/", wrapAsync(listingController.index));
router.get("/cat", wrapAsync(listingController.category));
//create new
router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewForm)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
//show
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));

//update
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderUpdateForm)
);

module.exports = router;
