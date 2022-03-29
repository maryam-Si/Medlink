/** @format */

const mongoose = require("mongoose");

const Appointment = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
	clientId: { type: mongoose.Schema.Types.ObjectId, required: true },
	createdAt: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", Appointment);
