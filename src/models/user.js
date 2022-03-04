/** @format */

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	username: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true },
	createdAt: { type: String, required: true },

	fullName: { type: String },
	type: { type: Number }, //1=doctor  2=patient

	profileImage: {
		type: String, // Link
	},
	sex: {
		type: String,
		lowercase: true,
		enum: ["male", "female"],
	},
	dateOfBirth: {
		type: String, // Date
	},
	phoneNumber: {
		type: String,
		trim: true,
	},
	address: {
		type: String,
	},

	doctorInfo: {
		workSchedule: {
			openingTime: String,
			closingTime: String,
			lunchBreakStart: String,
			lunchBreakEnd: String,
			unavailableDateTimes: [
				{
					startDateTime: String,
					endDateTime: String,
					modifier: String,
				},
			],
		},
		licence: {
			type: String,
		},

		specialtyField: {
			type: String,

			trim: true,
		},
		education: [
			{
				type: String,
			},
		],
		yearsExperience: {
			type: Number,
		},
	},
	clientInfo: {
		weight: {
			type: Number,
		},
		medicalHistory: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					index: true,
					auto: true,
				},
				startDate: {
					type: String, // Date
				},
				condition: {
					type: String,

					trim: true,
				},
				notes: {
					type: String,

					trim: true,
				},
			},
		],

		medication: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					index: true,
					auto: true,
				},
				name: {
					type: String,
					trim: true,
				},
				dosage: {
					type: Number,
				},
			},
		],
		bloodType: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
		},
	},
});

module.exports = mongoose.model("User", UserSchema);
