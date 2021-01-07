const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://localhost:27017/authDEMO", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is home page");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) res.send("Welcome");
    else res.send("Try Again!");
  } catch (err) {
    res.send(err);
  }
});

app.get("/secret", (req, res) => {
  res.send("You cannot see me unless, you are logged IN!");
});

app.listen(3000, () => {
  console.log("connected!");
});
