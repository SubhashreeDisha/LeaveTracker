const {
  createLeave,
  getLeaves,
  getLeaveById,
} = require("../services/leave.service");
const calculateLeaveDays = require("../helper/getNumberOfDays.helper");
const Leave = require("../models/leave.model");
const applyLeave = async (req, res) => {
  try {
    const { type, from, to } = req.body;
    const user = req.user;
    //1.if a leave request is in pending then the employee cant able to create a new leave
    const myLeaves = await getLeaves(user._id);
    if (myLeaves.length > 0) {
      myLeaves.forEach((leave) => {
        if (leave.status === "pending") {
          throw new Error("you have already a pending leave request");
        }
        if (leave.status === "shorten_requested") {
          throw new Error("you have already a shorten requested leave ");
        }
        if (leave.status === "extended_requested") {
          throw new Error("you have already a extended requested leave ");
        }
      });
    }
    // 2. Check if currently the employee is on an approved leave or not
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentlyOnLeave = myLeaves.some((leave) => {
      return (
        leave.status === "approved" &&
        new Date(leave.from) <= today &&
        new Date(leave.to) >= today
      );
    });
    if (isCurrentlyOnLeave) {
      throw new Error("You are currently on an approved leave.so you cant able to apply for a another leave");
    }
    // 3. Check if from/to dates overlap with any approved leaves
    // const approvedLeaves = myLeaves.filter(
    //   (leave) => leave.status === "approved"
    // );

    // const newFrom = new Date(from);
    // const newToDate = new Date(to);

    // for (const leave of approvedLeaves) {
    //   const existingFrom = new Date(leave.from);
    //   const existingTo = new Date(leave.to);

    //   const isOverlapping =
    //     (newFrom >= existingFrom && newFrom <= existingTo) || // new start in existing
    //     (newToDate >= existingFrom && newToDate <= existingTo) || // new end in existing
    //     (newFrom <= existingFrom && newToDate >= existingTo); // new fully surrounds existing

    //   if (isOverlapping) {
    //     throw new Error(
    //       "You already have an approved leave during this date range"
    //     );
    //   }
    // }

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
    const leaves = await getLeaves(userId);
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

    if (!leaveId) {
      throw new Error("leaveId is required");
    }

    if (!newToDate) {
      throw new Error("newToDate date is required");
    }

    const leave = await getLeaveById(leaveId);

    if (leave.status !== "approved" || leave.status !== "extended_approved") {
      throw new Error("only approved/extended_approved leaves can be extended");
    }

    const currentTo = new Date(leave.to);
    const proposedTo = new Date(newToDate); //to
    if (proposedTo <= currentTo) {
      throw new Error("New 'to' date must be after current 'to' date");
    }
    const previouslyDeletedDays = await calculateLeaveDays(
      leave.type,
      leave.from,
      leave.to
    );
    const numberOfDaysAfterExtended = await calculateLeaveDays(
      leave.type,
      leave.from,
      proposedTo
    );
    const totalDaysToDelete = numberOfDaysAfterExtended - previouslyDeletedDays;
    if (totalDaysToDelete > req.user.leaveBalance[leave.type]) {
      throw new Error("you dont have sufficient leave balance");
    }
    // Mark this leave as extension requested
    leave.status = "extended_requested";
    leave.previousTo = currentTo;
    leave.to = proposedTo;

    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave extension requested successfully",
      leave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, extendLeave };
