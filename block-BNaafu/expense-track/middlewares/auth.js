/** @format */

let User = require(`../models/User`);

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.passport) {
      next();
    } else {
      res.redirect(`/`);
    }
  },

  userInfo: (req, res, next) => {
    let userId = req.session.passport && req.session.passport.user;
    if (userId) {
      User.findById(userId, "name email phone country avatar", (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        // console.log(res.locals.user);
        return next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      return next();
    }
  },
};
