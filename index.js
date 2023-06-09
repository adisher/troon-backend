var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const { Strategy } = require("passport-local");
var cors = require("cors");
const AWS = require('aws-sdk');
const multer = require("multer");
const multerS3 = require('multer-s3');
require('dotenv').config();

const inputMiddleware = require("./middlewares/inputMiddleware");
const {
  userRoute,
  adminRoute,
  clientRoute,
  clientDocumentsRoute,
  adminDocumentRoutes,
} = require("./routes");

const authMiddleware = require("./middlewares/authMiddleware");


var app = express();
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '/tmp'));
//   },
//   filename: function (req, file, cb) {
//     console.log("f: ", file)
//     cb(null, file.originalname); //Appending .jpg
//   },
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION
});

// multer for s3
var storage = multerS3({
  s3: s3,
  bucket: 'troon',
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname);
  }
})

var upload = multer({ storage: storage });
// const upload = multer({ storage: storage });

//DB Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URL, (err) => {
  if (err) {
    return console.log("error connecting with DB", err);
  }
  console.log("DateBase connected successfully");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(inputMiddleware.handleOptions);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/tmp'));
app.use('/tmp', express.static('tmp'));

passport.use(
  new Strategy((username, password, done) => {
    authMiddleware.executeLogin(username, password, done);
  })
);

// actual routes
app.post("/signup", authMiddleware.userSignup);
app.post(
  "/login",
  passport.initialize(),
  passport.authenticate("local", {
    session: false,
    scope: [],
  }),
  authMiddleware.generateToken,
  authMiddleware.respond
);

// test routes
// app.use('/', indexRouter);
app.use(authMiddleware.verifyToken);
app.use("/users", userRoute); //Mount userRoute in express
app.use("/admin", adminRoute); //Mount adminRoute in express
app.use("/client", clientRoute); //Mount clientRoute in express
app.post("/upload", upload.single("file"), function (req, res, next) {
  console.log(req.file);
  return res.status(200).json(req.file);
});
app.use(
  "/client/documents",
  authMiddleware.checkClientPermissions,
  clientDocumentsRoute
);
app.use(
  "/admin/documents",
  authMiddleware.checkAdminPermissions,
  adminDocumentRoutes
);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
