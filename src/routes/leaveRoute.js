const express = require("express");
const router = express.Router();

const { applyLeave } = require("../controllers/leaveController");
const auth = require("../middlewares/auth");

router.post("/apply", auth, applyLeave)

module.exports = router;
