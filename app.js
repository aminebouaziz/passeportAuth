const express = require("express");

const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");

const passport = require("passport");

const mongo = require("mongodb");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost//loginapp");
const db = mongoose.connection();

// init  App
const app = express();

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

app.listen(5000, () => console.log("server starter on port 5000"));
