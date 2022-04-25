/** @format */

const mongoose = require("mongoose");

const MedicalSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
	doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
	symptoms: [{ type: String, required: true }],
	diagnosis: { type: String, required: true },

	description: {
		type: String,
		minlength: 1,
		maxlength: 1000,
		trim: true,
	},
	medication: [
		{
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				index: true,
				auto: true,
			},
			name: {
				type: String,
				minlength: 1,
				maxlength: 255,
				trim: true,
			},
			dosage: {
				type: Number,
				min: 1,
				max: 10000,
			},
			manufacturer: {
				type: String,
				minlength: 1,
				maxlength: 255,
				trim: true,
			},
		},
	],
});

module.exports = mongoose.model("MedicalRecord", MedicalSchema);
