const { getAllPendingLeaves, approveEmpLeave } = require("../controllers/admin.controller");
const haveAccess = require("../middlewares/admin.middleware");
const authenticate = require("../middlewares/authenticated.middleware");
const express = require("express");
const router = express.Router();

router.get("/pending-leaves", authenticate, haveAccess, getAllPendingLeaves);
router.post("/approve-leave", authenticate, haveAccess, approveEmpLeave);

module.exports = router;