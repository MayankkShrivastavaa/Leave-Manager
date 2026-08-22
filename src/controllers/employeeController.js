const bcrypt = require("bcrypt");
const employeeModel = require("../models/employeeModel");
const jwt = require("jsonwebtoken");

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

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await employeeModel.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    // Department Validation
    if (!isValid(department)) {
      return res.status(400).json({ msg: "Department is Required" });
    }

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    employeeData.password = hashedPassword;

    const user = await employeeModel.create(employeeData);
    return res.status(201).json({ msg: "Signup Completed Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login
const loginEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    const { email, password } = data;

    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    const employee = await employeeModel.findOne({ email });

    if (!employee) {
      return res.status(404).json({ msg: "Employee Not Found" });
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: " Incorrect Password" });
    }

    const token = jwt.sign(
      {
        employeeId: employee._id,
        role: employee.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Profile
const getProfile = async (req, res) => {
  try {
    let employeeId = req.employeeId;
    const employee = await employeeModel
      .findById(employeeId)
      .select("-password");

    if (!employee) {
      return res.status(404).json({ msg: "Employee Not Found" });
    }

    return res
      .status(200)
      .json({ msg: "Profile Fetched Successfully", employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    let employeeId = req.employeeId;
    let employeeData = req.body;

    if (!employeeData || Object.keys(employeeData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! Enter Data to Update" });
    }

    let { fullName, email, department, password } = employeeData;

    if (fullName !== undefined) {
      if (!isValid(fullName)) {
        return res.status(400).json({ msg: "FullName is Required" });
      }

      if (fullName.trim().length < 2 || !isValidName(fullName)) {
        return res.status(400).json({ msg: "Invalid FullName" });
      }
    }

    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is Required" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }

      let duplicateEmail = await employeeModel.findOne({
        email,
        _id: { $ne: employeeId },
      });

      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email Already Exists" });
      }
    }

    if (department !== undefined) {
      if (!isValid(department)) {
        return res.status(400).json({ msg: "Department is Required" });
      }
    }

    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Password is Required" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({ msg: "Invalid Password" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      employeeData.password = hashedPassword;
    }

    const update = await employeeModel
      .findByIdAndUpdate(employeeId, employeeData, { new: true })
      .select("-password");

    if (!update) {
      return res.status(404).json({ msg: "Employee Not Found" });
    }

    return res
      .status(200)
      .json({ msg: "Profile Updated Successfully", update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    let employeeId = req.employeeId;

    let deleteEmp = await employeeModel.findByIdAndDelete(employeeId);

    if (!deleteEmp) {
      return res
        .status(404)
        .json({ msg: "Employee Not Found Or Already Exists" });
    }

    return res.status(200).json({ msg: "Profile Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get All Employee
const getAllEmployee = async (req, res) => {
  try {
    let employees = await employeeModel.find().select("-password");
    let totalEmployees = await employeeModel.countDocuments();

    if (employees.length === 0) {
      return res.status(404).json({ msg: "No Employees Found" });
    }

    return res.status(200).json({
      msg: "Employees Data Fetched Successfully",
      employeesData: {
        "Total Employees": totalEmployees,
        employees,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signupEmployee,
  loginEmployee,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllEmployee,
};
