/** @format */

var express = require("express");

const passport = require("passport");
var router = express.Router();
var User = require(`../models/User`);
var Earning = require(`../models/Earning`);
var Expense = require(`../models/Expense`);
var session = require(`express-session`);
var moment = require(`moment`);

const firstDay = moment().clone().startOf("month").format("YYYY-MM-DD");
const lastDay = moment().clone().endOf("month").format("YYYY-MM-DD");
const month = moment().format(`MMMM`) + `,` + moment().year();
console.log(month, `www`);

/* user dashboard  */
router.get("/", async function (req, res, next) {
  try {
    let earnings = await Earning.aggregate([
      {
        $match: { date: { $gte: firstDay, $lte: lastDay } },
      },
      {
        $group: {
          _id: "$source",
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);
    let expenses = await Expense.aggregate([
      {
        $match: { date: { $gte: firstDay, $lte: lastDay } },
      },
      {
        $group: { _id: "$category", totalExpenses: { $sum: "$amount" } },
      },
    ]);
    // console.log(earnings, expenses, `eee`);

    res.render("dashboard", { earnings, expenses, month });
  } catch (error) {
    return next(error);
  }
});

// get user register

router.get(`/new`, (req, res, next) => {
  res.render(`register`);
});

router.post(`/new`, (req, res, next) => {
  // console.log(req.body);
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect(`/`);
  });
});

// login user

router.post(
  `/login`,
  passport.authenticate(`local`, { failureRedirect: `/`, failureFlash: true }),
  function (req, res) {
    // console.log(req.session, `sess`);
    res.redirect(`/users`);
  }
);

// logout user

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  return res.redirect(`/`);
});
module.exports = router;
