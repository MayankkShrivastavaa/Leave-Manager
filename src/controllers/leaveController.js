const leaveModel = require("../models/leaveModel");
const employeeModel = require("../models/employeeModel");

const { isValid } = require("../utils/validator");

// Apply Leave

const applyLeave = async (req, res) => {
  try {
    let leaveData = req.body;

    if (!leaveData || Object.keys(leaveData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided " });
    }

    let { leaveType, startDate, endDate, reason } = leaveData;

    // Leave Type Validation
    if (!isValid(leaveType)) {
      return res.status(400).json({ msg: "Leave Type is Required" });
    }

    if (
      leaveType !== "casual" &&
      leaveType !== "sick" &&
      leaveType !== "earned" &&
      leaveType !== "unpaid"
    ) {
      return res.status(400).json({ msg: "Invalid Leave Type" });
    }

    // Start Date Validation
    if (!isValid(startDate)) {
      return res.status(400).json({ msg: "Start date is Required" });
    }

    // End Date Validation
    if (!isValid(endDate)) {
      return res.status(400).json({ msg: "End date is Required" });
    }

    // Reason
    // Start Date Validation
    if (!isValid(reason)) {
      return res.status(400).json({ msg: " Leave Reason is Required" });
    }

    // Date Validation
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (isNaN(start.getTime())) {
      return res.status(400).json({ msg: "Invalid Start Date" });
    }

    if (isNaN(end.getTime())) {
      return res.status(400).json({ msg: "Invalid End Date" });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ msg: "Start Date can't be greater than end date" });
    }

    let employee = await employeeModel.findById(req.employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee Not Found" });
    }

    let leaveAdded = await leaveModel.create({
      employee: req.employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res
      .status(201)
      .json({ msg: "Leave Applied Successfully", leaveAdded });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { applyLeave };
