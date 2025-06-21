const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Employee = require("../models/employee.model");

const addEmployee = async ( name, email, password) => {
    try {
        const userExisted = await Employee.findOne({ email });
        if (userExisted) {
            throw new Error("User Already Existed");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
        });
        await newEmployee.save();
        return newEmployee;
    } catch (error) {
        throw new Error(error || "Error While Adding Employee To DB");
    }
}

const getEmployee = async ( email, password ) => {
    try {
        const employee = await Employee.findOne({ email });
        console.log(employee);
        
        if (!employee) {
            throw new Error("Invalid Credentials");
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if (isMatch) {
            return employee;
        }
        else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        throw new Error(error || "Error While fetchig Employee From DB")
    }
}


const getEmployeeById = async(id) => {
try {
    const user = await Employee.findById(id);
    if(!user){
        throw new Error("user not found");
    }
    return user;
} catch (error) {
    throw new Error(error);
}

}

module.exports = { addEmployee, getEmployee, getEmployeeById};