const joi = require("joi");
const review = require("./models/review");

const categoryOptions = [
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
];
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      contact: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
      category: joi
        .string()
        .valid(...categoryOptions)
        .required(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
