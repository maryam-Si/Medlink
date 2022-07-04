/** @format */

const router = require("express").Router();

const UserController = require("./../controllers/user");

const passport = require("passport");

router.post("/login", UserController.login);

router.post("/register-doctor", UserController.registerDoctor);
router.post("/register-patient", UserController.registerPatient);

// get all doctors
router.get(
	"/get-all-doctors",
	passport.authenticate("jwt", { session: false }),
	UserController.getAllDoctors
);
// get all patient
router.get(
	"/get-all-patients",
	passport.authenticate("jwt", { session: false }),
	UserController.getAllPatients
);

// Update doctor
router.patch(
	"/update-doctor",
	passport.authenticate("jwt", { session: false }),
	UserController.updateDoctor
);
// Update patient
router.patch(
	"/update-patient",
	passport.authenticate("jwt", { session: false }),
	UserController.updatePatient
);

// get doctor by id
router.get(
	"/get-doctor/:id",
	passport.authenticate("jwt", { session: false }),
	UserController.getDoctorById
);

// get patient by id
router.get(
	"/get-patient/:id",
	passport.authenticate("jwt", { session: false }),
	UserController.getPatientById
);

router.delete(
	"/delete-doctor/:id",
	passport.authenticate("jwt", { session: false }),

	UserController.deleteDoctor
);
router.delete(
	"/delete-patient/:id",
	passport.authenticate("jwt", { session: false }),

	UserController.deletePatient
);

// All Patients of specific doctor
// router.get(
// 	"/get-doctor-patients",
// 	passport.authenticate("jwt", { session: false }),
// 	UserController.getDoctorPatients
// );

// All Doctors who are visited by a patient
// router.get(
// 	"/get-patient-doctors",
// 	passport.authenticate("jwt", { session: false }),
// 	UserController.getPatientDoctors
// );

module.exports = router;
