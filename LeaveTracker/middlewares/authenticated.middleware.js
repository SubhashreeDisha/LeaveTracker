const jwt = require("jsonwebtoken");
const { getEmployeeById } = require("../services/auth.service");
const SECRET_KEY = "ffc";

const authenticate = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token);
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await getEmployeeById(id);
        if (!user) {
            return res.status(401).send("Invalid Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = authenticate;