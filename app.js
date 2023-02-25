//jshint esversion:6

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;
console.log(process.env.API_KEY);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParse.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
// Viktigt att plugin() är innan mongoose.model()

const User = mongoose.model("User", userSchema);

//--------------------- Requests Targetting  ---------------------
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    //console.log(foundUser);
    if (err) {
      console.log(err.message);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

//--------------------------- Server ----------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
