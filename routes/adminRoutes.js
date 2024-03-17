const express = require("express");
const router = express.Router();
const {adminSignUp, adminLogin} = require("../controllers/adminController");
const {isAdminAuthenticated}  = require('../middlewares/adminAuth');

const { getAllSubmissions, getPaperById } = require("../controllers/adminSubmissionFetching");

router.get("/getallsubmissions", isAdminAuthenticated ,getAllSubmissions);
router.get("/getpaperbyid", isAdminAuthenticated, getPaperById);
router.post("/signup",isAdminAuthenticated ,adminSignUp);
router.get("/login", adminLogin);
module.exports = routers;