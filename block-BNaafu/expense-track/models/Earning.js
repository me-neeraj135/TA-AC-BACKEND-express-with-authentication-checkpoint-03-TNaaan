/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;
let earningSchema = new Schema(
  {
    amount: { type: Number, required: true, default: 0 },
    source: { type: String, required: true },
    date: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Use" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Earning`, earningSchema);
