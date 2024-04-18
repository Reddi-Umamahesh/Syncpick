const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const sessionOptoins = {
  secret: "Mysecretcode",
  resave: false,
  saveUnintialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true, //security purpose
  },
};

app.use(session(sessionOptoins));
app.use(flash());

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
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
});

//Error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Worng" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
