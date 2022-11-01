/** @format */

var createError = require("http-errors");
var express = require("express");

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var earningRouter = require(`./routes/earnings`);
var expenseRouter = require(`./routes/expenses`);
var authRouter = require(`./routes/auth`);
var passport = require(`passport`);

var mongoose = require(`mongoose`);
var mongoStore = require(`connect-mongo`);
var session = require(`express-session`);
var flash = require(`connect-flash`);
require(`dotenv`).config();

var auth = require(`./middlewares/auth`);

// connect database

mongoose.connect(
  `mongodb://localhost/expense-track`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    console.log(err ? err : `database connected`);
  }
);

require(`./modules/passport`);
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
// add session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: `mongodb://localhost/expense-track` }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// add flash
app.use(flash());

// user info

app.use(auth.userInfo);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(`/earnings`, earningRouter);
app.use(`/expenses`, expenseRouter);

app.use(`/auth`, authRouter);

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
