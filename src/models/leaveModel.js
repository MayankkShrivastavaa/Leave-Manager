const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },

    leaveType: {
      type: String,
      enum: ["casual", "sick", "earned", "unpaid"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    leaveStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      default: null,
    },

    actionDate: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("leave", leaveSchema);
