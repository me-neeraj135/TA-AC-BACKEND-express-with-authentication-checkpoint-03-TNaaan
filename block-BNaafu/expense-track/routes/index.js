/** @format */

var express = require("express");
const { route } = require("../app");
var router = express.Router();
var User = require(`../models/User`);
var Otp = require(`../models/Otp`);
var nodeMailer = require(`nodemailer`);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get(`/forgot`, (req, res, next) => {
  res.render(`forgetForm`);
});

router.post(`/forgot`, async (req, res, next) => {
  try {
    await Otp.deleteMany({});

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      req.body.otp = Math.floor(1000 + Math.random() * 9000);
      req.body.exTime = new Date().getTime() + 300 * 1000;

      Otp.create(req.body, (err, otp) => {
        if (err) return next(err);
        res.redirect(`/otp/` + req.body.email);
      });
    }
  } catch (error) {
    return next(error);
  }

  // console.log(err, user, `uuu`);
});

router.get(`/otp/:email`, async (req, res, next) => {
  let email = req.params.email;
  try {
    let otpData = await Otp.findOne({ email });

    let transporter = nodeMailer.createTransport({
      service: `Gmail`,
      auth: {
        user: `welcometoneeraj@gmail.com`,
        pass: process.env.PASS,
      },
    });

    let mailOptions = {
      from: process.env.USER,
      to: otpData.email,
      subject: `Otp for recovery process on expense tracker`,
      text: String(otpData.otp),
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.redirect(`/forgot`);
      } else {
        // verify otp
        res.redirect(`/verifyOtp`);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// verify otp form

router.get(`/verifyOtp`, (req, res, next) => {
  res.render(`verifyOtpForm`);
});

router.post(`/verifyOtp`, async (req, res, next) => {
  let otp = req.body.verifyOtp;
  try {
    let data = await Otp.findOne({ otp });
    if (data) {
      let time = data.exTime - new Date().getTime();
      if (time > 0) {
        res.render(`resetPassword`, { email: data.email });
      } else {
        res.send(`Time Out`);
      }
    }
  } catch (error) {
    console.log(`invalid OTP`);
  }
});

router.post(`/changePassword/:email`, async (req, res, next) => {
  try {
    let email = req.params.email;

    let user = await User.findOne({ email });
    user.password = req.body.password;
    await user.save();
    res.redirect(`/`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
