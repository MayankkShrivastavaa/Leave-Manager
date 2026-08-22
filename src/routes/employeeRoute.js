const express = require("express");
const router = express.Router();

const {
  signupEmployee,
  loginEmployee,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllEmployee,
} = require("../controllers/employeeController");

const auth = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.post("/signup", signupEmployee);

router.post("/login", loginEmployee);

router.get("/myprofile", auth, getProfile);

router.put("/updateprofile", auth, updateProfile);

router.delete("/deleteprofile", auth, deleteProfile);

router.get("/get-all-employees", auth, authorizeAdmin, getAllEmployee);

module.exports = router;
