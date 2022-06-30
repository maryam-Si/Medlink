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

// Update doctor's profile
router.patch(
	"/update-doctor",
	passport.authenticate("jwt", { session: false }),
	DoctorController.updateDoctor
);

//All Doctors who are visited by a patient
// router.get(
// 	"/get-patient-doctors",
// 	passport.authenticate("jwt", { session: false }),
// 	DoctorController.getPatientDoctors
// );

// get all doctors
router.get(
	"/get-all-doctors",
	passport.authenticate("jwt", { session: false }),
	DoctorController.getAllDoctors
);

// // get doctor by id
router.get(
	"/get-doctor/:id",
	passport.authenticate("jwt", { session: false }),
	DoctorController.getDoctorById
);

router.delete(
	"/delete-doctor/:id",
	passport.authenticate("jwt", { session: false }),
	DoctorController.deleteDoctor
);

module.exports = router;
