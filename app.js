const express = require("express");

const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");

const passport = require("passport");

const mongoose = require("mongoose");

// init  App
const app = express();

// body parser middlerware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = "mongodb://localhost:27017/loginapp";
// routes
const users = require("./routes/userAuth");
app.use("/api/users", users);
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
require("./models/User");
//passeport config
require("./config/passeport")(passport);
// protected routes
const key = "scretkey";

app.get("/api", (req, res) => {
  res.json({
    message: "welcome to the API"
  });
});

app.post("/api/login", (req, res) => {
  // mock user
  const user = {
    id: 2,
    username: "amine",
    email: "amine@gmail.com"
  };

  jwt.sign({ user }, key, (err, token) => {
    res.json({
      token
    });
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, key, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created",
        authData
      });
    }
  });
});

// format of token
// authorization : Bearer <access_token>

// verify token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
// end protected routes

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
