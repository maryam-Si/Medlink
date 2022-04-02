/** @format */

const mongoose = require("mongoose");

const ClientInfo = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: mongoose.Schema.Types.ObjectId, required: true },
	weight: {
		type: String,
	},
	height: { type: String },

	pastMedicalHistory: [{ type: String }],

	medicationHistory: [
		{
			name: {
				type: String,
				trim: true,
			},
			dosage: {
				type: Number,
			},
		},
	],
	medicationAllergies: [{ type: String }],
	surgeries: [{ type: String }],

	bloodType: {
		type: String,
		enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
	},
});

module.exports = mongoose.model("ClientInfo", ClientInfo);
