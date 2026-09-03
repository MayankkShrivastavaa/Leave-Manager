const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getSingleLeave,
  approveLeave,
  rejectLeave
} = require("../controllers/leaveController");
const auth = require("../middlewares/auth");

const authorizeAdmin = require("../middlewares/authorizeAdmin");

// Employee
router.post("/apply", auth, applyLeave);
router.get("/my-leaves", auth, getMyLeaves);

// Admin
router.get("/all", auth, authorizeAdmin, getAllLeaves);
router.patch("/approve/:id", auth, authorizeAdmin, approveLeave);
router.patch("/reject/:id", auth, authorizeAdmin, rejectLeave);


router.get("/:id", auth, getSingleLeave);

// Admin


module.exports = router;
