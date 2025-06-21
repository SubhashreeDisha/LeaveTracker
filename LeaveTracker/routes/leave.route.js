const express = require("express");
const router = express.Router();
const { applyLeave, getMyLeaves } = require("../controllers/leave.controller");
const authenticate = require("../middlewares/authenticated.middleware")

router.post("/apply-leave", authenticate, applyLeave);
router.get("/my-leaves", authenticate, getMyLeaves);

module.exports = router;
