const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3500;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://jdstroup10:hbif9227@ds223756.mlab.com:23756/heroku_n9ct6jf5",
  {
    useMongoClient: true
  }
);

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});