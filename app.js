const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { type } = require("os");
const { Mongoose } = require("mongoose");
const listing = require("./models/listing");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/listings", async (req, res) => {
  const listings = await listing.find({});
  res.render("./listings/index.ejs", { listings });
});

app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post("/listings/new", async (req, res) => {
  const newpost = new listing(req.body.listing);
  if (newpost.image == "") {
    newpost.image =
      "https://images.unsplash.com/photo-1584661156681-540e80a161d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxMTY0NjAwOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080";
  }
  console.log(newpost);
  newpost.save();
  res.redirect("/listings");
});

app.get("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const post = await listing.findById(id);
  res.render("./listings/show.ejs", { post });
});

app.get("/listings/:id/edit", async (req, res) => {
  const id = req.params.id;
  const post = await listing.findById(id);
  console.log("edited", post);
  res.render("./listings/edit.ejs", { post });
});
app.put("/listings/:id", async (req, res) => {
  const id = req.params.id;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
app.delete("/listings/:id", async (req, res) => {
  const id = req.params.id;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
