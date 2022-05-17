/** @format */

const mongoose = require("mongoose");

const MedicalSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
	doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },

	items: [
		{
			name: {
				type: String,
				minlength: 1,
				maxlength: 255,
			},
			count: {
				type: Number,
				min: 1,
				max: 10000,
			},
			description: {
				type: String,
				minlength: 1,
				maxlength: 1000,
			},
		},
	],
});

module.exports = mongoose.model("MedicalRecord", MedicalSchema);
