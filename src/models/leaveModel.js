const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    


  },
  { timestamps: true },
);

module.exports = mongoose.model("leave", leaveSchema);
