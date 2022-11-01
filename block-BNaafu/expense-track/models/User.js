/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;
let bcrypt = require(`bcrypt`);

let userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    match: /@/,
    lowercase: true,
  },
  name: { type: String, trim: true },

  password: { type: String, trim: true, minlength: 5 },
  age: { type: Number },
  phone: {
    type: Number,

    match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
  },
  country: { type: String, trim: true },
  avatar: { type: String },
  providers: [String],
});

// hash password

userSchema.pre(`save`, function (next) {
  if (this.password && this.isModified(`password`)) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

// verify password

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    cb(err, result);
  });
};

module.exports = mongoose.model(`User`, userSchema);
