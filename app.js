if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./models/listing.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");
const db_url = process.env.ATLAS_DB_URL;
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const Store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
Store.on("error", () => {
  console.log("error in Mongo Session Store", error);
});
const sessionOptoins = {
  Store,
  secret: process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

main();
port = 8080;
app.listen(port, (req, res) => {
  console.log("app is listining");
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.get("/", async (req, res) => {
  const listings = await listing.find({});
  res.render("./listings/index.ejs", { listings });
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
});

//Error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Worng" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
