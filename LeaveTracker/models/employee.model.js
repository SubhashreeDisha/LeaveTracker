const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^([a-zA-Z0-9._%+-]+)@foundationfinance\.com$/.test(email);
            },
            message: props => `${props.value} is not a valid @foundationfinance.com email`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"]
        // Assume hashed using bcrypt before save
    },
    role: {
        type: String,
        enum: {
            values: ['emp', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'emp',
        required: true
    },
    leaveBalance: {
        cs_sl: {
            type: Number,
            default: 12
        },
        el: {
            type: Number,
            default: 15
        },
        wfh: {
            type: Number,
            default: 18
        }
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields


const Employee = mongoose.model("Employee",employeeSchema);
module.exports = Employee;