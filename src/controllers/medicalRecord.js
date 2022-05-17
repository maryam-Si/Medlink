/** @format */

const mongoose = require("mongoose");
const User = require("../models/user");
const Appointment = require("../models/appointment");

const MedicalRecord = require("../models/medicalRecord");

// add prescription for patient
exports.addToMedicalRecord = async (req, res) => {
	try {
		const { patientId, description, items } = req.body;
		const isDoctorPatient = await Appointment.findOne({
			doctorId: req.user._id,
			clientId: patientId,
		});
		if (!isDoctorPatient) {
			res.status(404).json({ message: "این بیمار متعلق به این پزشک نیست." });
		}
		const newRecord = new MedicalRecord({
			_id: new mongoose.Types.ObjectId(),
			patientId,
			doctorId: req.user._id,

			description,
			items: { _id: new mongoose.Types.ObjectId(), ...items },
		});
		const saveRecord = await newRecord.save();
		if (saveRecord) {
			res.status(201).json({ message: "اطلاعات وارد پرونده پزشکی شد." });
		}
	} catch (err) {
		res.status(500).json({ error: err });
	}
};

// get medical history of patient
exports.getMedicalRecords = async (req, res) => {
	try {
		const records = await MedicalRecord.find({
			userId: req.params.id,
		});
		if (!records) {
			res.status(404).json({ error: "هیچ اطلاعاتی ثبت نشده است." });
		}
		res.status(200).json({
			result: records,
		});
	} catch (err) {
		res.status(500).json({ error: err });
	}
};
