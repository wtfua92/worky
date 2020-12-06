const mongoose = require("mongoose");

const workEntrySchema = new mongoose.Schema({
  startedWork: Date,
  finishedWork: Date,
});

workEntrySchema.virtual("totalHours").get(function () {
  const result = Number(this.finishedWork - this.startedWork) / 3600000;
  return +result.toFixed(2);
});

module.exports = workEntrySchema;
