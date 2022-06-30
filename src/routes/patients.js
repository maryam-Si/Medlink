/** @format */

const router = require("express").Router();
const PatientController = require("../controllers/patients");
const passport = require("passport");

router.post("/register", PatientController.register);
router.post("/login", PatientController.login);

// Update patient
router.patch(
	"/update-patient",
	passport.authenticate("jwt", { session: false }),
	PatientController.updatePatient
);

// get all patients
router.get(
	"/get-all-patients",
	passport.authenticate("jwt", { session: false }),
	PatientController.getAllPatients
);

// All Patients of specific doctor
// router.get(
// 	"/get-doctor-patients",
// 	passport.authenticate("jwt", { session: false }),
// 	PatientController.getDoctorPatients
// );

// get patient by id
router.get(
	"/get-patient/:id",
	passport.authenticate("jwt", { session: false }),
	PatientController.getPatientById
);

router.delete(
	"/delete-patient/:id",
	passport.authenticate("jwt", { session: false }),
	PatientController.deletePatient
);
module.exports = router;
