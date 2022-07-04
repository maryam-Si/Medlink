/** @format */

const mongoose = require("mongoose");

const ClientInfo = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		userId: { type: mongoose.Schema.Types.ObjectId, required: true },
		weight: {
			type: String,
		},
		height: { type: String },

		bloodType: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
		},
		isPregnant: { type: Boolean },
		specialDiseases: [String],

		currentMedications: [String],

		medicationAllergies: [String],
		surgeries: [String],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("ClientInfo", ClientInfo);
