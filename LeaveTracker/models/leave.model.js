const mongoose = require("mongoose");
const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Employee reference (userId) is required"],
  },
  type: {
    type: String,
    enum: {
      values: ["cs_sl", "el", "wfh"],
      message: "{VALUE} is not a valid leave type",
    },
    required: [true, "Leave type is required"],
  },
  from: {
    type: Date,
    required: [true, "Start date (from) is required"],
    validate: {
      validator: function (val) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return val >= today;
      },
      message: "Start date (from) cannot be in the past",
    },
  },
  to: {
    type: Date,
    required: [true, "End date (to) is required"],
    validate: {
      validator: function (val) {
        return this.from <= val;
      },
      message: "End date (to) must be greater than or equal to start date (from)",
    },
  },

 
   /* Store the original 'to' date before extension request,
   * so you can later compare how many new days were added.
   */
  previousTo: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected",
      "shorten_requested",
      "shorten_approved",
      "extended_requested",
      "extended_approved",
      "cancelled",
    ],
    default: "pending",
  },
}, { timestamps: true });

const Leave = mongoose.model("Leave",leaveSchema);
module.exports = Leave;