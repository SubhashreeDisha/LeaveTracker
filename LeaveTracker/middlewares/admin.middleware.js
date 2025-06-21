const Employee = require("../models/employee.model");

const haveAccess = (req, res, next) => {
    if (req.user?.role === "admin") {
        next();
    } else {
        res.status(403).send("Access denied: Admins only");
    }
}

module.exports = haveAccess;