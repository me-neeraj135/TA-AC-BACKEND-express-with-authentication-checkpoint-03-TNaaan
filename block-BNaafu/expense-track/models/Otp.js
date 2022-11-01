/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let otpSchema = new Schema(
  {
    email: { type: String },
    otp: { type: String },
    exTime: { type: Number },
  },

  { timestamps: true }
);

module.exports = mongoose.model(`Otp`, otpSchema);
