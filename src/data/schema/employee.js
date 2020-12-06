const mongoose = require("mongoose");

const workEntrySchema = require("./workEntry.js");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  workLog: [workEntrySchema],
});

employeeSchema.virtual("lastWorkEntry").get(function () {
  return this.workLog[this.workLog.length - 1];
});

employeeSchema.virtual("lastWeekTotal").get(function () {
  const lastWorkEntry = this.lastWorkEntry.startedWork;
  const lastWorkEntryDay = 6 - lastWorkEntry.getDay();
  const beginningOfWeek = new Date();

  beginningOfWeek.setDate(beginningOfWeek.getDate() - lastWorkEntryDay);
  beginningOfWeek.setHours(0);
  beginningOfWeek.setMinutes(0);
  beginningOfWeek.setSeconds(0);

  const lastWeekWorkLog = this.workLog.filter(
    (entry) => entry.startedWork > beginningOfWeek
  );

  return lastWeekWorkLog.reduce((total, entry) => {
    return total + entry.totalHours;
  }, 0);
});

module.exports = employeeSchema;
