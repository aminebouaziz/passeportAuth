const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "welcome to the API"
  });
});

app.post("/api", (req, res) => {
  res.json({
    message: "Post created"
  });
});
app.listen(5000, () => console.log("server starter on port 5000"));
