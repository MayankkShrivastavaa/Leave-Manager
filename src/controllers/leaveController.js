const leaveModel = require("../models/leaveModel");
const employeeModel = require("../models/employeeModel");

const { isValid, isValidObjectId } = require("../utils/validator");

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

// Get My Leaves
const getMyLeaves = async (req, res) => {
  try {
    let employeeId = req.employeeId;

    let leaves = await leaveModel.find({ employee: employeeId }).sort({
      createdAt: -1,
    });

    if (leaves.length === 0) {
      return res.status(404).json({ msg: "No Leaves Found" });
    }

    return res.status(200).json({
      msg: "Leaves Fetched Successfully",
      totalLeaves: leaves.length,
      leaves,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Leaves (Admin)
const getAllLeaves = async (req, res) => {
  try {
    let leaves = await leaveModel
      .find()
      .populate("employee", "fullName email department")
      .populate("actionBy", "fullName email")
      .sort({ createdAt: -1 });

    if (leaves.length === 0) {
      return res.status(404).json({ msg: "No Leaves Found" });
    }

    return res.status(200).json({
      msg: "All Leaves Fetched Successfully",
      totalLeaves: leaves.length,
      leaves,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Single Leave
const getSingleLeave = async (req, res) => {
  try {
    let leaveId = req.params.id;

    if (!isValidObjectId(leaveId)) {
      return res.status(400).json({ msg: "Invalid Leave Id" });
    }

    let leave = await leaveModel
      .findById(leaveId)
      .populate("employee", "fullName email department")
      .populate("actionBy", "fullName email");

    if (!leave) {
      return res.status(404).json({ msg: "Leave does not exist" });
    }

    return res.status(200).json({ msg: "Leave Fetched Successfully", leave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Approve Leave (Admin)
const approveLeave = async (req, res) => {
  try {
    let leaveId = req.params.id;

    if (!isValidObjectId(leaveId)) {
      return res.status(400).json({ msg: "Invalid Leave ID" });
    }

    let leave = await leaveModel.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ msg: "Leave does not exist" });
    }

    if (leave.leaveStatus !== "pending") {
      return res
        .status(400)
        .json({ msg: "Only Pending Request can be approved." });
    }

    leave.leaveStatus = "approved";
    leave.actionBy = req.employeeId;
    leave.actionDate = new Date();

    let updatedLeave = await leave.save();

    return res
      .status(200)
      .json({ msg: "Leave Approved Successfully", updatedLeave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Reject Leave (Admin)
const rejectLeave = async (req, res) => {
  try {
    let leaveId = req.params.id;

    if (!isValidObjectId(leaveId)) {
      return res.status(400).json({ msg: "Invalid Leave ID" });
    }

    let leave = await leaveModel.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ msg: "Leave does not exist" });
    }

    if (leave.leaveStatus !== "pending") {
      return res
        .status(400)
        .json({ msg: "Only Pending Request can be approved." });
    }

    leave.leaveStatus = "rejected";
    leave.actionBy = req.employeeId;
    leave.actionDate = new Date();

    let updatedLeave = await leave.save();

    return res
      .status(200)
      .json({ msg: "Leave Approved Successfully", updatedLeave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Cancel Leave
const cancelLeave = async (req, res) => {
  try {
     let leaveId = req.params.id;

    if (!isValidObjectId(leaveId)) {
      return res.status(400).json({ msg: "Invalid Leave ID" });
    }

    let leave = await leaveModel.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ msg: "Leave does not exist" });
    }

    if (leave.leaveStatus !== "pending") {
      return res
        .status(400)
        .json({ msg: "Only Pending Request can be approved." });
    }

    leave.leaveStatus = "cancelled";
    leave.actionBy = req.employeeId;
    leave.actionDate = new Date();

    let updatedLeave = await leave.save();

    return res
      .status(200)
      .json({ msg: "Leave Approved Successfully", updatedLeave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Leave
const deleteLeave = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getSingleLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  deleteLeave,
};
