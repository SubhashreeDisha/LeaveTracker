const { createLeave, getLeaves, getLeaveById } = require("../services/leave.service");
const calculateLeaveDays = require("../helper/getNumberOfDays.helper");
const Leave = require('../models/leave.model');
const applyLeave = async (req, res) => {
  try {
    const { type, from, to } = req.body;
    const user = req.user;
    const myLeaves = await getLeaves(user._id);
    // let isPendingLeave = false;
    if (myLeaves.length > 0) {
      myLeaves.forEach((leave) => {
        if (leave.status === "pending") {
          throw new Error("you have already a pending leave request");
        }
      });
    }
    // 2. Check if from/to dates overlap with any approved leaves
    const approvedLeaves = myLeaves.filter(
      (leave) => leave.status === "approved"
    );

    const newFrom = new Date(from);
    const newToDate = new Date(to);

    for (const leave of approvedLeaves) {
      const existingFrom = new Date(leave.from);
      const existingTo = new Date(leave.to);

      const isOverlapping =
        (newFrom >= existingFrom && newFrom <= existingTo) || // new start in existing
        (newToDate >= existingFrom && newToDate <= existingTo) || // new end in existing
        (newFrom <= existingFrom && newToDate >= existingTo); // new fully surrounds existing

      if (isOverlapping) {
        throw new Error(
          "You already have an approved leave during this date range"
        );
      }
    }

    const totalDays = await calculateLeaveDays(type, from, to); //getNumberOfDays.helper.js
    if (totalDays > user.leaveBalance[type]) {
      throw new Error(`you don't have sufficient ${type} leave balance`);
    }
    const newLeave = await createLeave(user._id, type, from, to);
    res.send({
      success: true,
      message: "Leave Created Successfully",
      newLeave,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    //checking user id format
    const leaves = await getLeaves({ userId });
    res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      data: leaves,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const extendLeave = async (req, res) => {
  try {
    const { leaveId, newToDate } = req.body;
    const userId = req.user._id;

    if (!leaveId || !newToDate) {
      return res.status(400).json({ error: "leaveId and newToDate date are required" });
    }

    const leave = await getLeaveById(leaveId);

    if (leave.status !== 'approved') {
      return res.status(400).json({ error: "Only approved leaves can be extended" });
    }

    const currentTo = new Date(leave.to);//from
    const proposedTo = new Date(newToDate);//to
    
    // Check if extension would overlap with another approved leave
    const overlappingLeaves = await Leave.find({
      userId,
      status: 'approved',
      _id: { $ne: leave._id }, // exclude current leave
      from: { $lte: proposedTo },
      to: { $gte: currentTo }
    });

    if (overlappingLeaves.length > 0) {
      return res.status(400).json({ error: "Extended leave overlaps with another approved leave" });
    }

    // Mark this leave as extension requested
    leave.status = 'extended_requested';
    leave.to = proposedTo;

    await leave.save();

    return res.status(200).json({ message: "Leave extension requested successfully", leave });

  } catch (error) {
    console.error("Extend leave error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { applyLeave, getMyLeaves, extendLeave};
