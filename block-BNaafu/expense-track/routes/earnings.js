/** @format */

let express = require(`express`);
let router = express.Router();
let Earning = require(`../models/Earning`);
const Expense = require("../models/Expense");

// add earning

router.get(`/new`, (req, res, next) => {
  res.render(`addIncome`);
});

router.post(`/new`, (req, res, next) => {
  req.body.userId = req.session.passport.user;

  // console.log(req.body, `earn`);
  Earning.create(req.body, (err, earn) => {
    if (err) return next(err);
    res.redirect(`/earnings/transactions`);
  });
});

// all transactions

router.get(`/transactions`, async (req, res, next) => {
  try {
    let uId = req.session.passport.user;
    let allInc = await Earning.find({ userId: uId });
    let allExp = await Expense.find({ userId: uId });
    let incSource = await Earning.find({ userId: uId }).distinct(`source`);
    let expCategory = await Expense.find({ userId: uId }).distinct(`category`);

    let allTransactions = [...allInc, ...allExp];

    // all transaction, sorted  in Ascending order
    let data = allTransactions.sort((a, b) => a.createdAt - b.createdAt);

    // console.log(expCategory, `mmm`);
    res.render(`passbook`, { data, allInc, allExp, incSource, expCategory });
  } catch (error) {
    return next(error);
  }
});

// filter income , by source and date

router.post(`/inc`, async (req, res, next) => {
  let { source, from, to } = req.body;
  try {
    let uId = req.session.passport.user;
    let allInc = await Earning.find({ userId: uId });
    let allExp = await Expense.find({ userId: uId });
    let incSource = await Earning.find({ userId: uId }).distinct(`source`);
    let expCategory = await Expense.find({ userId: uId }).distinct(`category`);

    let data = await Earning.find({
      userId: uId,
      source: source,
      date: { $gte: from, $lte: to },
    });

    // console.log(fltIncome, `iii`);
    res.render(`passbook`, { data, allInc, allExp, incSource, expCategory });
  } catch (error) {
    return next(error);
  }
});

// filter expenses , by category and date

router.post(`/exp`, async (req, res, next) => {
  let { category, from, to } = req.body;
  // console.log(req.body);
  try {
    let uId = req.session.passport.user;
    let allInc = await Earning.find({ userId: uId });
    let allExp = await Expense.find({ userId: uId });
    let incSource = await Earning.find({ userId: uId }).distinct(`source`);
    let expCategory = await Expense.find({ userId: uId }).distinct(`category`);

    let data = await Expense.find({
      userId: uId,
      category: category,
      date: { $gte: from, $lte: to },
    });

    // console.log(fltExp, `iii`);
    res.render(`passbook`, { data, allInc, allExp, incSource, expCategory });
  } catch (error) {
    return next(error);
  }
});

// delete entry

router.get(`/:source/:id`, async (req, res, next) => {
  let source = req.params.source;
  let id = req.params.id;

  if (
    source === `salary` ||
    source === "business" ||
    source === "trading" ||
    source === "others"
  ) {
    try {
      await Earning.findByIdAndDelete({ _id: id }, { new: true });

      res.redirect(`/earnings/transactions`);
    } catch (error) {
      return next(error);
    }
  } else {
    try {
      await Expense.findByIdAndDelete({ _id: id }, { new: true });

      res.redirect(`/earnings/transactions`);
    } catch (error) {
      return next(error);
    }
  }
});

module.exports = router;
