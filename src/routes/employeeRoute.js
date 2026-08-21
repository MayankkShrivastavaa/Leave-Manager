const express = require("express");
const router = express.Router();

const {
  signupEmployee,
  loginEmployee,
  getProfile,
  updateProfile
} = require("../controllers/employeeController");

const auth = require("../middlewares/auth");

router.post("/signup", signupEmployee);

router.post("/login", loginEmployee);

router.get("/myprofile", auth, getProfile);

router.put("/updateprofile", auth, updateProfile)

module.exports = router;
