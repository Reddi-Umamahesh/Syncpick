const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  category: {
    type: String,
    enum: [
      "general contractor",
      "plumber",
      "electrician",
      "hvac",
      "carpenter",
      "painter",
      "masonry",
      "solar",
      "house repairs",
      "pool & spa",
      "renovation",
      "fence",
      "cement",
      "others",
    ],
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const listing = mongoose.model("listings", listingSchema);
module.exports = listing;
