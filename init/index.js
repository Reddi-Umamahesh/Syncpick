const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listing.js");

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Syncpick");
}

const initDb = async () => {
  await listing.deleteMany({});
  await listing.insertMany(data.data);
  console.log("data inserted");
};
initDb();
