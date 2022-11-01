/** @format */

let moment = require(`moment`);

const startOfMonth = moment()
  .clone()
  .startOf("month")
  .format("YYYY-MM-DD hh:mm");
const endOfMonth = moment().clone().endOf("month").format("YYYY-MM-DD hh:mm");

module.exports = {
  firstDay: moment().clone().startOf("month").format("YYYY-MM-DD hh:mm"),
  lastDay: moment().clone().endOf("month").format("YYYY-MM-DD hh:mm"),
};
