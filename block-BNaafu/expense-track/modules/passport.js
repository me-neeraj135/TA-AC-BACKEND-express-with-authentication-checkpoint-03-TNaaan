/** @format */

var passport = require(`passport`);
var GithubStrategy = require(`passport-github2`).Strategy;
var GoogleStrategy = require(`passport-google-oauth20`).Strategy;
var LocalStrategy = require(`passport-local`).Strategy;
var User = require(`../models/User`);

// local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: `email`,
      passwordField: `password`,
    },
    function (username, password, done) {
      User.findOne({ email: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false);
        }
        user.verifyPassword(password, (err, result) => {
          if (err) return done(err);
          if (!result) {
            return done(null, false);
          }

          done(null, user);
        });
      });
    }
  )
);

// git hub strategy

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // var githubUser = {
      //   email: profile._json.email,
      //   name: profile._json.name,
      //   avatar: profile._json.picture,
      //   providers: profile.provider,
      // };

      console.log(profile, `gt`);
    }
  )
);

// google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      var googleUser = {
        email: profile._json.email,
        name: profile._json.name,
        avatar: profile._json.picture,
        providers: profile.provider,
      };
      // console.log(googleUser, `guuu`);

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(false);
        if (!user) {
          User.create(googleUser, (err, newUser) => {
            if (err) return done(false);
            // console.log(err, user, `uu`);
            done(null, newUser);
          });
        } else {
          if (user.providers.includes(profile.provider)) {
            done(null, user);
          } else {
            user.providers.push(profile.provider);
            user.googleUser = { ...googleUser };
            user.save((err, addedUser) => {
              if (err) return done(false);
              done(null, addedUser);
            });
          }
        }
      });
    }
  )
);

// user serializer function

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// user deserializer function

passport.deserializeUser(function (id, cb) {
  User.findById(id, "name email username avatar", (err, user) => {
    cb(err, user);
  });
});
