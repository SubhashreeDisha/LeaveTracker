const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const { getDateDifferenceInDays } = require("../helper/getDays.helper");
const calculateLeaveDays = require("../helper/getNumberOfDays.helper");

const pendingLeaves = async () => {
  try {
    const pending_leaves = await Leave.find({ status: "pending" });
    return pending_leaves;
  } catch (error) {
    throw new Error("Error While Fetching the pending leaves");
  }
};

const approveLeave = async (leaveId) => {
  try {
    // const leave = await Leave.findOne({ _id: leaveId });
    // const employee = await Employee.findOne({ _id: leave.userId });
    // const milliSeconds = new Date(leave.to) - new Date(leave.from);
    // const days = Math.ceil(milliSeconds / (1000 * 60 * 60 * 24)) + 1;
    // if (leave && leave.type === "cs_sl") {
    //     if (employee.leaveBalance['cs_sl'] >= days) {
    //         employee.leaveBalance['cs_sl'] -= days;
    //         leave.status = "approved";
    //     }
    //     else {
    //         leave.status = "rejected";
    //         await leave.save();
    //         throw new Error("Did not have enough  cs/sl leaves");
    //     }
    // }
    // if (leave && leave.type === "el") {
    //     if (employee.leaveBalance['el'] >= days) {
    //         employee.leaveBalance['el'] -= days;
    //         leave.status = "approved";
    //     }
    //     else {
    //         leave.status = "rejected";
    //         await leave.save();
    //         throw new Error("Did not have enough  el leaves");
    //     }
    // }
    // if (leave && leave.type === "wfh") {
    //     if (employee.leaveBalance['wfh'] >= days) {
    //         employee.leaveBalance['wfh'] -= days;
    //         leave.status = "approved";
    //     }
    //     else {
    //         leave.status = "rejected";
    //         await leave.save();
    //         throw new Error("Did not have enough  wfh leaves");
    //     }
    // }
    // await employee.save();
    // await leave.save();
    // return leave;

    const leave = await Leave.findById(leaveId);
    const user = await Employee.findById(leave.userId);
    const numberOfDays = await calculateLeaveDays(
      leave.type,
      leave.from,
      leave.to
    );
    if (numberOfDays > user.leaveBalance[leave.type]) {
      leave.status = "rejected";
      await leave.save();
      throw new error(
        "the leave request is rejected due to insufficient leave balance"
      );
    }
    leave.status = "approved";
    await leave.save();

    user.leaveBalance[leave.type] -= numberOfDays;
    await user.save();

    
  } catch (error) {
    throw new Error(
      error.message || "Error While Fetching the approving leaves"
    );
  }
};

module.exports = { pendingLeaves, approveLeave };
