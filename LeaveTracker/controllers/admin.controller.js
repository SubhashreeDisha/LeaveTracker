const { pendingLeaves, approveLeave } = require("../services/admin.service");

const getAllPendingLeaves = async (req, res) => {
    try {
        const leaves = await pendingLeaves();
        res.send({
            success: true,
            pendingLeaves: leaves
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Something Went Wrong"
        })
    }
}

const approveEmpLeave = async (req, res) => {
    try {
        const {leaveId} = req.body;
        if (!leaveId) {
            return res.status(400).send({
                success: false,
                message: "leaveId is required"
            });
        }
        await approveLeave(leaveId);
        res.send({
            success: true,
            message: "Leave Approved"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Something went wrong"
        });
    }

}

module.exports = { getAllPendingLeaves, approveEmpLeave };