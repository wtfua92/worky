const mongoose = require("mongoose");

const workEntrySchema = require("../schema/workEntry");

module.exports = mongoose.model("WorkEntry", workEntrySchema);
