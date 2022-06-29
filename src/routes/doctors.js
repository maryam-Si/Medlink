/** @format */

const router = require("express").Router();
const errorInvalid = require("./../middlewares/errorInvalid");
const passport = require("passport");
const DoctorController = require("../controllers/doctors");

router.post(
	"/login",
	// DoctorController.validate("login"),
	// errorInvalid,
	DoctorController.login
);

router.post(
	"/register",
	// DoctorController.validate("addUser"),
	// errorInvalid,
	DoctorController.register
);
module.exports = router;
