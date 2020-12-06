const mongoose = require("mongoose");

const employeeSchema = require("../schema/employee");

module.exports = mongoose.model("Employee", employeeSchema);
