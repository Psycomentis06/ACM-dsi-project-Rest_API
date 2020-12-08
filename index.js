// imports
var express = require("express");
var app = express();
var cors = require("cors");
// Constants
var PORT = process.env.PORT || 4000;
var API_BASE_URI = "/api/v1/";
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (err, req, res, next) {
  // error
  res.status(500).json({
    valid: false,
    message:
      "Error in body parsing or maybe another problem. please check your body request JSON format or contact us for this bug",
  });
});
// Routes
app.use("/", express.static("public")); // Documentation page
app.get("/", (req, res) => {
  res.send("index.html");
});
const userRoutes = require("./routes/user");
app.use(API_BASE_URI + "user", userRoutes);

app.listen(PORT, () => {
  console.log("Listen to localhost:" + PORT);
});
