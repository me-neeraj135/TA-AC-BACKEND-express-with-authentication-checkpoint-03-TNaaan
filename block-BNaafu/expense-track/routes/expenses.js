/** @format */

let express = require(`express`);
let router = express.Router();
let Expense = require(`../models/Expense`);

// router.get(`/`, (req, res, next) => {
//   Expense.find({}, (err, data) => {
//     if (err) return next(err);
//     console.log(err, data, `exxpp`);
//     res.render(`passbook`, { data });
//   });
// });

// add expenses

router.get(`/new`, (erq, res, next) => {
  res.render(`addExpense`);
});

router.post(`/new`, (req, res, next) => {
  req.body.userId = req.session.passport.user;
  Expense.create(req.body, (err, exp) => {
    if (err) return next(err);
    res.redirect(`/earnings/transactions`);
  });
});

module.exports = router;
