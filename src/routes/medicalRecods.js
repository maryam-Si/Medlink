/** @format */

const router = require("express").Router();

const MedicalRecordController = require("./../controllers/medicalRecord");
const passport = require("passport");
const adminAuth = require("../middlewares/adminAuth");

router.post(
	"/add-medical-record",
	passport.authenticate("jwt", { session: false }),
	MedicalRecordController.addToMedicalRecord
);

// get all prescriptions which this doctor has written
router.get(
	"/get-medical-records",
	passport.authenticate("jwt", { session: false }),
	MedicalRecordController.getMedicalRecords
);

// get all prescriptions which this doctor has written
router.get(
	"/get-all-medical-records",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	MedicalRecordController.getAllMedicalRecords
);
