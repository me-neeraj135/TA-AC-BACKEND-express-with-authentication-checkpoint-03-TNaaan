/** @format */

var express = require(`express`);
var router = express.Router();
var passport = require(`passport`);

// github route
router.get("/github", passport.authenticate("github"));

router.get(
  `/github/callbacks`,
  passport.authenticate(`github`, { failureRedirect: `/` }),

  function (req, res) {
    res.redirect(`/users`);
  }
);

// google route

router.get(
  `/google`,
  passport.authenticate(`google`, { scope: ["profile email"] })
);

// google callback route

router.get(
  `/google/callback`,
  passport.authenticate(`google`, {
    failureRedirect: `/`,
  }),
  function (req, res) {
    res.redirect(`/users`);
  }
);

module.exports = router;
