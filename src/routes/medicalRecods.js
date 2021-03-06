/** @format */

const router = require("express").Router();

const MedicalRecordController = require("./../controllers/medicalRecord");
const passport = require("passport");

router.post(
	"/add-medical-record",
	passport.authenticate("jwt", { session: false }),
	MedicalRecordController.addToMedicalRecord
);

// get all records
router.get(
	"/get-medical-records",
	passport.authenticate("jwt", { session: false }),
	MedicalRecordController.getMedicalRecords
);

module.exports = router;
