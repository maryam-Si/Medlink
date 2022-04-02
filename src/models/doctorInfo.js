/** @format */

const mongoose = require("mongoose");

const DoctorInfo = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, required: true },

	workSchedule: [{ day: String, openingTime: String, closingTime: String }],

	medicalCode: { type: String, required: true },

	education: {
		type: String,
		trim: true,
	},
	specialtyField: {
		type: String,
		trim: true,
	},
	yearsExperience: {
		type: Number,
	},
});

module.exports = mongoose.model("DoctorInfo", DoctorInfo);
