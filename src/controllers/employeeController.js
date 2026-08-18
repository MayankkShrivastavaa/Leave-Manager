const bcrypt = require("bcrypt");
const employeeModel = require("../models/employeeModel");
const {
  isValid,
  isValidName,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");

//SignUP
const signupEmployee = async (req, res) => {
  try {
    let employeeData = req.body;

    if (!employeeData || Object.keys(employeeData).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided !" });
    }

    let { fullName, email, password, department } = employeeData;

    // Full Name Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "FullName is Required" });
    }

    if (fullName.trim().length < 2 || !isValidName(fullName)) {
      return res.status(400).json({ msg: "Invalid FullName" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidName(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await employeeModel.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { signupEmployee };
