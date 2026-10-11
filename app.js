const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/te";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
// Routes
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// INDEX
app.get("/listings", async (req, res) => {
  const allLi = await Listing.find({});
  res.render("listings/index", { allLi });
});

// NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// CREATE
app.post("/listings", async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating listing");
  }
});

// SHOW
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send("Listing not found");
    res.render("listings/show", { listing });
  } catch (err) {
    res.status(400).send("Invalid listing id");
  }
});
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    res.render("listings/show.ejs", { listing });
});
// DELETE
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
