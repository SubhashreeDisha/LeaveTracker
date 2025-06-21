const jwt = require("jsonwebtoken");
const { addEmployee, getEmployee } = require("../services/auth.service");
const SECRET_KEY = "ffc";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newEmployee = await addEmployee( name, email, password );
        //const emp = {};
        // emp.name = newEmployee.name;
        // emp.email = newEmployee.email;
        // emp.role = newEmployee.role;
        // emp.leaveBalance = newEmployee.leaveBalance;
        delete newEmployee.password
        res.status(201).json({
            success: true,
            data: newEmployee,
            message: "Employee registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await getEmployee( email, password );
        delete employee.password;
        if (employee) {
            const token = jwt.sign(
                {
                    id: employee._id,   
                },
                SECRET_KEY,
                {
                    expiresIn: "7d"
                }
            )
                res.cookie("token", token, {
                    httpOnly: true,     // Prevents client-side JavaScript access (security)
                    secure: true,        // Use `true` in production (HTTPS)
                    sameSite: "strict",  // CSRF protection
                    maxAge: 24 * 60 * 60 * 1000 * 7 // 7 day
                })
                .status(200)
                .json({ message: "Login successful",data: employee });

                }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};






module.exports = { register, login };