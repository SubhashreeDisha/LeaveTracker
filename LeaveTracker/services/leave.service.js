
const Leave = require("../models/leave.model");

const createLeave = async ( userId, type, from, to ) => {
    try {
        const newLeave = new Leave({ userId, type, from, to })
        await newLeave.save();
        return newLeave;
    } catch (error) {
        throw new Error(error.message || "Error While Creating Leave");
    }
}
const getLeaves = async ( userId ) => {
    try {
        const leaves = Leave.find({ userId });
        return leaves;
    } catch (error) {
        throw new Error(error.message || "Error while fetching leaves");
    }
}
const getLeaveById = async ( id ) => {
    try {
        const leave = Leave.findById( id );
        if(!leave){
            throw new Error('leave not found')
        }
        return leave;
    } catch (error) {
        throw new Error(error.message || "Error while fetching leaves");
    }
}

module.exports = { createLeave, getLeaves , getLeaveById};