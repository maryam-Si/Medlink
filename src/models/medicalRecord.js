/** @format */

const mongoose = require("mongoose");

const MedicalSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
		doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
		prescription: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", MedicalSchema);
