/** @format */

const router = require("express").Router();

const UserController = require("./../controllers/user");
const errorInvalid = require("./../middlewares/errorInvalid");

const passport = require("passport");
const adminAuth = require("../middlewares/adminAuth");

router.get("/create-first-admin", UserController.createFirstAdmin);

router.post(
	"/login",
	UserController.validate("login"),
	errorInvalid,
	UserController.login
);

// // Profile Routes
// Get own user's profile
router.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.getUserProfile
);

// Update profile
router.patch(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.updateUserProfile
);

// Update doctor's information
router.patch(
	"/profile/doctor-info",
	passport.authenticate("jwt", { session: false }),
	UserController.updateDoctorInfo
);

// Update client's information
router.patch(
	"/profile/client-info",
	passport.authenticate("jwt", { session: false }),
	UserController.updateClientInfo
);

// get all patients by admin
router.get(
	"/get-all-patients",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.getAllPatients
);

// All Patients of specific doctor
router.get(
	"/get-doctor-patients",
	passport.authenticate("jwt", { session: false }),
	UserController.getDoctorPatients
);

// get patient by id
router.get(
	"/get-patient/:id",
	passport.authenticate("jwt", { session: false }),
	UserController.getPatientById
);

// All Doctors who are visited by a patient
router.get(
	"/get-patient-doctors",
	passport.authenticate("jwt", { session: false }),
	UserController.getPatientDoctors
);

// get all doctors
router.get(
	"/get-all-doctors",
	passport.authenticate("jwt", { session: false }),
	UserController.getAllDoctors
);

// get doctor by id
router.get(
	"/get-doctor/:id",
	passport.authenticate("jwt", { session: false }),
	UserController.getDoctorById
);

router.post(
	"/add-user",
	//This will check if the request has a JWT token and if the JWT token is valid
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.validate("addUser"),
	errorInvalid,
	UserController.addUser
);

router.delete(
	"/delete-user/:id",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.deleteUser
);

module.exports = router;
